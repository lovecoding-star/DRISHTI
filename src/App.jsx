import { useState } from 'react'
import Layout from './components/Layout'
import ExecutiveDashboard from './components/ExecutiveDashboard'
import WatchdogPanel from './components/WatchdogPanel'
import AnomalyTable from './components/AnomalyTable'

export default function App() {
  const [page, setPage] = useState('dashboard')
  return (
    <Layout page={page} setPage={setPage}>
      {page === 'dashboard' && <ExecutiveDashboard />}
      {page === 'preexam' && <WatchdogPanel />}
      {page === 'forensics' && <AnomalyTable />}
    </Layout>
  )
}
