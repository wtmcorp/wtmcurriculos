import * as pdfjsLib from 'pdfjs-dist';

// Updated: Using Vite's URL import for the worker. This ensures the worker is 
// bundled and served correctly from the same origin, avoiding CORS or 404 issues in production.
// @ts-ignore
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export async function extractTextFromPdf(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      isEvalSupported: false 
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => {
           if ('str' in item) return item.str;
           return '';
        })
        .join(' ');
      fullText += pageText + '\n';
    }
    
    if (!fullText.trim()) throw new Error('Não foi possível extrair texto legível deste PDF.');
    
    return fullText;
  } catch (error) {
    console.error('PDF.js Detailed Error:', error);
    const msg = error instanceof Error ? error.message : 'Erro desconhecido';
    throw new Error(`Falha na extração (${msg}). Tente copiar e colar o texto manualmente caso o erro persista.`);
  }
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
