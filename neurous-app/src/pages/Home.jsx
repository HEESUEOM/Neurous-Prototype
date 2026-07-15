import { useNavigate, useLocation } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { MISSIONS } from '../data/missions';
import ArticleCard from '../components/article/ArticleCard';
import BottomTabBar from '../components/layout/BottomTabBar';

function MissionSlide({ mission, isCompleted, isActive, isLocked }) {
  if (isLocked) {
    return (
      <div className="snap-center flex-shrink-0 w-full px-5">
        <div
          className="relative h-[72px] rounded-2xl border border-[#D9DCE5]"
          style={{ background: 'linear-gradient(90deg, #FBFBFC 0%, #FBFBFC 100%)' }}
        >
          <div className="absolute inset-0 flex items-center px-5">
            <span className="text-[16px] font-semibold text-[#19181E] opacity-30 whitespace-nowrap">
              {mission.label}
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="/assets/Lock.png" alt="" className="w-[33px] h-[38px]" draggable={false} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="snap-center flex-shrink-0 w-full px-5">
      <div className="bg-white border border-[#D9DCE5] rounded-2xl px-5 py-6 flex items-center justify-between">
        <p className={`text-[16px] font-semibold whitespace-nowrap ${isCompleted ? 'text-[#767C91]' : 'text-[#19181E]'}`}>
          {mission.label}
        </p>
        <div className={`px-2 py-[6px] rounded-[30px] flex items-center flex-shrink-0 ${isCompleted ? 'bg-[#E8E9EF]' : 'bg-[#EDECFC]'}`}>
          <span className={`text-[12px] font-semibold whitespace-nowrap leading-none ${isCompleted ? 'text-[#9EA5BB]' : 'text-[#6F44F5]'}`}>
            {isCompleted ? '완료' : '진행 중'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { key } = useLocation();
  const { storage, hasReadArticleToday, getRecommendedArticles } = useGameState();

  // 홈 탭을 다시 선택하거나 다른 화면에서 돌아왔을 때 항상 스크롤을 맨 위로 초기화한다.
  // location key는 같은 경로로 재진입(재선택)해도 매번 새로 발급되므로 두 경우 모두 커버된다.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);
  const completedMissions = storage.getCompletedMissions();
  const rawActiveIndex = MISSIONS.findIndex(m => !completedMissions.includes(m.id));
  const activeIndex = rawActiveIndex >= 0 ? rawActiveIndex : 0;

  const carouselRef = useRef(null);
  const [activeDot, setActiveDot] = useState(activeIndex);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el || activeIndex === 0) return;
    el.scrollLeft = activeIndex * el.clientWidth;
  }, []);

  // 추천 순서(order) 기준으로 아직 소진하지 않은 뉴스 3개를 노출한다.
  // 12개를 모두 소진하면 다음 사이클로 리셋되어 order 1부터 다시 노출된다.
  const recommendedArticles = getRecommendedArticles(3);

  const handleScroll = () => {
    const el = carouselRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActiveDot(index);
  };

  return (
    <div className="min-h-dvh bg-white pb-24">
      <div
        className="flex flex-col gap-12"
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 24px)' }}
      >
        {/* 오늘의 미션 섹션 */}
        <div className="flex flex-col gap-6">
          <h1 className="font-title text-[24px] text-[#19181E] px-5">오늘의 미션</h1>
          <div className="flex flex-col gap-3">
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
                    isCompleted={isCompleted}
                    isActive={isActive}
                    isLocked={isLocked}
                  />
                );
              })}
            </div>
            {/* 도트 인디케이터 */}
            <div className="flex justify-center items-center gap-2">
              {MISSIONS.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeDot ? 'bg-[#6F44F5] w-3 h-3' : 'bg-[#D9DCE5] w-2 h-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 추천 글 섹션 */}
        <div className="px-5 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h1 className="font-title text-[24px] text-[#19181E]">추천 뉴스</h1>
            <p className="text-[16px] font-medium text-[#ADB3C5]">짧은 읽기부터 시작해 하루 한 걸음 성장해보세요.</p>
          </div>
          <div className="flex flex-col gap-6">
            {recommendedArticles.map(article => (
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
