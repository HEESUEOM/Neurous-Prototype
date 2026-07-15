import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initAnalytics, identifyUser } from './utils/analytics'

initAnalytics(import.meta.env.VITE_MIXPANEL_TOKEN);

// 브라우저의 자동 스크롤 복원(뒤로가기 시 이전 스크롤 위치 재적용)을 끈다 — 홈/나의 레벨 화면의
// "항상 맨 위로" 정책이 브라우저 기본 동작에 덮어써지지 않도록 하기 위함.
if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

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
