import mixpanel from 'mixpanel-browser';

// 모듈 로드 시 1회 생성 — SPA 탐색에서는 유지, 페이지 재로드 시 갱신
const SESSION_ID = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const initAnalytics = (token) => {
  if (!token) return;
  mixpanel.init(token, {
    debug: import.meta.env.DEV,
    track_pageview: false,
  });
};

export const identifyUser = (userId) => {
  if (!userId) return;
  mixpanel.identify(userId);
};

const getUserId = () => {
  try {
    const raw = localStorage.getItem('user_code');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const track = (eventName, properties = {}) => {
  try {
    mixpanel.track(eventName, {
      user_id: getUserId(),
      session_id: SESSION_ID,
      ...properties,
    });
  } catch {
    // analytics 오류가 앱 동작을 방해하지 않도록 silent fail
  }
};
