import { pdf } from "@react-pdf/renderer";
import { ReactElement } from "react";

import type { DocumentProps } from "@react-pdf/renderer";

export const DownLoadPdf = async ({
  pdfElement,
  filename,
}: {
  pdfElement: ReactElement<DocumentProps>;
  filename: string;
}) => {
  let url = "";

  try {
    const blob = await pdf(pdfElement).toBlob();
    url = URL.createObjectURL(blob);

    const response = await fetch(url);
    const blobData = await response.blob();
    const blobUrl = window.URL.createObjectURL(blobData);

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    link.click();
  } catch (error) {
    console.error("Error in download process:", error);
  } finally {
    if (url) URL.revokeObjectURL(url);
  }
};
