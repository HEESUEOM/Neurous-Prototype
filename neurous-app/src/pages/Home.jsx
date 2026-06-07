import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { articles } from '../data/articles';
import { MISSIONS } from '../data/missions';
import ArticleCard from '../components/article/ArticleCard';
import BottomTabBar from '../components/layout/BottomTabBar';

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#C7C7CC" strokeWidth="1.5" />
    <path d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7" stroke="#C7C7CC" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#34C759" />
    <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function MissionSlide({ mission, index, isCompleted, isActive, isLocked }) {
  return (
    <div className={`snap-center flex-shrink-0 w-full px-4`}>
      <div className={`rounded-2xl p-5 border ${isActive ? 'bg-[#F0ECFF] border-[#D4C8FF]' : 'bg-white border-[#E5E5EA]'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
              {isCompleted
                ? <CheckIcon />
                : isLocked
                ? <LockIcon />
                : <div className="w-2.5 h-2.5 rounded-full bg-[#6F44F5]" />
              }
            </div>
            <p className={`text-[17px] font-semibold leading-snug ${isLocked ? 'text-[#C7C7CC]' : isCompleted ? 'text-[#8E8E93] line-through' : 'text-[#1C1C1E]'}`}>
              {mission.label}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 pl-9">
          {isCompleted && (
            <span className="text-[11px] font-semibold text-[#34C759] bg-green-50 px-2 py-0.5 rounded-full">완료</span>
          )}
          {isActive && (
            <span className="text-[11px] font-semibold text-[#6F44F5] bg-[#E8E0FF] px-2 py-0.5 rounded-full">진행 중</span>
          )}
          {isLocked && (
            <span className="text-[11px] font-semibold text-[#C7C7CC] px-2 py-0.5 rounded-full">잠금</span>
          )}
          <span className="text-[12px] text-[#8E8E93] ml-auto">+{mission.xp} XP</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { storage, hasReadArticleToday } = useGameState();
  const completedMissions = storage.getCompletedMissions();
  const activeIndex = MISSIONS.findIndex(m => !completedMissions.includes(m.id));

  const carouselRef = useRef(null);
  const [activeDot, setActiveDot] = useState(0);

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveDot(index);
  };

  return (
    <div className="min-h-dvh bg-white pb-24">
      <div
        className="flex flex-col gap-6"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}
      >
        {/* 오늘의 미션 섹션 */}
        <div>
          <h1 className="font-title text-[26px] font-bold text-[#1C1C1E] px-4 mb-3">오늘의 미션</h1>

          {/* 카루셀 */}
          <div
            ref={carouselRef}
            className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none' }}
            onScroll={handleScroll}
          >
            {MISSIONS.map((mission, index) => {
              const isCompleted = completedMissions.includes(mission.id);
              const isActive = index === activeIndex;
              const isLocked = !isCompleted && !isActive;
              return (
                <MissionSlide
                  key={mission.id}
                  mission={mission}
                  index={index}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  isLocked={isLocked}
                />
              );
            })}
          </div>

          {/* 도트 인디케이터 */}
          <div className="flex justify-center gap-1.5 mt-3">
            {MISSIONS.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-200"
                style={{
                  width: i === activeDot ? 16 : 6,
                  height: 6,
                  backgroundColor: i === activeDot ? '#6F44F5' : '#E5E5EA',
                }}
              />
            ))}
          </div>
        </div>

        {/* 오늘의 추천 글 섹션 */}
        <div className="px-4">
          <h1 className="font-title text-[26px] font-bold text-[#1C1C1E] mb-1">오늘의 추천 글</h1>
          <p className="text-[14px] text-[#8E8E93] mb-4">짧은 읽기부터 시작해 하루 한 걸음 성장해보세요.</p>
          <div className="flex flex-col gap-3">
            {articles.slice(0, 3).map(article => (
              <ArticleCard
                key={article.id}
                article={article}
                isRead={hasReadArticleToday(article.id)}
                onClick={() => navigate(`/article/${article.id}`, { state: { source: 'home_recommendation' } })}
              />
            ))}
          </div>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
