import { useEffect, useMemo, useState } from 'react'
import CentreDrawer from './CentreDrawer'

const levels = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM']

export default function AnomalyTable() {
  const [centres, setCentres] = useState([])
  const [states, setStates] = useState([])
  const [level, setLevel] = useState('ALL')
  const [stateFilter, setStateFilter] = useState('ALL')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)

  const fetchCentres = () => {
    const params = new URLSearchParams()
    if (level) params.set('level', level)
    if (stateFilter) params.set('state', stateFilter)
    if (query) params.set('q', query)
    fetch(`/api/centres?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => setCentres(data.centres || []))
  }

  useEffect(() => {
    fetchCentres()
    fetch('/api/states')
      .then((res) => res.json())
      .then((data) => setStates(data.states || []))
  }, [level, stateFilter, query])

  const stateOptions = useMemo(() => ['ALL', ...new Set(states.map((item) => item.state))], [states])

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <div>
            <div className="section-title">Post-Exam Forensics</div>
            <div style={{ color: 'var(--text-secondary)', marginTop: 8 }}>Explore flagged centres, filter incidents, and open detailed forensic reports.</div>
          </div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search centres" style={{ width: 220, padding: 12, borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 18 }}>
          {levels.map((item) => (
            <button key={item} onClick={() => setLevel(item)} style={{ padding: '10px 16px', borderRadius: 16, border: level === item ? '1px solid var(--accent)' : '1px solid var(--border)', background: level === item ? 'var(--accent)' : 'transparent', color: 'var(--text-primary)' }}>{item}</button>
          ))}
          <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} style={{ padding: '10px 14px', borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
            {stateOptions.map((state) => (<option key={state} value={state}>{state}</option>))}
          </select>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 980 }}>
            <thead>
              <tr style={{ color: 'var(--text-secondary)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: 12 }}>#</th>
                <th style={{ padding: 12 }}>CENTRE</th>
                <th style={{ padding: 12 }}>CITY</th>
                <th style={{ padding: 12 }}>STATE</th>
                <th style={{ padding: 12 }}>CANDIDATES</th>
                <th style={{ padding: 12 }}>%600 RATE</th>
                <th style={{ padding: 12 }}>ANOMALY</th>
                <th style={{ padding: 12 }}>RISK SCORE</th>
                <th style={{ padding: 12 }}>LEVEL</th>
              </tr>
            </thead>
            <tbody>
              {centres.map((centre, index) => (
                <tr key={centre.centre_code} onClick={() => setSelected(centre)} style={{ cursor: 'pointer', borderBottom: '1px solid var(--border)', background: centre.risk_level === 'CRITICAL' ? 'rgba(240,64,64,0.05)' : 'transparent' }}>
                  <td style={{ padding: 14 }}>{index + 1}</td>
                  <td style={{ padding: 14 }}>{centre.centre_name}</td>
                  <td style={{ padding: 14 }}>{centre.city}</td>
                  <td style={{ padding: 14 }}>{centre.state}</td>
                  <td style={{ padding: 14 }}>{centre.total_candidates}</td>
                  <td style={{ padding: 14, color: centre.risk_level === 'CRITICAL' ? 'var(--critical)' : 'var(--text-primary)' }}>{centre.above_600_pct}%</td>
                  <td style={{ padding: 14 }}>{centre.anomaly_multiplier.toFixed(1)}x</td>
                  <td style={{ padding: 14 }}>{centre.fraud_risk_score}</td>
                  <td style={{ padding: 14 }}><span className="badge" style={{ background: centre.risk_level === 'CRITICAL' ? 'var(--critical-bg)' : centre.risk_level === 'HIGH' ? 'var(--high-bg)' : 'var(--medium-bg)', color: centre.risk_level === 'CRITICAL' ? 'var(--critical)' : centre.risk_level === 'HIGH' ? 'var(--high)' : 'var(--text-primary)' }}>{centre.risk_level}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {selected && <CentreDrawer centre={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
