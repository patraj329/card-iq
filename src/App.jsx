import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Wallet from './pages/Wallet'
import Explorer from './pages/Explorer'
import Compare from './pages/Compare'
import Finder from './pages/Finder'
import CardDetail from './pages/CardDetail'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Wallet />} />
          <Route path="explorer" element={<Explorer />} />
          <Route path="compare" element={<Compare />} />
          <Route path="finder" element={<Finder />} />
          <Route path="card/:id" element={<CardDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
