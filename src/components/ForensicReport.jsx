export default function ForensicReport({ text }) {
  return (
    <div style={{ padding: 24, background: 'rgba(255,255,255,0.03)', borderRadius: 24, border: '1px solid var(--border)', marginTop: 20 }}>
      <div style={{ fontWeight: 700, marginBottom: 14 }}>Forensic Report</div>
      <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'var(--font-data)', fontSize: 14, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{text}</pre>
      <div style={{ marginTop: 18, color: 'var(--text-secondary)', fontSize: 12 }}>
        DRISHTI does not determine guilt. Advisory only.
      </div>
    </div>
  )
}
