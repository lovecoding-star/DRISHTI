import { useEffect, useState } from 'react'
import ForensicReport from './ForensicReport'

export default function CentreDrawer({ centre, onClose }) {
  const [report, setReport] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setReport('')
    setLoading(false)
  }, [centre])

  const generateReport = async () => {
    setLoading(true)
    const response = await fetch(`/api/centres/${centre.centre_code}/report`)
    const data = await response.json()
    if (data.report) {
      setReport(data.report)
    }
    setLoading(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(4,6,14,0.65)', display: 'grid', placeItems: 'end center', padding: 24, zIndex: 50 }}>
      <div className="card" style={{ width: 'min(920px, 100%)', maxHeight: '92vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'transparent', border: '1px solid var(--border)', borderRadius: 14, color: 'var(--text-primary)', padding: '10px 12px' }}>Close</button>
        <div style={{ display: 'grid', gap: 18 }}>
          <div>
            <h2 style={{ marginBottom: 8 }}>{centre.centre_name}</h2>
            <div style={{ color: 'var(--text-secondary)' }}>{centre.city}, {centre.state}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 12 }}>
            <div style={{ padding: 18, background: 'rgba(255,255,255,0.03)', borderRadius: 18 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Risk Score</div>
              <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{centre.fraud_risk_score}</div>
            </div>
            <div style={{ padding: 18, background: 'rgba(255,255,255,0.03)', borderRadius: 18 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Above-600 Rate</div>
              <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{centre.above_600_pct}%</div>
            </div>
            <div style={{ padding: 18, background: 'rgba(255,255,255,0.03)', borderRadius: 18 }}>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Anomaly</div>
              <div style={{ marginTop: 8, fontSize: 28, fontWeight: 700 }}>{centre.anomaly_multiplier.toFixed(1)}x</div>
            </div>
          </div>
          <div style={{ display: 'grid', gap: 8, padding: 18, background: 'rgba(255,255,255,0.02)', borderRadius: 18 }}>
            <div style={{ fontWeight: 700 }}>Metrics breakdown</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 12, fontSize: 13 }}>
              <div><strong>{centre.above_400}</strong><div style={{ color: 'var(--text-secondary)' }}>Above 400</div></div>
              <div><strong>{centre.above_500}</strong><div style={{ color: 'var(--text-secondary)' }}>Above 500</div></div>
              <div><strong>{centre.above_700}</strong><div style={{ color: 'var(--text-secondary)' }}>Above 700</div></div>
              <div><strong>{centre.perfect_720}</strong><div style={{ color: 'var(--text-secondary)' }}>Perfect 720</div></div>
              <div><strong>{centre.average_score}</strong><div style={{ color: 'var(--text-secondary)' }}>Average</div></div>
            </div>
          </div>
          <button onClick={generateReport} disabled={loading} style={{ borderRadius: 18, border: 'none', padding: '14px 20px', background: 'var(--accent)', color: '#04060E', fontWeight: 700, width: 220 }}>
            {loading ? 'Generating report…' : 'Generate Report'}
          </button>
          {report && <ForensicReport text={report} />}
          <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>
            DRISHTI analyses publicly available information. All findings are advisory only. Human verification required.
          </div>
        </div>
      </div>
    </div>
  )
}
