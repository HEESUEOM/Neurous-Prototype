import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics, identifyUser } from './utils/analytics'

initAnalytics(import.meta.env.VITE_MIXPANEL_TOKEN);

// 이미 참여 코드가 있는 재방문 사용자 자동 identify
try {
  const raw = localStorage.getItem('user_code');
  if (raw) identifyUser(JSON.parse(raw));
} catch { /* noop */ }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
