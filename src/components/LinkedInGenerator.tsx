import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Share2, Copy, Check } from 'lucide-react';

interface LinkedInGeneratorProps {
  data: ResumeData;
}

export const LinkedInGenerator: React.FC<LinkedInGeneratorProps> = ({ data }) => {
  const [copied, setCopied] = useState<number | null>(null);

  const generatePosts = () => {
    const { personalInfo, experience, hardskills, targetJob } = data;
    const mainExp = experience[0];
    
    return [
      {
        title: "🚀 Anúncio de Carreira (Open to Work)",
        content: `Olá rede! 👋\n\nEstou em um momento de transição e focado em novas oportunidades como ${targetJob || 'especialista na minha área'}. \n\nCom experiência em ${mainExp?.company || 'grandes projetos'}, trago na bagagem competências sólidas em ${hardskills.slice(0, 3).join(', ')}. \n\nMeu foco é gerar impacto através de resultados mensuráveis e colaboração. Se souber de algo ou quiser bater um papo, estou à disposição!\n\n#Carreira #Oportunidade #JobSearch #${targetJob?.replace(/\s/g, '')}`
      },
      {
        title: "📈 Post de Conquista (Foco em Resultado)",
        content: `Compartilhando um resultado recente! 🎯\n\nDurante minha jornada na ${mainExp?.company}, pude liderar iniciativas que envolveram ${mainExp?.role}. \n\nAplicando ferramentas como ${hardskills.slice(0, 2).join(' e ')}, conseguimos alcançar marcos importantes em ${mainExp?.role}.\n\nAcredito que a combinação de técnica e visão de negócio é o que move os ponteiros. \n\nComo vocês têm aplicado ${hardskills[0]} nos seus times?\n\n#Performance #Resultados #Business #${hardskills[0]}`
      },
      {
        title: "💡 Insight de Especialista",
        content: `Você já parou para pensar no impacto de ${hardskills[0]} no setor de ${targetJob || 'tecnologia'}?\n\nTrabalhando com isso nos últimos anos, percebi que a eficiência não vem apenas da ferramenta, mas da cultura de melhoria contínua. \n\nNo meu currículo otimizado para ATS, destaco como utilizei ${hardskills.slice(0, 3).join(', ')} para resolver problemas complexos.\n\nQual sua opinião sobre o futuro dessa área?\n\n#Insight #Especialista #FuturoDoTrabalho`
      }
    ];
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 2000);
  };

  const posts = generatePosts();

  return (
    <div className="linkedin-card no-print">
      <div className="linkedin-header">
        <Share2 size={24} />
        <h2>Gerador de Conteúdo para LinkedIn</h2>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        Com base no seu currículo otimizado, geramos sugestões de posts para aumentar seu alcance orgânico e autoridade.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {posts.map((post, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h4 style={{ color: 'var(--primary)' }}>{post.title}</h4>
              <button 
                onClick={() => handleCopy(post.content, idx)}
                style={{ background: 'transparent', border: 'none', color: copied === idx ? '#10b981' : '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                {copied === idx ? <Check size={16} /> : <Copy size={16} />}
                {copied === idx ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.6' }}>
              {post.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
