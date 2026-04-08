import React, { useState } from 'react';
import { ResumeData } from '../types';
import { MessageSquare, Sparkles, Send, Bot } from 'lucide-react';

interface AtsAssistantProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export const AtsAssistant: React.FC<AtsAssistantProps> = ({ data, setData }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Olá! Sou seu assistente de IA focado em ATS. O que você gostaria de mudar no seu currículo para aumentar seu score?' }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Simulated "AI" Processing
    setTimeout(() => {
      const response = processCommand(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: response.msg }]);
      if (response.update) {
        setData(prev => ({ ...prev, ...response.update(prev) }));
      }
    }, 800);
  };

  const processCommand = (cmd: string) => {
    const lower = cmd.toLowerCase();

    if (lower.includes('resumo') || lower.includes('objetivo')) {
      return {
        msg: "Entendido! Otimizei seu resumo profissional removendo clichês e focando em sua proposta de valor e palavras-chave da área.",
        update: (prev: ResumeData) => ({
          objective: `Especialista focado em resultados com expertise sólida em ${prev.hardskills.slice(0,3).join(', ')}. Histórico comprovado de entrega de projetos complexos, otimização de processos e geração de impacto mensurável no setor.`
        })
      };
    }

    if (lower.includes('hardskill') || lower.includes('ferramenta') || lower.includes('adicionar')) {
      const matches = cmd.match(/adicionar\s+(.+)/i) || cmd.match(/skill\s+(.+)/i);
      const newSkill = matches ? matches[1] : "Nova Skill";
      return {
        msg: `Legal! Adicionei "${newSkill}" à sua lista de competências técnicas. Lembre-se de mencionar esta habilidade em seus resultados de experiência para ganhar mais relevância.`,
        update: (prev: ResumeData) => ({
          hardskills: [...new Set([...prev.hardskills, newSkill])]
        })
      };
    }

    if (lower.includes('contato') || lower.includes('telefone')) {
        return {
          msg: "Por motivos de privacidade e conformidade ATS, recomendo manter apenas Cidade, Estado, Telefone e Email profissional (como já configurado).",
          update: null
        }
    }

    return {
      msg: "Comando recebido! Estou analisando como integrar isso para manter seu score ATS acima de 80. O que mais você precisa hoje?",
      update: null
    };
  };

  return (
    <div className="ats-assistant no-print" style={{ 
      marginTop: '2rem', 
      background: 'rgba(59, 130, 246, 0.1)', 
      borderRadius: '16px', 
      border: '1px solid rgba(59, 130, 246, 0.2)',
      overflow: 'hidden'
    }}>
      <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Bot size={20} color="#60a5fa" />
        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>AI Otimizador (Alpha)</span>
        <Sparkles size={14} color="#f59e0b" />
      </div>

      <div style={{ height: '250px', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ 
            alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
            maxWidth: '85%',
            background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            padding: '10px 14px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            color: 'white',
            lineHeight: '1.4'
          }}>
            {m.text}
          </div>
        ))}
      </div>

      <div style={{ padding: '12px', display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <input 
          type="text" 
          className="form-control" 
          style={{ height: '40px' }}
          placeholder="Ex: 'Melhore meu resumo' ou 'Adicione skill Python'"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button className="btn" style={{ padding: '0 12px' }} onClick={handleSend}>
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
