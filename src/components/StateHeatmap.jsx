export default function StateHeatmap({ states }) {
  const sorted = (states || []).sort((a, b) => b.averageRisk - a.averageRisk).slice(0, 6)
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-title" style={{ marginBottom: 16 }}>State Risk Heatmap</div>
      <div style={{ display: 'grid', gap: 14 }}>
        {sorted.map((state) => (
          <div key={state.state} style={{ display: 'grid', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>{state.state}</span>
              <span>{state.averageRisk.toFixed(1)}</span>
            </div>
            <div style={{ width: '100%', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
              <div style={{ width: `${Math.min(state.averageRisk * 1.2, 100)}%`, height: '100%', borderRadius: 8, background: 'var(--high)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
