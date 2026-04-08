import { ResumeData, AtsScore } from '../types';

export function analyzeResume(data: ResumeData): AtsScore {
  const { targetJobDescription, experience, objective, hardskills, personalInfo } = data;
  
  const suggestions: string[] = [];
  const missingKeywords: string[] = [];
  
  // 1. Structure Analysis
  let structureScore = 100;
  if (!personalInfo.fullName || !personalInfo.email || !personalInfo.phone) {
    structureScore -= 20;
    suggestions.push("Adicione informações de contato completas (Email e Telefone).");
  }
  if (!objective) {
    structureScore -= 20;
    suggestions.push("Inclua um resumo profissional. Sistemas ATS costumam buscar um sumário para categorização primária.");
  }
  if (experience.length === 0) {
    structureScore -= 30;
    suggestions.push("Adicione sua experiência profissional no formato de tópicos.");
  }
  
  // 2. Impact Analysis
  let impactScore = 100;
  const fullText = (
    objective + ' ' + 
    experience.map(e => e.description + ' ' + e.role).join(' ') + ' ' +
    hardskills.join(' ')
  ).toLowerCase();

  const impactWords = ['aumentei', 'reduzi', 'gerenciei', '%', 'mil', 'milhões', 'liderou', 'liderança', 'crescimento', 'otimizou', 'desenvolveu', 'implementou'];
  let foundImpact = 0;
  
  impactWords.forEach(word => {
    if (fullText.includes(word)) foundImpact++;
  });

  if (foundImpact < 3) {
    impactScore -= 40;
    suggestions.push("Sua experiência carece de MÉTRICAS. Troque verbos passivos (ex: 'responsável por') por verbos de ação com números (ex: 'Vendas aumentadas em 20%').");
  } else if (foundImpact < 6) {
    impactScore -= 10;
  }

  // 3. Keyword Match Analysis
  let keywordScore = 100;
  if (!targetJobDescription) {
    suggestions.push("Cole a descrição de uma Vaga Alvo para ativarmos a engine de palavras-chave!");
    keywordScore = 50; 
  } else {
    // Basic NLP extraction logic
    const commonWords = ['e','ou','para','com','de','da','em','um','uma','o','a','os','as','que','se','do'];
    const words = targetJobDescription.toLowerCase().replace(/[.,/()]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !commonWords.includes(w));
    
    // Frequency map
    const freq: Record<string, number> = {};
    words.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
    
    // Convert to sorted array of keywords
    const topKeywords = Object.entries(freq).sort((a,b) => b[1] - a[1]).slice(0, 15).map(e => e[0]);
    
    let matchCount = 0;
    topKeywords.forEach(kw => {
      if (fullText.includes(kw)) {
        matchCount++;
      } else {
        missingKeywords.push(kw);
      }
    });

    const matchRate = matchCount / topKeywords.length;
    keywordScore = Math.round(matchRate * 100) || 10;

    if (matchRate < 0.5) {
      suggestions.push("Alerta Crítico: Seu currículo possui pouca similaridade semântica com a vaga. Você tem grandes chances de ser descartado pelo filtro automático.");
    } else if (matchRate < 0.8) {
      suggestions.push("Bom nível de palavras-chave, mas você pode otimizar adicionando os termos faltantes nas seções de Experiência ou Habilidades.");
    }
  }

  // Final Total Score
  const total = Math.round((structureScore * 0.3) + (impactScore * 0.3) + (keywordScore * 0.4));

  return {
    total: Math.max(0, total),
    keywordMatch: keywordScore,
    structure: structureScore,
    impact: impactScore,
    missingKeywords,
    suggestions
  };
}
