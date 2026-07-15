import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { useGameState } from '../hooks/useGameState';
import { getLevelByXP, getNextLevel } from '../data/levels';
import { articles } from '../data/articles';
import { track } from '../utils/analytics';

const BG_TOP_COLORS = { 1: '#BDD7FB', 2: '#CDE8EF', 3: '#DAE6B9' };
import MissionCard from '../components/mission/MissionCard';
import BottomTabBar from '../components/layout/BottomTabBar';

const DayDot = ({ date, checked, isToday }) => {
  const d = new Date(date + 'T00:00:00');
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[d.getDay()];

  return (
    <div className="flex flex-col items-center gap-1">
      <span className={`text-[15px] font-medium tracking-[-0.3px] ${isToday ? 'text-[#6F44F5]' : 'text-[#19181E]'}`}>
        {dayName}
      </span>
      {checked ? (
        <img src="/assets/Attend_Check.png" alt="" className="w-[30px] h-[30px]" draggable={false} />
      ) : (
        <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center
          ${isToday
            ? 'bg-white border-2 border-[#6F44F5]'
            : 'bg-white border border-[#D9DCE5]'
          }`}
        />
      )}
    </div>
  );
};

export default function MyLevel() {
  const navigate = useNavigate();
  const { storage, getWeeklyAttendance } = useGameState();

  const xp = storage.getXP();
  const levelInfo = getLevelByXP(xp);
  const nextLevel = getNextLevel(levelInfo.level);
  const completedMissions = storage.getCompletedMissions();
  const weeklyAttendance = getWeeklyAttendance();
  const today = new Date().toISOString().slice(0, 10);

  const bgImage = `/assets/bg_lv${Math.min(levelInfo.level, 3)}.png`;
  const bgTopColor = BG_TOP_COLORS[Math.min(levelInfo.level, 3)];

  const viewTracked = useRef(false);
  useEffect(() => {
    if (!viewTracked.current) {
      viewTracked.current = true;
      track('character_growth_view', { character_level: levelInfo.level });
    }
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute('content') ?? '#ffffff';
    if (meta) meta.setAttribute('content', bgTopColor);
    document.body.style.backgroundColor = bgTopColor;
    return () => {
      if (meta) meta.setAttribute('content', prev);
      document.body.style.backgroundColor = '';
    };
  }, [bgTopColor]);

  // 실제로는 Lv.4 달성 지점(다음 레벨의 minXP)에 도달해야 MAX 상태다 — Lv.3 도달 시점(120 XP)이 아니라
  // Lv.3 구간을 다 채우는 300 XP부터만 MAX로 전환한다. Lv.3의 다음 레벨(Lv.4)은 프로토타입에 없어 항상
  // Lv.3에 머무르지만, 그 이후에도 XP는 계속 누적되므로 이 시점부터 MAX 상태로 표시한다.
  const isMaxLevel = !!nextLevel && xp >= nextLevel.minXP;

  const progressPercent = isMaxLevel
    ? 100
    : nextLevel
      ? Math.min(100, ((xp - levelInfo.minXP) / (nextLevel.minXP - levelInfo.minXP)) * 100)
      : 100;

  const xpDenominator = nextLevel ? nextLevel.minXP : xp;

  return (
    <div className="min-h-dvh" style={{ backgroundColor: bgTopColor }}>
      {/* 무대(배경) — 캐릭터 + 카드들이 함께 올라서는 레이어. 원본 비율 그대로, 끝나는 지점은 White Background와 자연 연결 */}
      <div className="relative w-full" style={{ aspectRatio: '1179 / 2850' }}>
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full"
          draggable={false}
        />

        {/* 레벨 태그 — 캐릭터와 한 그룹으로 보이도록 살짝 아래로 */}
        <div
          className="absolute left-0 right-0 z-10 flex justify-center"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 38px)' }}
        >
          <div className="bg-white/70 backdrop-blur-sm border-2 border-white rounded-full h-[44px] px-4 flex items-center gap-[2px]">
            <span className="font-title text-[20px] font-bold text-[#19181E]">
              {' '}Lv. {levelInfo.level} {levelInfo.name}
            </span>
          </div>
        </div>

        {/* XP 카드 — 배경 위에 떠 있는(Floating) 카드, 사방 모서리 라운드 */}
        <div className="absolute left-5 right-5 z-10" style={{ top: '53%' }}>
          <div className="bg-white/75 backdrop-blur-sm border-[3px] border-white rounded-2xl px-6 pt-6 pb-5 flex flex-col gap-3">
            {/* Lv + 성장 가이드 보기 */}
            <div className="flex items-center justify-between w-full">
              <span className="font-title text-[24px] font-bold text-[#19181E]">
                Lv. {levelInfo.level}
              </span>
              <button
                className="bg-[#E8E9EF] rounded-[30px] px-3 py-1.5 text-[12px] font-medium text-[#767C91] active:opacity-60"
                onClick={() => navigate('/growth')}
              >
                성장 가이드 보기
              </button>
            </div>

            {/* 프로그레스 바 */}
            <div className="relative w-full h-[18px] bg-[#E8E9EF] rounded-[9.5px] overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-[9.5px] transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #9B7BFF, #6F44F5)',
                  boxShadow: 'inset 2px 3px 7px 0px rgba(255,255,255,0.6)',
                }}
              />
            </div>

            {/* 경험치 수치 */}
            <div className="flex items-center justify-between w-full">
              <span className="text-[14px] text-[#767C91]">
                {isMaxLevel ? `경험치 ${xp} XP` : `경험치 ${xp} / ${xpDenominator}`}
              </span>
              <span className="font-title text-[20px] font-bold text-[#6F44F5]">
                {isMaxLevel ? 'MAX' : `${Math.round(progressPercent)}%`}
              </span>
            </div>
          </div>
        </div>

        {/* 주간 출석 기록 — 제목은 배경 위에, 출석 기록은 Floating 카드 안에 */}
        <div className="absolute left-5 right-5 z-10" style={{ top: '74.68%' }}>
          <h2 className="font-title text-[18px] font-bold text-black mb-4">주간 출석 기록</h2>
          <div className="bg-[#F6F7F9] rounded-2xl px-6 py-[30px] flex items-center justify-between">
            {weeklyAttendance.map((day) => (
              <DayDot
                key={day.date}
                date={day.date}
                checked={day.checked}
                isToday={day.date === today}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 배경 종료 이후 — White Background 위 콘텐츠 (배경 이미지의 빈 여백만큼 끌어올려 카드 간 간격을 일정하게 유지) */}
      <div className="relative z-20 bg-white px-5 pb-28" style={{ marginTop: '-8.4%' }}>
        <div className="flex flex-col gap-1 mb-8">
          <h2 className="font-title text-[18px] font-bold text-[#19181E]">오늘의 미션</h2>
          <p className="text-[16px] text-[#9EA5BB]">진행 중인 미션을 완료하면 새로운 미션이 열려요!</p>
        </div>
        <MissionCard completedMissions={completedMissions} />

        {/* 테스트용 — 오늘 읽기 기록 초기화 */}
        <div className="mt-10 flex justify-center">
          <button
            className="text-[#CACED9] text-[12px] active:opacity-50"
            onClick={() => {
              const today = new Date().toISOString().slice(0, 10);
              const history = storage.getArticleReadHistory();
              storage.setArticleReadHistory(history.filter(h => h.date !== today));
              storage.setAttendance(storage.getAttendance().filter(d => d !== today));
              storage.setCompletedMissions([]);
              storage.setLevel(1);
              storage.setXP(0);
              localStorage.removeItem('all_missions_bonus');
              articles.forEach(a => localStorage.removeItem(`quiz_done_${a.id}`));
              storage.setConsumedOrders([]);
            }}
          >
            오늘 읽기 기록 초기화
          </button>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
