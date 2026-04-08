import { useState } from 'react'
import { ResumeData, AtsScore, Experience, Education, Course } from './types'
import { analyzeResume } from './utils/analyze'
import { ResumeForm } from './components/ResumeForm'
import { ResumePreview } from './components/ResumePreview'
import { ScorePanel } from './components/ScorePanel'
import { Layout } from './components/Layout'

const INITIAL_DATA: ResumeData = {
  personalInfo: { fullName: '', city: '', state: '', phone: '', email: '', linkedin: '' },
  targetJob: '',
  targetJobDescription: '',
  objective: '',
  experience: [],
  education: [],
  courses: [],
  hardskills: [],
  softskills: []
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
