export const LEVELS = [
  { level: 1, name: '아메바', minXP: 0, maxXP: 19 },
  { level: 2, name: '꼬물 물고기', minXP: 20, maxXP: 119 },
  { level: 3, name: '리틀 몽키', minXP: 120, maxXP: 299 },
  { level: 4, name: '꼬마 원시인', minXP: 300, maxXP: 599 },
  { level: 5, name: '아인슈타인', minXP: 600, maxXP: Infinity },
];

// 프로토타입에서 실제 성장 가능한 최대 레벨
export const MAX_PROTOTYPE_LEVEL = 3;

export const getLevelByXP = (xp) => {
  const achievable = LEVELS.filter(l => l.level <= MAX_PROTOTYPE_LEVEL);
  for (let i = achievable.length - 1; i >= 0; i--) {
    if (xp >= achievable[i].minXP) return achievable[i];
  }
  return achievable[0];
};

export const getNextLevel = (currentLevel) => {
  return LEVELS.find(l => l.level === currentLevel + 1) || null;
};

export const XP_REWARDS = {
  ARTICLE_COMPLETE: 10,
  QUIZ_CORRECT: 20,
  QUIZ_WRONG: 10,
  MISSION: 5,
  ALL_MISSIONS: 15,
  DAILY_ATTENDANCE: 5,
};
