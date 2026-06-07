import { LEVELS, getLevelByXP } from '../data/levels';
import { useGameState } from '../hooks/useGameState';
import NavHeader from '../components/layout/NavHeader';

export default function GrowthStages() {
  const { storage } = useGameState();

  const xp = storage.getXP();
  const currentLevelInfo = getLevelByXP(xp);

  return (
    <div className="min-h-dvh bg-white">
      <NavHeader title="성장 단계" />

      <div className="pb-10">
        {LEVELS.map((levelItem, idx) => {
          const isCurrent = levelItem.level === currentLevelInfo.level;
          const isAchieved = xp >= levelItem.minXP;
          const isLast = idx === LEVELS.length - 1;

          return (
            <div
              key={levelItem.level}
              className={`flex items-center gap-4 px-4 py-4 ${!isLast ? 'border-b border-[#E5E5EA]' : ''}`}
            >
              {/* 캐릭터 이미지 */}
              <img
                src={`/assets/character_lv${levelItem.level}.png`}
                alt={levelItem.name}
                className="w-16 h-16 object-contain flex-shrink-0"
              />

              {/* 레벨 정보 */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-semibold text-[#8E8E93]">Lv.{levelItem.level}</p>
                  {isCurrent && (
                    <span className="text-[11px] font-bold text-white bg-[#6F44F5] px-2 py-0.5 rounded-full">
                      내 레벨
                    </span>
                  )}
                </div>
                <p className={`font-title text-[17px] font-bold mt-0.5 ${isCurrent ? 'text-[#6F44F5]' : 'text-[#1C1C1E]'}`}>
                  {levelItem.name}
                </p>
              </div>

              {/* 우측 상태 */}
              <div className="flex-shrink-0">
                {isCurrent ? (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : isAchieved ? (
                  <div className="w-7 h-7 rounded-full bg-[#34C759] flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M3 7L6 10L11 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#C7C7CC" strokeWidth="1.5" />
                    <path d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7" stroke="#C7C7CC" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
