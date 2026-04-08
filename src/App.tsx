import { useState } from 'react'
import { ResumeData, AtsScore, Experience, Education, Course } from './types'
import { analyzeResume } from './utils/analyze'
import { ResumeForm } from './components/ResumeForm'
import { ResumePreview } from './components/ResumePreview'
import { ScorePanel } from './components/ScorePanel'
import { Layout } from './components/Layout'

const INITIAL_DATA: ResumeData = {
  personalInfo: { 
    fullName: 'WALTER TETSUO', 
    city: 'Suzano', 
    state: 'SP (CEP: 08615-180)', 
    phone: '(11) 95091-6614', 
    email: 'wtm.tetsuo@gmail.com', 
    linkedin: '' 
  },
  targetJob: 'Especialista em Logística e Operações',
  targetJobDescription: '',
  objective: 'Profissional dinâmico com sólida trajetória em logística e gestão de centros de distribuição de alta performance (JadLog, Shopee e Mercado Livre). Especialista em controle de inventário, fluxos de expedição e otimização de picking. Expertise em suporte operacional a motoristas e gestão de devoluções com foco em agilidade na resolução de problemas e conformidade SLA.',
  experience: [
    { 
      id: 'jad', 
      company: 'JadLog', 
      role: 'Assistente de Logística e Operações', 
      startDate: '08/2025', 
      endDate: '02/2026', 
      description: '- Gestão de fluxos de expedição e triagem em hub logístico de alta volumetria.\n- Controle de inventário e otimização de rotas de picking para redução de gargalos.\n- Suporte operacional a frotas e monitoramento de KPIs de entrega.' 
    },
    { 
      id: 'shp', 
      company: 'Shopee', 
      role: 'Auxiliar de Logística', 
      startDate: '01/2025', 
      endDate: '08/2025', 
      description: '- Atuação em centro de distribuição focado em triagem e separação de grandes volumes de pacotes.\n- Conferência de mercadoria e operação via coletor de dados em sistemas WMS.\n- Garantia de produtividade em metas diárias agressivas de expedição.' 
    },
    { 
      id: 'ml', 
      company: 'Mercado Livre (Fulfillment)', 
      role: 'Auxiliar de Logística', 
      startDate: '06/2024', 
      endDate: '01/2025', 
      description: '- Operação logística de ponta a ponta em ambiente de Fulfillment.\n- Conferência de NF-e, recebimento e armazenamento estratégico para otimização de espaço.\n- Manutenção de 99%+ de acurácia em inventário cíclico.' 
    }
  ],
  education: [
    { id: 'ed1', institution: 'Ensino Médio Completo | Suzano - SP', degree: '', startDate: '', endDate: '' },
    { id: 'ed2', institution: 'Formação de Brigadista: Combate a incêndio e Primeiros Socorros', degree: '', startDate: '', endDate: '' }
  ],
  courses: [],
  hardskills: ['WMS', 'TMS', 'ERP Logístico', 'Gestão de Inventário', 'Conferência de NF', 'Cross-docking', 'Picking / Packing', 'Ferramentas Office', 'Tráfego Pago'],
  softskills: ['Liderança', 'Resolução de Problemas', 'Agilidade', 'Adaptação', 'Segurança do Trabalho (EPI)']
}

import { LinkedInGenerator } from './components/LinkedInGenerator'

import { AtsAssistant } from './components/AtsAssistant'

function App() {
  const [data, setData] = useState<ResumeData>(INITIAL_DATA)
  const [score, setScore] = useState<AtsScore | null>(null)
  const [previewMode, setPreviewMode] = useState<'ats' | 'hybrid'>('ats')

  const handleAnalyze = () => {
    const result = analyzeResume(data)
    setScore(result)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Layout>
      <div className="app-container">
        <div className="left-panel form-section no-print">
          <header className="app-header">
            <h1>ATSMax <span style={{ color: '#60a5fa', fontSize: '1rem', fontWeight: 400 }}>Pro</span></h1>
            <p>Seu currículo no topo dos algoritmos e na mão dos recrutadores.</p>
          </header>
          
          <ResumeForm data={data} setData={setData} onAnalyze={handleAnalyze} />
          
          <AtsAssistant data={data} setData={setData} />
          
        </div>
        <div className="right-panel preview-section">
          <div className="preview-controls no-print">
            <div className="mode-switch">
              <button 
                className={previewMode === 'ats' ? 'active' : ''} 
                onClick={() => setPreviewMode('ats')}>
                Versão ATS (Pura)
              </button>
              <button 
                className={previewMode === 'hybrid' ? 'active' : ''} 
                onClick={() => setPreviewMode('hybrid')}>
                Versão Híbrida (ATS+Humano)
              </button>
            </div>
            <button className="btn-print" onClick={handlePrint}>Exportar PDF</button>
          </div>

          {score && (
            <div style={{ width: '100%', maxWidth: '800px' }}>
              <ScorePanel score={score} className="no-print" />
              <LinkedInGenerator data={data} />
            </div>
          )}
          
          <div className={`resume-wrapper ${previewMode}-mode`} style={{ marginTop: score ? '2rem' : '0' }}>
            <ResumePreview data={data} mode={previewMode} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default App
