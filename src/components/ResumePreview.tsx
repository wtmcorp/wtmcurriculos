import React from 'react';
import { ResumeData } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  mode: 'ats' | 'hybrid';
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, mode }) => {
  const formatBullets = (text: string) => {
    return text.split('\n').filter(line => line.trim().length > 0).map(line => {
      // Clean up common bullet dashes from input
      return line.replace(/^-\s*/, '');
    });
  };

  const { personalInfo, experience, education, hardskills, softskills, objective } = data;
  const showSkills = hardskills.length > 0 || softskills.length > 0;

  return (
    <div className="resume-doc">
      {/* HEADER */}
      <h1>{personalInfo.fullName || 'João da Silva'}</h1>
      <div className="contact-info">
        {personalInfo.city && <span>{personalInfo.city}{personalInfo.state ? ` - ${personalInfo.state}` : ''} </span>}
        {personalInfo.phone && <span> | {personalInfo.phone} </span>}
        {personalInfo.email && <span> | {personalInfo.email} </span>}
        {personalInfo.linkedin && <span> | {personalInfo.linkedin}</span>}
      </div>

      {/* SUMMARY */}
      {objective && (
        <div className="section">
          <h2>Resumo Profissional</h2>
          <p>{objective}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <div className="section">
          <h2>Experiência Profissional</h2>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: mode === 'ats' ? '12px' : '16px' }}>
              <div>
                <h3 className="company-name">{exp.company}</h3>
                <span className="date-loc">
                  {exp.startDate} {exp.endDate ? `- ${exp.endDate}` : ''}
                </span>
                <div style={{ fontWeight: mode === 'hybrid' ? 500 : 'normal', fontStyle: mode === 'ats' ? 'italic' : 'normal', color: mode === 'hybrid' ? '#475569' : 'inherit' }}>
                  {exp.role}
                </div>
              </div>
              {exp.description && (
                <ul>
                  {formatBullets(exp.description).map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* EDUCATION */}
      {education.length > 0 && (
        <div className="section">
          <h2>Formação Acadêmica</h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <div>
                <span className="company-name">{edu.institution}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {showSkills && (
        <div className="section">
          <h2>Competências e Habilidades Técnicas</h2>
          <p style={{ marginTop: '5px' }}>
            {hardskills.join(', ')}
            {hardskills.length > 0 && softskills.length > 0 && ' • '}
            {softskills.join(', ')}
          </p>
        </div>
      )}
    </div>
  );
};
