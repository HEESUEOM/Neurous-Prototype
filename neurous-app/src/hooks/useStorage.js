import { useState, useCallback } from 'react';

const STORAGE_KEYS = {
  USER_CODE: 'user_code',
  CURRENT_XP: 'current_xp',
  CURRENT_LEVEL: 'current_level',
  COMPLETED_MISSIONS: 'completed_missions',
  ATTENDANCE: 'attendance',
  ARTICLE_READ_HISTORY: 'article_read_history',
  RECOMMENDATION_CONSUMED_ORDERS: 'recommendation_consumed_orders',
};

const get = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val !== null ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const set = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
};

export const useStorage = () => {
  const [, forceUpdate] = useState(0);
  const refresh = useCallback(() => forceUpdate(n => n + 1), []);

  const getUserCode = () => get(STORAGE_KEYS.USER_CODE, null);
  const setUserCode = (code) => { set(STORAGE_KEYS.USER_CODE, code); refresh(); };

  const getXP = () => get(STORAGE_KEYS.CURRENT_XP, 0);
  const setXP = (xp) => { set(STORAGE_KEYS.CURRENT_XP, xp); refresh(); };

  const getLevel = () => get(STORAGE_KEYS.CURRENT_LEVEL, 1);
  const setLevel = (level) => { set(STORAGE_KEYS.CURRENT_LEVEL, level); refresh(); };

  const getCompletedMissions = () => get(STORAGE_KEYS.COMPLETED_MISSIONS, []);
  const setCompletedMissions = (missions) => { set(STORAGE_KEYS.COMPLETED_MISSIONS, missions); refresh(); };

  const getAttendance = () => get(STORAGE_KEYS.ATTENDANCE, []);
  const setAttendance = (attendance) => { set(STORAGE_KEYS.ATTENDANCE, attendance); refresh(); };

  const getArticleReadHistory = () => get(STORAGE_KEYS.ARTICLE_READ_HISTORY, []);
  const setArticleReadHistory = (history) => { set(STORAGE_KEYS.ARTICLE_READ_HISTORY, history); refresh(); };

  const getConsumedOrders = () => get(STORAGE_KEYS.RECOMMENDATION_CONSUMED_ORDERS, []);
  const setConsumedOrders = (orders) => { set(STORAGE_KEYS.RECOMMENDATION_CONSUMED_ORDERS, orders); refresh(); };

  return {
    getUserCode, setUserCode,
    getXP, setXP,
    getLevel, setLevel,
    getCompletedMissions, setCompletedMissions,
    getAttendance, setAttendance,
    getArticleReadHistory, setArticleReadHistory,
    getConsumedOrders, setConsumedOrders,
  };
};
