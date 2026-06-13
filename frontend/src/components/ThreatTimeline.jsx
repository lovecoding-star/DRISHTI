import { useEffect, useState } from 'react'

const defaultSteps = [
  '08:41:03 Suspicious PDF detected',
  '08:41:04 Content extraction started',
  '08:41:06 Gemini AI analysis running',
  '08:41:09 Threat score: 91/100',
  '08:41:10 CRITICAL ALERT generated',
  '08:41:10 Escalation issued'
]

export default function ThreatTimeline({ alerts }) {
  const [visible, setVisible] = useState([])

  useEffect(() => {
    setVisible([])
    defaultSteps.forEach((step, index) => {
      setTimeout(() => setVisible((prev) => [...prev, step]), index * 500)
    })
  }, [alerts.length])

  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-title" style={{ marginBottom: 16 }}>Threat Timeline</div>
      <div style={{ display: 'grid', gap: 12 }}>
        {visible.map((step, index) => (
          <div key={index} style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--accent)' }} />
            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
