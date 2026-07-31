class YinPitchDetector extends AudioWorkletProcessor {
  constructor() {
    super();
    this.frameSize = 2048;
    this.hopSize = 1024;
    this.frame = new Float32Array(this.frameSize);
    this.writeIndex = 0;
    this.difference = new Float32Array(this.frameSize / 2 + 1);
    this.normalizedDifference = new Float32Array(this.frameSize / 2 + 1);
  }

  detectPitch(frame) {
    let energy = 0;
    for (let index = 0; index < frame.length; index += 1) {
      energy += frame[index] * frame[index];
    }

    const rms = Math.sqrt(energy / frame.length);
    if (rms < 0.012) return null;

    const minimumFrequency = 75;
    const maximumFrequency = 1000;
    const minimumLag = Math.max(2, Math.floor(sampleRate / maximumFrequency));
    const maximumLag = Math.min(
      Math.floor(sampleRate / minimumFrequency),
      frame.length / 2,
    );

    this.difference.fill(0);
    for (let lag = 1; lag <= maximumLag; lag += 1) {
      let sum = 0;
      for (let index = 0; index < maximumLag; index += 1) {
        const delta = frame[index] - frame[index + lag];
        sum += delta * delta;
      }
      this.difference[lag] = sum;
    }

    this.normalizedDifference[0] = 1;
    let runningSum = 0;
    for (let lag = 1; lag <= maximumLag; lag += 1) {
      runningSum += this.difference[lag];
      this.normalizedDifference[lag] = runningSum
        ? (this.difference[lag] * lag) / runningSum
        : 1;
    }

    const threshold = 0.14;
    let bestLag = -1;
    for (let lag = minimumLag; lag <= maximumLag; lag += 1) {
      if (this.normalizedDifference[lag] < threshold) {
        while (
          lag + 1 <= maximumLag &&
          this.normalizedDifference[lag + 1] < this.normalizedDifference[lag]
        ) {
          lag += 1;
        }
        bestLag = lag;
        break;
      }
    }

    if (bestLag < 0) return null;

    const previous = this.normalizedDifference[bestLag - 1];
    const current = this.normalizedDifference[bestLag];
    const next = this.normalizedDifference[bestLag + 1];
    const denominator = 2 * (2 * current - next - previous);
    const adjustment = denominator ? (next - previous) / denominator : 0;
    const refinedLag = bestLag + adjustment;
    const clarity = 1 - current;

    return {
      frequency: sampleRate / refinedLag,
      clarity,
    };
  }

  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;

    const channel = input[0];
    for (let index = 0; index < channel.length; index += 1) {
      this.frame[this.writeIndex] = channel[index];
      this.writeIndex += 1;

      if (this.writeIndex === this.frameSize) {
        const reading = this.detectPitch(this.frame);
        if (reading) this.port.postMessage(reading);

        this.frame.copyWithin(0, this.hopSize);
        this.writeIndex = this.frameSize - this.hopSize;
      }
    }

    return true;
  }
}

registerProcessor("yin-pitch-detector", YinPitchDetector);
