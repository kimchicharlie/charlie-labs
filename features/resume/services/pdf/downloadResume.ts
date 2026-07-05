import { DownloadType, PageFormat } from "@/features/resume/types";
import { Language } from "@/shared/types/language";
import { createResumeFileName, findResumeSections } from "./helpers";

type HtmlToImageOptions = {
  quality: number;
  pixelRatio: number;
  backgroundColor: string;
  filter: (node: HTMLElement) => boolean;
};

type ImageEncoder = (
  element: HTMLElement,
  options: HtmlToImageOptions,
) => Promise<string>;

type PdfLike = {
  addPage: () => void;
  addImage: (
    imageData: string,
    format: string,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => void;
  save: (fileName: string) => void;
};

type PdfLayout = {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
  contentHeight: number;
};

const createCaptureOptions = (): HtmlToImageOptions => {
  return {
    quality: 0.95,
    pixelRatio: 2,
    backgroundColor: "#ffffff",
    filter: (node) => {
      if (!node.classList) {
        return true;
      }

      return !node.classList.contains("no-print");
    },
  };
};

const createPdfLayout = (format: PageFormat): PdfLayout => {
  const pageWidth = format === PageFormat.LETTER ? 216 : 210;
  const pageHeight = format === PageFormat.LETTER ? 279 : 297;
  const margin = 15;

  return {
    pageWidth,
    pageHeight,
    margin,
    contentWidth: pageWidth - 2 * margin,
    contentHeight: pageHeight - 2 * margin,
  };
};

const addSectionToPdf = async (
  pdf: PdfLike,
  toJpeg: ImageEncoder,
  sectionElement: HTMLElement,
  sectionName: string,
  layout: PdfLayout,
  positionState: { currentY: number },
): Promise<void> => {
  try {
    const sectionDataUrl = await toJpeg(sectionElement, createCaptureOptions());

    const image = new Image();
    await new Promise<void>((resolve) => {
      image.onload = () => {
        const imageAspectRatio = image.height / image.width;
        const imageWidth = layout.contentWidth;
        const imageHeight = imageWidth * imageAspectRatio;

        if (
          positionState.currentY + imageHeight >
          layout.pageHeight - layout.margin
        ) {
          pdf.addPage();
          positionState.currentY = layout.margin;
        }

        pdf.addImage(
          sectionDataUrl,
          "JPEG",
          layout.margin,
          positionState.currentY,
          imageWidth,
          imageHeight,
        );
        positionState.currentY += imageHeight + 5;
        resolve();
      };

      image.onerror = () => {
        console.error(`Error loading ${sectionName} image`);
        resolve();
      };

      image.src = sectionDataUrl;
    });
  } catch (error) {
    console.error(`Error capturing ${sectionName}:`, error);
  }
};

const generateFallbackPdf = async (
  pdf: PdfLike,
  toJpeg: ImageEncoder,
  element: HTMLElement,
  fileName: string,
  layout: PdfLayout,
): Promise<void> => {
  const dataUrl = await toJpeg(element, createCaptureOptions());
  const image = new Image();

  image.onload = () => {
    const imageAspectRatio = image.height / image.width;
    const imageWidth = layout.contentWidth;
    const imageHeight = imageWidth * imageAspectRatio;

    if (imageHeight <= layout.contentHeight) {
      const y = (layout.pageHeight - imageHeight) / 2;
      pdf.addImage(dataUrl, "JPEG", layout.margin, y, imageWidth, imageHeight);
      pdf.save(`${fileName}.pdf`);
      return;
    }

    const numberOfPages = Math.ceil(imageHeight / layout.contentHeight);

    for (let pageIndex = 0; pageIndex < numberOfPages; pageIndex += 1) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const sourceY =
        (pageIndex * layout.contentHeight * image.height) / imageHeight;
      const sourceHeight = Math.min(
        (layout.contentHeight * image.height) / imageHeight,
        image.height - sourceY,
      );

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        continue;
      }

      canvas.width = image.width;
      canvas.height = sourceHeight;

      context.drawImage(
        image,
        0,
        sourceY,
        image.width,
        sourceHeight,
        0,
        0,
        image.width,
        sourceHeight,
      );

      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.95);

      pdf.addImage(
        croppedDataUrl,
        "JPEG",
        layout.margin,
        layout.margin,
        imageWidth,
        layout.contentHeight,
      );
    }

    pdf.save(`${fileName}.pdf`);
  };

  image.src = dataUrl;
};

export const downloadResume = async (
  format: PageFormat,
  type: DownloadType,
  language: Language,
): Promise<void> => {
  try {
    const { toJpeg } = await import("html-to-image");
    const { jsPDF } = await import("jspdf");

    const fileName = createResumeFileName(format, language);
    const element = document.getElementById("resume-content");

    if (!element) {
      throw new Error("Resume content not found");
    }

    const layout = createPdfLayout(format);
    const pdf: PdfLike = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: format === PageFormat.LETTER ? [216, 279] : "a4",
    });

    const positionState = { currentY: layout.margin };

    try {
      const {
        headerSection,
        aboutSection,
        technologiesSection,
        experienceSection,
        educationSection,
        hobbiesSection,
      } = findResumeSections(element);

      if (headerSection) {
        await addSectionToPdf(
          pdf,
          toJpeg,
          headerSection,
          "Header",
          layout,
          positionState,
        );
      }

      if (aboutSection) {
        await addSectionToPdf(
          pdf,
          toJpeg,
          aboutSection,
          "About",
          layout,
          positionState,
        );
      }

      if (technologiesSection) {
        await addSectionToPdf(
          pdf,
          toJpeg,
          technologiesSection,
          "Technologies",
          layout,
          positionState,
        );
      }

      if (experienceSection) {
        const experienceTitle = experienceSection.querySelector(
          "h2",
        ) as HTMLElement | null;

        if (experienceTitle) {
          await addSectionToPdf(
            pdf,
            toJpeg,
            experienceTitle,
            "Experience Title",
            layout,
            positionState,
          );
        }

        const experienceItems = experienceSection.querySelectorAll(
          ".border-l-4.border-primary-500",
        ) as NodeListOf<HTMLElement>;

        for (let i = 0; i < experienceItems.length; i += 1) {
          await addSectionToPdf(
            pdf,
            toJpeg,
            experienceItems[i],
            `Experience ${i + 1}`,
            layout,
            positionState,
          );
        }
      }

      if (educationSection) {
        await addSectionToPdf(
          pdf,
          toJpeg,
          educationSection,
          "Education",
          layout,
          positionState,
        );
      }

      if (hobbiesSection) {
        await addSectionToPdf(
          pdf,
          toJpeg,
          hobbiesSection,
          "Hobbies",
          layout,
          positionState,
        );
      }

      pdf.save(`${fileName}.pdf`);
    } catch (error) {
      console.error("Error generating section PDF:", error);
      await generateFallbackPdf(pdf, toJpeg, element, fileName, layout);
    }
  } catch (error) {
    console.error(`Error generating ${type}:`, error);
    alert(`Error generating ${type}. Please try again.`);
  }
};
