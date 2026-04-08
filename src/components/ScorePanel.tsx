import React from 'react';
import { ResumeData, AtsScore } from '../types';

interface ScorePanelProps {
  score: AtsScore;
  className?: string;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, className = '' }) => {
  const getColor = (s: number) => {
    if (s >= 80) return 'var(--success)';
    if (s >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className={`score-panel ${className}`}>
      <div className="score-header">
        <div className="score-circle" style={{ backgroundColor: getColor(score.total) }}>
          {score.total}
        </div>
        <div className="score-details">
          <h3>Score ATS Estimado</h3>
          <div className="score-badges">
            <span className="badge badge-info">Keywords: {score.keywordMatch}/100</span>
            <span className="badge badge-info">Ação/Impacto: {score.impact}/100</span>
            <span className="badge badge-info">Estrutura: {score.structure}/100</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Uma pontuação acima de 80 tem altas chances de passar em filtros da Gupy e Workday.
          </p>
        </div>
      </div>

      {score.suggestions.length > 0 && (
        <div className="suggestions-list">
          <h4>💡 Ações de Alto Impacto para Melhorar:</h4>
          <ul>
            {score.suggestions.map((sug, idx) => (
              <li key={idx}>{sug}</li>
            ))}
          </ul>
        </div>
      )}

      {score.missingKeywords.length > 0 && (
        <div className="suggestions-list" style={{ marginTop: '0.5rem', background: '#fffbeb' }}>
          <h4 style={{ color: '#b45309' }}>⚠️ Palavras-chave da vaga não encontradas:</h4>
          <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>Tente inserir (com naturalidade) no resumo ou experiências:</p>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            {score.missingKeywords.slice(0, 10).map((kw, idx) => (
              <span key={idx} style={{ background: '#fef3c7', padding: '2px 6px', borderRadius: '4px', fontSize: '0.8rem', color: '#92400e' }}>
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
