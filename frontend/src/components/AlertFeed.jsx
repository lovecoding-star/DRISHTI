export default function AlertFeed({ alerts }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-title" style={{ marginBottom: 16 }}>Alert Feed</div>
      <div style={{ display: 'grid', gap: 14 }}>
        {alerts.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>No alerts yet. Simulate a threat to populate the feed.</div>}
        {alerts.slice(0, 5).map((alert) => (
          <div key={alert.id} style={{ padding: 16, borderRadius: 18, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <div style={{ fontWeight: 700 }}>{alert.threat_level} Alert</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>{alert.timestamp?.slice(0, 19).replace('T', ' ')}</div>
            </div>
            <div style={{ marginTop: 8, color: 'var(--text-muted)' }}>{alert.channel_name}</div>
            <div style={{ marginTop: 12, fontSize: 14 }}>{alert.reasoning}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: 'var(--critical-bg)', color: 'var(--critical)' }}>Risk {alert.risk_score}</span>
              <span className="badge" style={{ background: 'rgba(59,123,246,0.1)', color: 'var(--accent)' }}>{alert.content_type}</span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, fontSize: 12, color: 'var(--text-secondary)' }}>
        DRISHTI analyses publicly available information. Findings are advisory only.
      </div>
    </div>
  )
}
