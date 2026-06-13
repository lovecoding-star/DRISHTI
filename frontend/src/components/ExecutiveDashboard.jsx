import { useEffect, useMemo, useState } from 'react'

const statConfig = [
  { label: 'Centres Analysed', field: 'centreCount', color: 'var(--accent)' },
  { label: 'Critical Alerts', field: 'criticalAlerts', color: 'var(--critical)' },
  { label: 'High Risk Centres', field: 'highRiskCentres', color: 'var(--high)' },
  { label: 'Threats Detected', field: 'threatsDetected', color: '#8B5CF6' },
  { label: 'States Flagged', field: 'statesFlagged', color: 'var(--medium)' },
  { label: 'Candidates Affected', field: 'candidatesAffected', color: 'var(--text-primary)' }
]

export default function ExecutiveDashboard() {
  const [summary, setSummary] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [counts, setCounts] = useState({})

  useEffect(() => {
    fetch('/api/summary')
      .then((res) => res.json())
      .then((data) => setSummary(data.summary))
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts || []))
  }, [])

  useEffect(() => {
    if (!summary) return
    const animation = setInterval(() => {
      setCounts((previous) => {
        const next = { ...previous }
        let done = true
        statConfig.forEach((stat) => {
          const value = summary[stat.field] || 0
          const current = previous[stat.field] || 0
          if (current < value) {
            done = false
            next[stat.field] = Math.min(value, current + Math.max(Math.ceil(value / 18), 1))
          }
        })
        if (done) {
          clearInterval(animation)
        }
        return next
      })
    }, 70)
    return () => clearInterval(animation)
  }, [summary])

  const topCentres = useMemo(() => summary?.topCentres || [], [summary])

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 20 }}>
        {statConfig.map((stat) => (
          <div key={stat.field} className="card" style={{ padding: 24, border: `1px solid ${stat.color}` }}>
            <div style={{ color: stat.color, fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{stat.label}</div>
            <div style={{ marginTop: 16, fontSize: 42, fontWeight: 700 }}>{counts[stat.field] ?? 0}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Recent Alerts</div>
          <div style={{ display: 'grid', gap: 16 }}>
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 18, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ fontWeight: 700, color: '#FFF' }}>{alert.threat_level} ALERT</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 8 }}>{alert.channel_name} · Confidence {alert.confidence}%</div>
                <div style={{ marginTop: 12, color: 'var(--text-muted)', fontSize: 14 }}>{alert.reasoning}</div>
              </div>
            ))}
            {!alerts.length && <div style={{ color: 'var(--text-secondary)' }}>No alerts have been detected yet.</div>}
          </div>
        </div>
        <div className="card" style={{ padding: 24 }}>
          <div className="section-title" style={{ marginBottom: 16 }}>Top 5 Flagged Centres</div>
          <div style={{ display: 'grid', gap: 16 }}>
            {topCentres.map((centre) => (
              <div key={centre.centre_code} style={{ padding: 16, border: '1px solid var(--border)', borderRadius: 18, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>{centre.centre_name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{centre.city}, {centre.state}</div>
                  </div>
                  <div style={{ color: 'var(--critical)', fontWeight: 700 }}>{centre.risk_level}</div>
                </div>
                <div style={{ marginTop: 10, fontSize: 14, color: 'var(--text-muted)' }}>
                  Above-600 rate {centre.above_600_pct}% · Score {centre.fraud_risk_score}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
