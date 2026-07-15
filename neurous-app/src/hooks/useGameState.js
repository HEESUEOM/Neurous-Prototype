import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { getLevelByXP, getNextLevel, XP_REWARDS } from '../data/levels';
import { MISSIONS, ALL_MISSIONS_BONUS_XP } from '../data/missions';
import { articles, ARTICLES_BY_ORDER } from '../data/articles';

export const useGameState = () => {
  const storage = useStorage();

  const getTodayKey = () => new Date().toISOString().slice(0, 10);

  const checkAttendance = useCallback(() => {
    const today = getTodayKey();
    const attendance = storage.getAttendance();
    return attendance.includes(today);
  }, []);

  const recordAttendance = useCallback(() => {
    const today = getTodayKey();
    const attendance = storage.getAttendance();
    if (!attendance.includes(today)) {
      storage.setAttendance([...attendance, today]);
      return true;
    }
    return false;
  }, []);

  const getWeeklyAttendance = useCallback(() => {
    const attendance = storage.getAttendance();
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0=일, 1=월, ..., 6=토
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);
    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d.toISOString().slice(0, 10));
    }
    return week.map(day => ({ date: day, checked: attendance.includes(day) }));
  }, []);

  const addXP = useCallback((amount) => {
    const current = storage.getXP();
    const newXP = current + amount;
    storage.setXP(newXP);
    return newXP;
  }, []);

  const checkAndApplyLevelUp = useCallback((newXP) => {
    const currentLevel = storage.getLevel();
    const newLevel = getLevelByXP(newXP);
    if (newLevel.level > currentLevel) {
      storage.setLevel(newLevel.level);
      return { leveledUp: true, newLevel };
    }
    return { leveledUp: false, newLevel: getLevelByXP(newXP) };
  }, []);

  const completeMission = useCallback((missionId) => {
    const completed = storage.getCompletedMissions();
    if (completed.includes(missionId)) return false;
    const newCompleted = [...completed, missionId];
    storage.setCompletedMissions(newCompleted);
    return true;
  }, []);

  const isAllMissionsCompleted = useCallback((completedList) => {
    return MISSIONS.every(m => completedList.includes(m.id));
  }, []);

  const getActiveMissionIndex = useCallback(() => {
    const completed = storage.getCompletedMissions();
    for (let i = 0; i < MISSIONS.length; i++) {
      if (!completed.includes(MISSIONS[i].id)) return i;
    }
    return MISSIONS.length;
  }, []);

  const getTodayArticleCompleteCount = useCallback(() => {
    const today = getTodayKey();
    const history = storage.getArticleReadHistory();
    return history.filter(h => h.date === today).length;
  }, []);

  const recordArticleRead = useCallback((articleId, source) => {
    const history = storage.getArticleReadHistory();
    const today = getTodayKey();
    const alreadyRead = history.find(h => h.articleId === articleId && h.date === today);
    if (alreadyRead) return false;
    storage.setArticleReadHistory([...history, { articleId, source, date: today, ts: Date.now() }]);
    return true;
  }, []);

  const hasReadArticleToday = useCallback((articleId) => {
    const today = getTodayKey();
    const history = storage.getArticleReadHistory();
    return history.some(h => h.articleId === articleId && h.date === today);
  }, []);

  // 소진 기록을 읽을 때마다 안전하게 정합성을 보정한다 — 정상 흐름에서는 markOrderConsumed가 12개를
  // 다 채우는 순간 즉시 리셋하지만, 어떤 이유로든 리셋 시점을 놓쳐 소진 기록이 전체(또는 그 이상)로 남아있으면
  // 추천 리스트가 계속 빈 상태로 보이게 된다. 읽는 시점에도 같은 조건을 한 번 더 확인해 즉시 자가 복구한다.
  const getConsumedOrdersSafe = useCallback(() => {
    const consumed = storage.getConsumedOrders();
    if (consumed.length >= ARTICLES_BY_ORDER.length) {
      storage.setConsumedOrders([]);
      return [];
    }
    return consumed;
  }, []);

  // 추천 순서(order) 기준 노출 큐 — 완독한 order를 소진 처리하고, 전체를 다 소진하면 다음 사이클로 리셋한다.
  const markOrderConsumed = useCallback((articleId) => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    const consumed = getConsumedOrdersSafe();
    if (consumed.includes(article.order)) return;
    const updated = [...consumed, article.order];
    storage.setConsumedOrders(updated.length >= ARTICLES_BY_ORDER.length ? [] : updated);
  }, []);

  // 홈 추천 뉴스는 항상 정확히 count(3)개를 유지한다 — 아직 읽지 않은 뉴스를 order 순서로 먼저 채우고,
  // 사이클이 거의 소진되어 미읽 뉴스가 count보다 적게 남은 경우에는 이미 읽은(체크 표시된) 뉴스를
  // order 순서로 이어 붙여 부족한 자리를 채운다. 이 계산은 홈 진입 경로(글 읽기/다음 글 보기/전체 순환 등)와
  // 무관하게 항상 동일하게 적용된다.
  const getRecommendedArticles = useCallback((count = 3) => {
    const consumed = getConsumedOrdersSafe();
    const unread = ARTICLES_BY_ORDER.filter(a => !consumed.includes(a.order));
    if (unread.length >= count) return unread.slice(0, count);
    const read = ARTICLES_BY_ORDER.filter(a => consumed.includes(a.order));
    return [...unread, ...read].slice(0, count);
  }, []);

  // '다음 글 보기' — 현재 글의 order 다음부터 순환 탐색하며, 이미 읽은(소진된) order는 모두 건너뛴다.
  // 읽지 않은 order가 남아있는 동안에는 이미 읽은 뉴스가 절대 다시 노출되지 않는다.
  const getNextArticle = useCallback((currentArticleId) => {
    const total = ARTICLES_BY_ORDER.length;
    const current = articles.find(a => a.id === currentArticleId);
    const consumed = getConsumedOrdersSafe();

    if (!current) {
      const unread = ARTICLES_BY_ORDER.filter(a => !consumed.includes(a.order));
      return unread[0] || ARTICLES_BY_ORDER[0];
    }

    for (let step = 1; step <= total; step++) {
      const order = ((current.order - 1 + step) % total) + 1;
      if (!consumed.includes(order)) {
        return ARTICLES_BY_ORDER.find(a => a.order === order);
      }
    }
    // 모든 order가 소진된 경우는 발생하지 않지만(전체 소진 시 즉시 리셋), 방어적으로 다음 순서를 반환한다.
    return ARTICLES_BY_ORDER.find(a => a.order === (current.order % total) + 1);
  }, []);

  const hasCompletedQuizToday = useCallback((articleId) => {
    const key = `quiz_done_${articleId}`;
    return localStorage.getItem(key) === getTodayKey();
  }, []);

  const markQuizCompleted = useCallback((articleId) => {
    const key = `quiz_done_${articleId}`;
    localStorage.setItem(key, getTodayKey());
  }, []);

  // 읽기 완료 처리 — 보상 계산 후 반환
  const processArticleComplete = useCallback((articleId, source) => {
    // '홈 추천 뉴스 1개 읽기' 미션은 진입 경로(source)가 아니라, 완독 처리로 소진되기 "직전" 시점에
    // 이 뉴스가 실제로 홈 추천 목록에 있었는지로 판정한다. markOrderConsumed보다 반드시 먼저 계산해야 한다.
    const wasHomeRecommended = getRecommendedArticles(3).some(a => a.id === articleId);

    markOrderConsumed(articleId);
    const isNewRead = recordArticleRead(articleId, source);
    if (!isNewRead) return null;

    const rewards = [];
    let totalXP = 0;

    // 읽기 완료 XP
    totalXP += XP_REWARDS.ARTICLE_COMPLETE;
    rewards.push({ label: '읽기 완료', xp: XP_REWARDS.ARTICLE_COMPLETE });

    // 데일리 출석
    const isFirstAttendance = recordAttendance();
    if (isFirstAttendance) {
      totalXP += XP_REWARDS.DAILY_ATTENDANCE;
      rewards.push({ label: '데일리 출석', xp: XP_REWARDS.DAILY_ATTENDANCE });
    }

    const completed = storage.getCompletedMissions();
    const todayCount = getTodayArticleCompleteCount();

    // 현재 활성 미션 1개만 완료 처리
    const activeMission = MISSIONS.find(m => !completed.includes(m.id));
    if (activeMission) {
      let conditionMet = false;
      if (activeMission.id === 'mission_01') conditionMet = todayCount >= 1;
      if (activeMission.id === 'mission_02') conditionMet = todayCount >= 2;
      if (activeMission.id === 'mission_03') conditionMet = wasHomeRecommended;
      if (activeMission.id === 'mission_04') conditionMet = source === 'next_article';

      if (conditionMet) {
        const ok = completeMission(activeMission.id);
        if (ok) {
          totalXP += XP_REWARDS.MISSION;
          rewards.push({ label: `미션: ${activeMission.label}`, xp: XP_REWARDS.MISSION });
        }
      }
    }

    // 전체 미션 완료 보너스
    const updatedCompleted = storage.getCompletedMissions();
    if (isAllMissionsCompleted(updatedCompleted)) {
      const allBonusKey = 'all_missions_bonus';
      if (!localStorage.getItem(allBonusKey)) {
        localStorage.setItem(allBonusKey, '1');
        totalXP += ALL_MISSIONS_BONUS_XP;
        rewards.push({ label: '전체 미션 완료 보너스', xp: ALL_MISSIONS_BONUS_XP });
      }
    }

    const levelBefore = getLevelByXP(storage.getXP()).level;
    const newXP = addXP(totalXP);
    const { leveledUp, newLevel } = checkAndApplyLevelUp(newXP);

    return { rewards, totalXP, newXP, leveledUp, newLevel, levelBefore };
  }, []);

  // 퀴즈 완료 처리
  const processQuizComplete = useCallback((articleId, isCorrect) => {
    if (hasCompletedQuizToday(articleId)) return null;
    markQuizCompleted(articleId);

    const rewards = [];
    let totalXP = 0;

    const quizXP = isCorrect ? XP_REWARDS.QUIZ_CORRECT : XP_REWARDS.QUIZ_WRONG;
    totalXP += quizXP;
    rewards.push({ label: isCorrect ? '퀴즈 정답' : '퀴즈 참여', xp: quizXP });

    // 현재 활성 미션이 mission_05인 경우에만 완료
    const completed = storage.getCompletedMissions();
    const activeMission = MISSIONS.find(m => !completed.includes(m.id));
    if (activeMission?.id === 'mission_05') {
      const ok = completeMission('mission_05');
      if (ok) {
        totalXP += XP_REWARDS.MISSION;
        rewards.push({ label: `미션: ${activeMission.label}`, xp: XP_REWARDS.MISSION });
      }
    }

    // 전체 미션 완료 보너스
    const updatedCompleted = storage.getCompletedMissions();
    if (isAllMissionsCompleted(updatedCompleted)) {
      const allBonusKey = 'all_missions_bonus';
      if (!localStorage.getItem(allBonusKey)) {
        localStorage.setItem(allBonusKey, '1');
        totalXP += ALL_MISSIONS_BONUS_XP;
        rewards.push({ label: '전체 미션 완료 보너스', xp: ALL_MISSIONS_BONUS_XP });
      }
    }

    const levelBefore = getLevelByXP(storage.getXP()).level;
    const newXP = addXP(totalXP);
    const { leveledUp, newLevel } = checkAndApplyLevelUp(newXP);

    return { rewards, totalXP, newXP, leveledUp, newLevel, isCorrect, levelBefore };
  }, []);

  return {
    storage,
    getTodayKey,
    checkAttendance,
    getWeeklyAttendance,
    getActiveMissionIndex,
    getTodayArticleCompleteCount,
    hasReadArticleToday,
    getRecommendedArticles,
    getNextArticle,
    hasCompletedQuizToday,
    processArticleComplete,
    processQuizComplete,
    getLevelInfo: () => {
      const xp = storage.getXP();
      return getLevelByXP(xp);
    },
    getNextLevelInfo: () => {
      const level = storage.getLevel();
      return getNextLevel(level);
    },
  };
};
