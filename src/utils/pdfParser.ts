import * as pdfjsLib from 'pdfjs-dist';

// Cloudflare CDN worker for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function extractTextFromPdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n';
  }
  
  return fullText;
}

// Simple heuristic to try and parse parts of the text
export function parseResumeText(text: string) {
  const result: any = {
    personalInfo: {},
    experience: [],
    hardskills: [],
    objective: ''
  };

  // Try to find email
  const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
  if (emailMatch) result.personalInfo.email = emailMatch[0];

  // Try to find phone
  const phoneMatch = text.match(/(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/);
  if (phoneMatch) result.personalInfo.phone = phoneMatch[0];

  // Everything else we'll put in objective/main text for the user to refine
  // as parsing unstructured PDF text into JSON objects is unreliable without LLM APIs.
  // We'll give the user the raw text to help them fill the rest.
  
  result.objective = text.slice(0, 500) + "... (Extraído do PDF)";
  
  return result;
}
