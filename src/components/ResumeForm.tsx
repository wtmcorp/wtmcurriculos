import React, { useState } from 'react';
import { ResumeData, Experience, Education, Course } from '../types';
import { extractTextFromPdf } from '../utils/pdfParser';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface ResumeFormProps {
  data: ResumeData;
  setData: React.Dispatch<React.SetStateAction<ResumeData>>;
  onAnalyze: () => void;
}

export const ResumeForm: React.FC<ResumeFormProps> = ({ data, setData, onAnalyze }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education' | 'skills' | 'target'>('info');
  const [isImporting, setIsImporting] = useState(false);

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await extractTextFromPdf(file);
      
      const nameMatch = text.split('\n')[0]; 
      const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
      const phoneMatch = text.match(/(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/);

      setData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: nameMatch.trim().slice(0, 50),
          email: emailMatch ? emailMatch[0] : prev.personalInfo.email,
          phone: phoneMatch ? phoneMatch[0] : prev.personalInfo.phone,
        },
        objective: `EXTRAÍDO DO SEU PDF:\n\n\n${text.slice(0, 1500)}...`
      }));
      
      alert('PDF processado! Os dados básicos foram preenchidos e o texto completo está no campo "Resumo" para você organizar.');
    } catch (err) {
      console.error(err);
      alert('Erro ao processar PDF. Certifique-se que o arquivo não está protegido por senha.');
    } finally {
      setIsImporting(false);
    }
  };

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
      <div className="tabs" style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button className={`btn-secondary ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>Identidade</button>
        <button className={`btn-secondary ${activeTab === 'experience' ? 'active' : ''}`} onClick={() => setActiveTab('experience')}>Carreira</button>
        <button className={`btn-secondary ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>Skills</button>
        <button className={`btn-secondary ${activeTab === 'target' ? 'active' : ''}`} onClick={() => setActiveTab('target')}>Otimização</button>
      </div>

      <div className="tab-content" style={{ minHeight: '60vh' }}>
        {activeTab === 'info' && (
          <div className="fade-in">
            <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'rgba(59, 130, 246, 0.05)', border: '2px dashed var(--border)', borderRadius: '12px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>Já possui um currículo?</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Importe seu PDF e nós tentamos preencher os dados para você.</p>
              
              <label className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                {isImporting ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                {isImporting ? 'Processando...' : 'Selecionar PDF'}
                <input type="file" accept=".pdf" onChange={handlePdfUpload} style={{ display: 'none' }} disabled={isImporting} />
              </label>
            </div>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem' }}>Dados de Contato</h3>
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" className="form-control" value={data.personalInfo.fullName} onChange={(e) => updateInfo('fullName', e.target.value)} placeholder="Seu nome profissional" />
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 2 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CIDADE</label>
                <input type="text" className="form-control" value={data.personalInfo.city} onChange={(e) => updateInfo('city', e.target.value)} placeholder="Ex: São Paulo" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>UF</label>
                <input type="text" className="form-control" value={data.personalInfo.state} onChange={(e) => updateInfo('state', e.target.value)} placeholder="SP" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>WHATSAPP / CELULAR</label>
                <input type="text" className="form-control" value={data.personalInfo.phone} onChange={(e) => updateInfo('phone', e.target.value)} placeholder="(11) 99999-9999" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>EMAIL</label>
                <input type="email" className="form-control" value={data.personalInfo.email} onChange={(e) => updateInfo('email', e.target.value)} placeholder="seu@email.com" />
              </div>
            </div>
            <div className="form-group">
              <label>LinkedIn / Portfólio</label>
              <input type="text" className="form-control" value={data.personalInfo.linkedin} onChange={(e) => updateInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/seu-perfil" />
            </div>
            <div className="form-group">
              <label>Resumo Profissional Estratégico</label>
              <textarea className="form-control" value={data.objective} onChange={(e) => setData({ ...data, objective: e.target.value })} placeholder="Dica: Comece com seu tempo de experiência e principal resultado."></textarea>
            </div>
          </div>
        )}

        {activeTab === 'experience' && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '0.5rem' }}>Histórico Profissional</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ATS Ranking: Use o formato MM/AAAA. Bullet points devem conter NÚMEROS e IMPACTO.
            </p>
            {data.experience.map((exp) => (
              <div key={exp.id} className="item-card">
                <div className="form-group">
                  <label>Empresa</label>
                  <input type="text" className="form-control" value={exp.company} onChange={(e) => updateExperience(exp.id, 'company', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Cargo / Título</label>
                  <input type="text" className="form-control" value={exp.role} onChange={(e) => updateExperience(exp.id, 'role', e.target.value)} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>INÍCIO</label>
                    <input type="text" className="form-control" value={exp.startDate} onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)} placeholder="MM/AAAA" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>FIM / ATUAL</label>
                    <input type="text" className="form-control" value={exp.endDate} onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)} placeholder="MM/AAAA ou Atual" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Responsabilidades e Conquistas (METRICAS!)</label>
                  <textarea className="form-control" style={{ minHeight: '120px' }} value={exp.description} onChange={(e) => updateExperience(exp.id, 'description', e.target.value)} placeholder="- Liderei projeto X resultando em Y% de economia&#10;- Implementei processo Z que reduziu tempo em W horas"></textarea>
                </div>
                <button className="btn-secondary" style={{ color: 'var(--danger)', fontSize: '0.8rem' }} onClick={() => removeExperience(exp.id)}>Excluir registro</button>
              </div>
            ))}
            <button className="btn btn-secondary" style={{ width: '100%', borderStyle: 'dashed' }} onClick={addExperience}>+ Adicionar Experiência</button>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1.5rem' }}>Competências</h3>
            <div className="form-group">
              <label>Hard Skills (Separadas por vírgula)</label>
              <textarea className="form-control" placeholder="Python, SQL, Gestão de Projetos, AWS, Inglês Fluente..." 
                value={data.hardskills.join(', ')} 
                onChange={(e) => setData({ ...data, hardskills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}></textarea>
            </div>
            <div className="form-group">
              <label>Soft Skills</label>
              <textarea className="form-control" placeholder="Liderança Situacional, Pensamento Crítico, Negociação..."
                value={data.softskills.join(', ')} 
                onChange={(e) => setData({ ...data, softskills: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}></textarea>
            </div>
            
            <div style={{ marginTop: '2.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Formação e Certificados</h3>
              <textarea className="form-control" style={{ minHeight: '100px' }} placeholder="Ex: Pós-graduação em Data Science - USP (2023)&#10;Certificação PMP - PMI (2022)"
                value={data.education.map(ed => ed.institution).join('\n')}
                onChange={(e) => {
                  const lines = e.target.value.split('\n').filter(Boolean);
                  setData({ ...data, education: lines.map((line, i) => ({ id: String(i), institution: line, degree: '', startDate: '', endDate: '' })) })
                }}></textarea>
            </div>
          </div>
        )}

        {activeTab === 'target' && (
          <div className="fade-in">
            <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>🎯 Alinhamento com a Vaga</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Para um Score ATS acima de 80, precisamos saber o que a empresa busca. Cole aqui a descrição completa.
            </p>
            <div className="form-group">
              <label>Nome do Cargo Pretendido</label>
              <input type="text" className="form-control" value={data.targetJob} onChange={(e) => setData({ ...data, targetJob: e.target.value })} placeholder="Ex: Gerente de Produto / Analista de BI Senior" />
            </div>
            <div className="form-group">
              <label>Job Description (O que pedem?)</label>
              <textarea className="form-control" style={{ minHeight: '200px' }} value={data.targetJobDescription} onChange={(e) => setData({ ...data, targetJobDescription: e.target.value })} placeholder="Copie e cole todos os requisitos e atividades da vaga aqui..."></textarea>
            </div>
            <button className="btn" style={{ width: '100%', marginTop: '1rem', padding: '1.25rem', fontSize: '1.1rem' }} onClick={onAnalyze}>
              🔥 Otimizar para esta Vaga
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
