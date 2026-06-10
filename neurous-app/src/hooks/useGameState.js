import { useCallback } from 'react';
import { useStorage } from './useStorage';
import { getLevelByXP, getNextLevel, XP_REWARDS } from '../data/levels';
import { MISSIONS, ALL_MISSIONS_BONUS_XP } from '../data/missions';

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
      if (activeMission.id === 'mission_03') conditionMet = source === 'home_recommendation';
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
