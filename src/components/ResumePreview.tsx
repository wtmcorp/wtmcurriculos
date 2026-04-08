import React from 'react';
import { ResumeData } from '../types';
import { Phone, Mail, MapPin, Linkedin, Briefcase, GraduationCap, Award, Star } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  mode: 'ats' | 'hybrid';
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, mode }) => {
  const formatBullets = (text: string) => {
    return text.split('\n').filter(line => line.trim().length > 0).map(line => {
      return line.replace(/^-\s*/, '');
    });
  };

  const { personalInfo, experience, education, hardskills, softskills, objective } = data;
  const showSkills = hardskills.length > 0 || softskills.length > 0;

  return (
    <div className="resume-doc">
      {/* HEADER */}
      <h1 style={{ textAlign: mode === 'ats' ? 'center' : 'left' }}>
        {personalInfo.fullName || 'João da Silva'}
      </h1>
      
      <div className="contact-info" style={{ justifyContent: mode === 'ats' ? 'center' : 'flex-start' }}>
        {personalInfo.city && (
          <div className="contact-item">
            {mode === 'hybrid' && <MapPin size={12} />}
            <span>{personalInfo.city}{personalInfo.state ? `, ${personalInfo.state}` : ''}</span>
            {mode === 'ats' && <span>&nbsp;|</span>}
          </div>
        )}
        {personalInfo.phone && (
          <div className="contact-item">
            {mode === 'hybrid' && <Phone size={12} />}
            <span>{personalInfo.phone}</span>
            {mode === 'ats' && <span>&nbsp;|</span>}
          </div>
        )}
        {personalInfo.email && (
          <div className="contact-item">
            {mode === 'hybrid' && <Mail size={12} />}
            <span>{personalInfo.email}</span>
            {mode === 'ats' && personalInfo.linkedin && <span>&nbsp;|</span>}
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="contact-item">
            {mode === 'hybrid' && <Linkedin size={12} />}
            <span>{personalInfo.linkedin}</span>
          </div>
        )}
      </div>

      {/* SUMMARY */}
      {objective && (
        <div className="section">
          <h2>
            {mode === 'hybrid' && <Star size={16} />}
            Resumo Profissional
          </h2>
          <p style={{ textAlign: 'justify' }}>{objective}</p>
        </div>
      )}

      {/* EXPERIENCE */}
      {experience.length > 0 && (
        <div className="section">
          <h2>
            {mode === 'hybrid' && <Briefcase size={16} />}
            Experiência Profissional
          </h2>
          {experience.map((exp, idx) => (
            <div key={idx} style={{ marginBottom: '16px' }}>
              <div className="company-row">
                <h3 className="company-name">{exp.company}</h3>
                <span className="date-loc">{exp.startDate} – {exp.endDate || 'Atual'}</span>
              </div>
              <div className="role-title">{exp.role}</div>
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
          <h2>
            {mode === 'hybrid' && <GraduationCap size={16} />}
            Formação Acadêmica
          </h2>
          {education.map((edu, idx) => (
            <div key={idx} style={{ marginBottom: '8px' }}>
              <h3 className="company-name">{edu.institution}</h3>
              <div className="role-title">{edu.degree}</div>
            </div>
          ))}
        </div>
      )}

      {/* SKILLS */}
      {showSkills && (
        <div className="section">
          <h2>
            {mode === 'hybrid' && <Award size={16} />}
            Competências Técnicas
          </h2>
          <p style={{ marginTop: '5px', fontSize: '10pt' }}>
            <strong>Hard Skills:</strong> {hardskills.join(', ')}
          </p>
          {softskills.length > 0 && (
            <p style={{ marginTop: '4px', fontSize: '10pt' }}>
              <strong>Soft Skills:</strong> {softskills.join(', ')}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
