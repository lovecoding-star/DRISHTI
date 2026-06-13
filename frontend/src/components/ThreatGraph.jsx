export default function ThreatGraph({ graph }) {
  const nodes = graph?.nodes?.slice(0, 8) || []
  const links = graph?.links?.slice(0, 8) || []

  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="section-title" style={{ marginBottom: 16 }}>Threat Correlation Map</div>
      <div style={{ minHeight: 240, display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' }}>
        <div style={{ width: '100%', height: 240, position: 'relative' }}>
          {nodes.map((node, index) => (
            <div key={node.id} style={{ position: 'absolute', left: `${10 + index * 11}%`, top: `${20 + (index % 3) * 22}%`, width: 78, padding: 10, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: 18, fontSize: 12 }}>
              <div style={{ fontWeight: 700, color: node.group === 'CRITICAL' ? 'var(--critical)' : node.group === 'HIGH' ? 'var(--high)' : 'var(--text-primary)' }}>{node.group}</div>
              <div>{node.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-secondary)' }}>
        Nodes represent centre clusters and alerts. Links show potential correlation across state and risk patterns.
      </div>
    </div>
  )
}
