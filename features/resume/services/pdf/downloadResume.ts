import { DownloadType, PageFormat } from "@/features/resume/types";
import { Language } from "@/shared/types/language";
import { createResumeFileName } from "./helpers";

export const downloadResume = async (
  format: PageFormat,
  _type: DownloadType,
  language: Language,
): Promise<void> => {
  const fileName = createResumeFileName(format, language);
  const languageSuffix = language === Language.FR ? "FR" : "EN";
  const formatSuffix = format === PageFormat.A4 ? "A4" : "US-Letter";
  const link = document.createElement("a");

  link.href = `/resumes/charlie-henin-resume-${formatSuffix}-${languageSuffix}.pdf`;
  link.download = `${fileName}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
};
