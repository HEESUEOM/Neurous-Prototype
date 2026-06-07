import { useNavigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { getLevelByXP, getNextLevel } from '../data/levels';
import MissionCard from '../components/mission/MissionCard';
import BottomTabBar from '../components/layout/BottomTabBar';

const DayDot = ({ date, checked, isToday }) => {
  const d = new Date(date + 'T00:00:00');
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dayName = dayNames[d.getDay()];

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span className={`text-[12px] font-medium ${isToday ? 'text-[#6F44F5]' : 'text-[#8E8E93]'}`}>
        {dayName}
      </span>
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[14px] font-bold
        ${checked
          ? 'bg-[#6F44F5] text-white'
          : isToday
          ? 'border-2 border-[#6F44F5] text-[#6F44F5]'
          : 'bg-[#F2F2F7] text-transparent'
        }`}>
        {checked ? '✓' : ''}
      </div>
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

  const progressPercent = nextLevel
    ? Math.min(100, ((xp - levelInfo.minXP) / (nextLevel.minXP - levelInfo.minXP)) * 100)
    : 100;

  const xpDenominator = nextLevel ? nextLevel.minXP : xp;

  return (
    <div className="min-h-dvh bg-white">
      {/* 히어로 — 배경 이미지 단독 노출, 오버레이 없음 */}
      <div className="relative" style={{ height: '56vh', minHeight: '380px' }}>
        <img
          src={bgImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-top"
          draggable={false}
        />

        {/* 레벨 태그 — 순수 흰색 pill, 블러 없음 */}
        <div
          className="relative z-10 flex flex-col items-center"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 18px)' }}
        >
          <div className="bg-white rounded-full px-5 py-2 shadow-sm">
            <span className="font-title text-[16px] font-bold text-[#1C1C1E]">
              Lv. {levelInfo.level} {levelInfo.name}
            </span>
          </div>
        </div>

        {/* XP 카드 — 히어로 하단 고정, 순수 흰색 */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4">
          <div className="bg-white rounded-t-3xl px-5 pt-5 pb-4 shadow-[0_-2px_16px_rgba(0,0,0,0.06)]">
            {/* Lv + 성장 단계 보기 */}
            <div className="flex items-center justify-between mb-3">
              <span className="font-title text-[26px] font-bold text-[#1C1C1E]">
                Lv. {levelInfo.level}
              </span>
              <button
                className="text-[13px] font-semibold text-[#6F44F5] active:opacity-60"
                onClick={() => navigate('/growth')}
              >
                성장 단계 보기 →
              </button>
            </div>

            {/* 프로그레스 바 */}
            <div className="w-full h-2.5 bg-[#F2F2F7] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, #7C55F6, #6F44F5)',
                }}
              />
            </div>

            {/* 경험치 수치 */}
            <div className="flex items-center justify-between mt-2">
              <span className="text-[14px] text-[#8E8E93]">
                경험치 {xp} / {xpDenominator}
              </span>
              <span className="text-[17px] font-bold text-[#6F44F5]">
                {Math.round(progressPercent)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 흰색 섹션 */}
      <div className="px-4 pt-5 flex flex-col gap-5 pb-28">

        {/* 주간 출석 기록 */}
        <div>
          <h2 className="font-title text-[20px] font-bold text-[#1C1C1E] mb-4">주간 출석 기록</h2>
          <div className="flex justify-between px-1">
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

        <div className="h-px bg-[#E5E5EA]" />

        {/* 오늘의 미션 */}
        <div>
          <h2 className="font-title text-[20px] font-bold text-[#1C1C1E] mb-3">오늘의 미션</h2>
          <MissionCard completedMissions={completedMissions} hiddenTitle />
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
