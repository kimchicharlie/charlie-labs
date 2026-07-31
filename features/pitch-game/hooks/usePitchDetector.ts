"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { median, PitchSample } from "../audio/scoring";

const MINIMUM_CLARITY = 0.82;
const UI_UPDATE_INTERVAL_MS = 70;
const DISPLAY_SAMPLE_COUNT = 5;

export type PitchDetectorErrorCode =
  | "unsupported"
  | "blocked"
  | "unavailable"
  | "ended";

type UsePitchDetectorResult = {
  detectedFrequency: number | null;
  error: PitchDetectorErrorCode | null;
  start: () => Promise<PitchDetectorErrorCode | null>;
  playTone: (frequency: number, durationMs: number) => Promise<void>;
  connectAnalysis: () => void;
  disconnectAnalysis: () => void;
  beginListening: () => void;
  getListeningSamples: () => PitchSample[];
  endListening: () => PitchSample[];
  cleanup: () => Promise<void>;
  clearError: () => void;
};

export const usePitchDetector = (): UsePitchDetectorResult => {
  const [detectedFrequency, setDetectedFrequency] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<PitchDetectorErrorCode | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const workletRef = useRef<AudioWorkletNode | null>(null);
  const samplesRef = useRef<PitchSample[]>([]);
  const displaySamplesRef = useRef<number[]>([]);
  const listeningStartedAtRef = useRef(0);
  const lastUiUpdateRef = useRef(0);
  const listeningRef = useRef(false);
  const connectedRef = useRef(false);
  const stoppingRef = useRef(false);
  const readyRef = useRef(false);
  const startPromiseRef = useRef<Promise<PitchDetectorErrorCode | null> | null>(
    null,
  );
  const generationRef = useRef(0);
  const mountedRef = useRef(true);

  const disconnectAnalysis = useCallback((): void => {
    if (!connectedRef.current) return;
    try {
      sourceRef.current?.disconnect(workletRef.current!);
    } catch {
      // Node may already have been disconnected by browser cleanup.
    }
    connectedRef.current = false;
  }, []);

  const cleanup = useCallback(async (): Promise<void> => {
    generationRef.current += 1;
    stoppingRef.current = true;
    listeningRef.current = false;
    readyRef.current = false;
    disconnectAnalysis();

    if (workletRef.current) {
      workletRef.current.port.onmessage = null;
      try {
        workletRef.current.disconnect();
      } catch {
        // Zero-output worklet may not have an outgoing connection.
      }
    }

    streamRef.current?.getTracks().forEach((track) => {
      track.onended = null;
      track.stop();
    });

    const audioContext = audioContextRef.current;
    if (audioContext && audioContext.state !== "closed") {
      try {
        await audioContext.close();
      } catch {
        // Continue clearing references even if browser rejects context close.
      }
    }

    audioContextRef.current = null;
    streamRef.current = null;
    sourceRef.current = null;
    workletRef.current = null;
    samplesRef.current = [];
    displaySamplesRef.current = [];
    if (mountedRef.current) setDetectedFrequency(null);
    stoppingRef.current = false;
  }, [disconnectAnalysis]);

  const start = useCallback(async (): Promise<PitchDetectorErrorCode | null> => {
    if (readyRef.current) return null;
    if (startPromiseRef.current) return startPromiseRef.current;

    const startPromise = (async (): Promise<PitchDetectorErrorCode | null> => {
      const generation = generationRef.current + 1;
      generationRef.current = generation;
      if (mountedRef.current) setError(null);

      if (!navigator.mediaDevices?.getUserMedia || !window.AudioWorkletNode) {
        if (mountedRef.current) setError("unsupported");
        return "unsupported";
      }

      try {
        // Created before first await so browser autoplay policy sees user click.
        const audioContext = new AudioContext({ latencyHint: "interactive" });
        audioContextRef.current = audioContext;
        await audioContext.resume();

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            autoGainControl: false,
            echoCancellation: false,
            noiseSuppression: false,
            channelCount: 1,
          },
          video: false,
        });

        if (generation !== generationRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          if (audioContext.state !== "closed") await audioContext.close();
          return "unavailable";
        }
        streamRef.current = stream;

        await audioContext.audioWorklet.addModule(
          "/audio/pitch-detector.worklet.js",
        );
        if (generation !== generationRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          if (audioContext.state !== "closed") await audioContext.close();
          return "unavailable";
        }
        const source = audioContext.createMediaStreamSource(stream);
        const worklet = new AudioWorkletNode(
          audioContext,
          "yin-pitch-detector",
          {
            numberOfInputs: 1,
            numberOfOutputs: 0,
            channelCount: 1,
            channelCountMode: "explicit",
          },
        );
        sourceRef.current = source;
        workletRef.current = worklet;

        worklet.port.onmessage = (
          event: MessageEvent<{ frequency: number; clarity: number }>,
        ): void => {
          if (
            !listeningRef.current ||
            event.data.clarity < MINIMUM_CLARITY ||
            !Number.isFinite(event.data.frequency) ||
            event.data.frequency <= 0
          ) {
            return;
          }

          const now = performance.now();
          samplesRef.current.push({
            frequency: event.data.frequency,
            clarity: event.data.clarity,
            timeMs: now - listeningStartedAtRef.current,
          });
          displaySamplesRef.current.push(event.data.frequency);
          if (displaySamplesRef.current.length > DISPLAY_SAMPLE_COUNT) {
            displaySamplesRef.current.shift();
          }

          if (now - lastUiUpdateRef.current >= UI_UPDATE_INTERVAL_MS) {
            lastUiUpdateRef.current = now;
            setDetectedFrequency(median(displaySamplesRef.current));
          }
        };

        stream.getTracks().forEach((track) => {
          track.onended = () => {
            if (stoppingRef.current) return;
            listeningRef.current = false;
            if (mountedRef.current) setError("ended");
            void cleanup();
          };
        });

        readyRef.current = true;
        return null;
      } catch (startError) {
        const errorCode: PitchDetectorErrorCode =
          startError instanceof DOMException &&
          (startError.name === "NotAllowedError" ||
            startError.name === "SecurityError")
            ? "blocked"
            : "unavailable";
        if (mountedRef.current) setError(errorCode);
        await cleanup();
        return errorCode;
      }
    })();

    startPromiseRef.current = startPromise;
    const result = await startPromise;
    startPromiseRef.current = null;
    return result;
  }, [cleanup]);

  const playTone = useCallback(
    async (frequency: number, durationMs: number): Promise<void> => {
      const audioContext = audioContextRef.current;
      if (!audioContext || audioContext.state === "closed") return;

      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      const startTime = audioContext.currentTime + 0.02;
      const endTime = startTime + durationMs / 1000;

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, startTime);
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.04);
      gain.gain.setValueAtTime(
        0.2,
        Math.max(startTime + 0.05, endTime - 0.08),
      );
      gain.gain.exponentialRampToValueAtTime(0.0001, endTime);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(startTime);
      oscillator.stop(endTime);

      await new Promise<void>((resolve) => {
        let settled = false;
        let fallbackTimer = 0;
        const finish = (): void => {
          if (settled) return;
          settled = true;
          window.clearTimeout(fallbackTimer);
          resolve();
        };
        fallbackTimer = window.setTimeout(finish, durationMs + 250);
        oscillator.onended = finish;
      });
      try {
        oscillator.disconnect();
        gain.disconnect();
      } catch {
        // Context may have closed because microphone access ended.
      }
    },
    [],
  );

  const connectAnalysis = useCallback((): void => {
    if (connectedRef.current || !sourceRef.current || !workletRef.current) {
      return;
    }
    sourceRef.current.connect(workletRef.current);
    connectedRef.current = true;
  }, []);

  const beginListening = useCallback((): void => {
    samplesRef.current = [];
    displaySamplesRef.current = [];
    listeningStartedAtRef.current = performance.now();
    lastUiUpdateRef.current = 0;
    if (mountedRef.current) setDetectedFrequency(null);
    listeningRef.current = true;
  }, []);

  const endListening = useCallback((): PitchSample[] => {
    listeningRef.current = false;
    return [...samplesRef.current];
  }, []);

  const getListeningSamples = useCallback(
    (): PitchSample[] => [...samplesRef.current],
    [],
  );

  const clearError = useCallback((): void => setError(null), []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      void cleanup();
    };
  }, [cleanup]);

  return {
    detectedFrequency,
    error,
    start,
    playTone,
    connectAnalysis,
    disconnectAnalysis,
    beginListening,
    getListeningSamples,
    endListening,
    cleanup,
    clearError,
  };
};
