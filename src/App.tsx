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
    state: 'SP', 
    phone: '(11) 95091-6614', 
    email: 'wtm.tetsuo@gmail.com', 
    linkedin: '' 
  },
  targetJob: 'Especialista em Logística e Operações',
  targetJobDescription: '',
  objective: 'Especialista em Logística com foco em alta performance em centros de distribuição (JadLog, Shopee e Mercado Livre). Expertise em Last Mile, First Mile e otimização de Picking/Packing via WMS/TMS. Especialista em garantir SLAs agressivos, reduzir gargalos operacionais e liderar fluxos de expedição em ambientes de alta volumetria.',
  experience: [
    { 
      id: 'jad', 
      company: 'JadLog', 
      role: 'Assistente de Logística e Operações', 
      startDate: '08/2025', 
      endDate: '02/2026', 
      description: '- Liderança operacional na triagem diária de pacotes, garantindo 98%+ de conformidade no SLA de saída.\n- Otimização do fluxo de picking e inventário, reduzindo o tempo de processamento interno em cerca de 15%.\n- Suporte estratégico à frota de motoristas e monitoramento de KPIs de entrega First Mile.' 
    },
    { 
      id: 'shp', 
      company: 'Shopee', 
      role: 'Auxiliar de Logística', 
      startDate: '01/2025', 
      endDate: '08/2025', 
      description: '- Atuação em hub logístico de larga escala, batendo metas de produtividade diária em 110%.\n- Operação precisa de sistemas WMS para conferência de NF e expedição automatizada.\n- Redução drástica de erros de separação através da implementação de checklists de auditoria cíclica.' 
    },
    { 
      id: 'ml', 
      company: 'Mercado Livre (Fulfillment)', 
      role: 'Auxiliar de Logística', 
      startDate: '06/2024', 
      endDate: '01/2025', 
      description: '- Execução de excelência em processos de Fulfillment, garantindo agilidade no fluxo de entrada e saída (Inbound/Outbound).\n- Gestão de recebimento e conferência, mantendo acurácia de estoque acima de 99,8%.\n- Treinamento informal de novos colaboradores em práticas de segurança e produtividade no CD.' 
    }
  ],
  education: [
    { id: 'ed1', institution: 'Formação Acadêmica', degree: 'Ensino Médio Completo', startDate: '', endDate: '' },
    { id: 'ed2', institution: 'Treinamento Especializado', degree: 'Brigadista: Prevenção e Combate a Incêndio / Primeiros Socorros', startDate: '', endDate: '' }
  ],
  courses: [],
  hardskills: ['WMS / TMS Avançado', 'Gestão de Inventário Cíclico', 'Last Mile & First Mile', 'Expedição de Alta Volumetria', 'Cross-docking', 'Fulfillment', 'Análise de KPIs Logísticos', 'Office 365'],
  softskills: ['Liderança Operacional', 'Foco em SLA', 'Resolução de Conflitos', 'Mentalidade Lean', 'Segurança do Trabalho (EPI)']
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
