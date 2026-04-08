import React, { useState } from 'react';
import { ResumeData, Experience, Education, Course } from '../types';

interface ResumeFormProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onAnalyze: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, setData, onAnalyze }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education' | 'skills' | 'target'>('info');

  const updateInfo = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: Date.now().toString(), company: '', role: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const updateExperience = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  return (
    <div className="resume-form">
      <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
        <button className={`btn-secondary ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Dados</button>
        <button className={`btn-secondary ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Experiência</button>
        <button className={`btn-secondary ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Habilidades</button>
        <button className={`btn-secondary ${activeTab === 'target' ? 'active' : ''}`} onClick={() => setActiveTab('target')}>Vaga Alvo</button>
      </div>

      <div className="tab-content" style={{ minHeight: '60vh' }}>
        {activeTab === 'info' && (
          <div>
            <h3>Informações Pessoais</h3>
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" className="form-control" value={data.personalInfo.fullName} onChange={(e) => updateInfo('fullName', e.target.value)} />
            </div>
            <div className="flex-row">
              <div className="form-group">
                <label>Cidade</label>
                <input type="text" className="form-control" value={data.personalInfo.city} onChange={(e) => updateInfo('city', e.target.value)} placeholder="Ex: São Paulo" />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <input type="text" className="form-control" value={data.personalInfo.state} onChange={(e) => updateInfo('state', e.target.value)} placeholder="Ex: SP" />
              </div>
            </div>
            <div className="flex-row">
              <div className="form-group">
                <label>Telefone</label>
                <input type="text" className="form-control" value={data.personalInfo.phone} onChange={(e) => updateInfo('phone', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Email Profissional</label>
                <input type="email" className="form-control" value={data.personalInfo.email} onChange={(e) => updateInfo('email', e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>LinkedIn (opcional)</label>
              <input type="text" className="form-control" value={data.personalInfo.linkedin} onChange={(e) => updateInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/seu-perfil" />
            </div>
            <div className="form-group">
              <label>Resumo Profissional (Objetivo)</label>
              <textarea className="form-control" value={data.objective} onChange={(e) => setData({ ...data, objective: e.target.value })} placeholder="Foque em como você resolve problemas e gera valor..."></textarea>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div>
            <h3>Experiência Profissional</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Dica ATS: Use bullet points orientados a resultados. Em vez de "Fazia X", use "Aumentei Y em Z% através de X".
            </p>
            {data.experience.map((exp) => (
              <div key={exp.id} className="item-card">
                <div className="form-group">
                  <label>Empresa</label>
                  <input type="text" className="form-control" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Cargo</label>
                  <input type="text" className="form-control" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} />
                </div>
                <div className="flex-row">
                  <div className="form-group">
                    <label>Início (MM/AAAA)</label>
                    <input type="text" className="form-control" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Fim (MM/AAAA ou Atual)</label>
                    <input type="text" className="form-control" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Descrição e Resultados</label>
                  <textarea className="form-control" style={{ minHeight: '120px' }} value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="- Atuei no projeto X&#10;- Aumentei a eficiência em 15%&#10;- Liderei equipe de 5 pessoas"></textarea>
                </div>
                <button className="btn-secondary" style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={() => removeExperience(exp.id)}>Remover</button>
              </div>
            ))}
            <button className="btn btn-secondary" onClick={addExperience}>+ Adicionar Experiência</button>
          </div>
        )}

        {activeTab === 'skills' && (
          <div>
            <h3>Competências e Habilidades</h3>
            <div className="form-group">
              <label>Habilidades Técnicas (Hard Skills)</label>
              <textarea className="form-control" placeholder="Ex: React, Node.js, Excel Avançado, Power BI, Metodologias Ágeis (separadas por vírgula)" 
                value={data.hardskills.join(', ')} 
                onChange={(e) => setData({ ...data, hardskills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}></textarea>
            </div>
            <div className="form-group">
              <label>Habilidades Comportamentais (Soft Skills)</label>
              <textarea className="form-control" placeholder="Liderança, Comunicação, Resolução de Problemas..."
                value={data.softskills.join(', ')} 
                onChange={(e) => setData({ ...data, softskills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}></textarea>
            </div>
            
            <div style={{ marginTop: '2rem' }}>
              <h3>Formação Acadêmica (Simplificado)</h3>
              <textarea className="form-control" placeholder="Pós-graduação em X - Instituição (Ano)&#10;Bacharelado em Y - Instituição (Ano)"
                value={data.education.map(ed => ed.institution).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  setData({ ...data, education: lines.map((line, i) => ({ id: String(i), institution: line, degree: '', startDate: '', endDate: '' })) })
                }}></textarea>
            </div>
          </div>
        )}

        {activeTab === 'target' && (
          <div>
            <h3>Otimização para Vaga (CRÍTICO)</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
              Cole a descrição da vaga alvo. Nosso sistema vai analisar e gerar um score de compatibilidade, sugerindo palavras-chave.
            </p>
            <div className="form-group">
              <label>Título da Vaga</label>
              <input type="text" className="form-control" value={data.targetJob} onChange={(e) => setData({ ...data, targetJob: e.target.value })} placeholder="Ex: Desenvolvedor Senior / Analista Financeiro" />
            </div>
            <div className="form-group">
              <label>Descrição Completa da Vaga</label>
              <textarea className="form-control" style={{ minHeight: '200px' }} value={data.targetJobDescription} onChange={(e) => setData({ ...data, targetJobDescription: e.target.value })} placeholder="Cole os requisitos e descrição aqui..."></textarea>
            </div>
            <button className="btn" style={{ width: '100%', marginTop: '1rem' }} onClick={onAnalyze}>
              ✨ Analisar e Otimizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
