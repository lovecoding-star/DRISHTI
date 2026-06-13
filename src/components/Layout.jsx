import { useEffect, useState } from 'react'
import NewsTicker from './NewsTicker'

export default function Layout({ page, setPage, children }) {
  const [mode, setMode] = useState('DEMO')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setMode(data.mode || 'DEMO'))
      .catch(() => setMode('DEMO'))
  }, [])

  return (
    <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <aside style={{ width: 260, borderRight: '1px solid var(--border)', background: 'var(--bg-secondary)', padding: 24, display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: 12 }}>DRISHTI</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, marginTop: 8 }}>Exam Integrity Intelligence</h1>
          </div>
          <nav style={{ display: 'grid', gap: 12 }}>
            {['dashboard', 'preexam', 'forensics'].map((item) => {
              const labels = { dashboard: '🏛 Executive Dashboard', preexam: '🛡 Pre-Exam Watch', forensics: '🔍 Post-Exam Forensics' }
              return (
                <button key={item} onClick={() => setPage(item)} style={{ width: '100%', borderRadius: 16, border: '1px solid var(--border)', background: page === item ? 'var(--accent)' : 'transparent', color: page === item ? '#04060E' : 'var(--text-primary)', padding: '14px 16px', textAlign: 'left', fontWeight: 700 }}>
                  {labels[item]}
                </button>
              )
            })}
          </nav>
        </div>
        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: mode === 'LIVE' ? '#22C566' : '#F07020', animation: mode === 'LIVE' ? 'pulse 1.4s infinite' : undefined }} />
            <span style={{ color: mode === 'LIVE' ? '#D4F7D1' : '#F8D7A8', fontWeight: 700 }}>{mode} MODE</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
            DRISHTI analyses publicly available information. All findings are advisory only. Human verification required before any action.
          </p>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <NewsTicker />
        <div className="container" style={{ paddingTop: 24 }}>
          {children}
        </div>
      </main>
    </div>
  )
}
