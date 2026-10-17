import { Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout'
import Dashboard from './pages/Dashboard'
import Websites from './pages/Websites'
import WebsiteDetail from './pages/WebsiteDetail'
import Incidents from './pages/Incidents'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="websites" element={<Websites />} />
        <Route path="websites/:id" element={<WebsiteDetail />} />
        <Route path="incidents" element={<Incidents />} />
      </Route>
    </Routes>
  )
}

export default App
