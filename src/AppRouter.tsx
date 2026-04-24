import { Routes, Route } from 'react-router-dom'
import App from './App'
import BuyPage from './pages/BuyPage'
import BuySuccessPage from './pages/BuySuccessPage'
import BuyCancelPage from './pages/BuyCancelPage'

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/buy" element={<BuyPage />} />
      <Route path="/buy/success" element={<BuySuccessPage />} />
      <Route path="/buy/cancel" element={<BuyCancelPage />} />
    </Routes>
  )
}
