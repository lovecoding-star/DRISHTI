import { useEffect, useState } from 'react'
import AlertFeed from './AlertFeed'
import ThreatTimeline from './ThreatTimeline'
import ThreatGraph from './ThreatGraph'

export default function WatchdogPanel() {
  const [status, setStatus] = useState({ watchdog: { demo_mode: true, channels: [] } })
  const [messages, setMessages] = useState([])
  const [alerts, setAlerts] = useState([])
  const [glow, setGlow] = useState(false)
  const [graph, setGraph] = useState(null)

  useEffect(() => {
    fetch('/api/watchdog/status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
    fetch('/api/alerts')
      .then((res) => res.json())
      .then((data) => setAlerts(data.alerts || []))
    fetch('/api/graph')
      .then((res) => res.json())
      .then((data) => setGraph(data.graph))

    const socket = new WebSocket('ws://localhost:8000/ws/alerts')
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'watchdog_message') {
        setMessages((prev) => [data.payload, ...prev].slice(0, 6))
      }
      if (data.type === 'alert') {
        setAlerts((prev) => [data.payload, ...prev].slice(0, 6))
        setGlow(true)
        setTimeout(() => setGlow(false), 2000)
      }
    })
    return () => socket.close()
  }, [])

  const startMonitoring = () => {
    fetch('/api/watchdog/status')
      .then((res) => res.json())
      .then((data) => setStatus(data))
  }

  const simulateThreat = async () => {
    setGlow(false)
    await fetch('/api/watchdog/simulate', { method: 'POST' })
    setStatus((prev) => ({ ...prev, simulated: true }))
  }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <div className="card" style={{ padding: 28, border: glow ? '1px solid var(--critical)' : '1px solid var(--border)', boxShadow: glow ? '0 0 30px rgba(240,64,64,0.35)' : undefined }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div className="section-title">Pre-Exam Watch</div>
            <div style={{ marginTop: 8, color: 'var(--text-secondary)' }}>
              {status.watchdog?.demo_mode ? 'Demo monitoring with simulated Telegram traffic' : 'Live Telegram monitoring enabled'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={startMonitoring} style={{ padding: '12px 18px', borderRadius: 16, border: '1px solid var(--border)', background: 'var(--low)', color: '#04060E', fontWeight: 700 }}>▶ START MONITORING</button>
            <button onClick={simulateThreat} style={{ padding: '12px 18px', borderRadius: 16, border: '1px solid var(--border)', background: '#F07020', color: '#FFF', fontWeight: 700 }}>⚡ SIMULATE THREAT</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 20 }}>
          <div>
            <div style={{ marginBottom: 12, fontWeight: 700 }}>Live channel feed</div>
            <div style={{ display: 'grid', gap: 12 }}>
              {messages.length === 0 && <div style={{ color: 'var(--text-secondary)' }}>Waiting for Telegram feed...</div>}
              {messages.map((message, index) => (
                <div key={index} style={{ padding: 14, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{message.channel}</div>
                  <div style={{ marginTop: 8 }}>{message.text}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 12, fontWeight: 700 }}>Watchdog status</div>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ padding: 18, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Status</div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>{status.watchdog?.demo_mode ? 'DEMO ACTIVE' : 'LIVE ACTIVE'}</div>
              </div>
              <div style={{ padding: 18, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Channels monitored</div>
                <div style={{ marginTop: 8 }}>{status.watchdog?.channels?.join(', ') || '3 channels'}</div>
              </div>
              <div style={{ padding: 18, borderRadius: 18, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <div style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Alerts fired</div>
                <div style={{ marginTop: 8, fontWeight: 700 }}>{alerts.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 20, gridTemplateColumns: '1fr 1fr' }}>
        <AlertFeed alerts={alerts} />
        <ThreatGraph graph={graph} />
      </div>
      <ThreatTimeline alerts={alerts} />
    </div>
  )
}
