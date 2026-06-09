import { LEVELS, getLevelByXP, getNextLevel } from '../data/levels';
import { useGameState } from '../hooks/useGameState';
import NavHeader from '../components/layout/NavHeader';

export default function GrowthStages() {
  const { storage } = useGameState();

  const xp = storage.getXP();
  const currentLevelInfo = getLevelByXP(xp);
  const nextLevel = getNextLevel(currentLevelInfo.level);
  const remainingXP = nextLevel ? Math.max(0, nextLevel.minXP - xp) : 0;

  return (
    <div className="min-h-dvh bg-white">
      <NavHeader title="성장 단계 보기" />

      <div className="px-5 pt-3 pb-10 flex flex-col gap-9">
        {/* 현재 경험치 카드 */}
        <div className="border border-[#D9DCE5] rounded-2xl p-5 flex items-center gap-6">
          <div className="flex-1 flex flex-col gap-3 min-w-0">
            <p className="text-[16px] font-semibold text-[#19181E]">현재 경험치</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-1 font-title text-[24px] text-[#19181E] leading-[1.4]">
                <span>{xp}</span>
                <span>XP</span>
              </div>
              <div className="text-[14px] leading-[1.35] text-[#9EA5BB]">
                <p className="m-0">다음 단계 달성을 위해서는</p>
                <p className="m-0">
                  <span className="text-[#6F44F5]">{remainingXP} XP</span>가 더 필요해요
                </p>
              </div>
            </div>
          </div>
          <img src="/assets/XP.png" alt="XP" className="w-[92px] h-[92px] object-contain flex-shrink-0" draggable={false} />
        </div>

        {/* 안내 문구 + 레벨 목록 */}
        <div className="flex flex-col gap-6">

        {/* 안내 문구 */}
        <p className="text-[16px] font-medium text-[#9EA5BB] leading-[1.5]">
          단세포 생물인 아메바가<br />
          <span className="text-[#6F44F5]">똑똑한 인간</span>으로 성장하는 과정이에요!
        </p>

        {/* 레벨 목록 */}
        <div className="flex flex-col gap-5">
          {LEVELS.map((levelItem, idx) => {
            const isCurrent = levelItem.level === currentLevelInfo.level;
            const subtitle = idx === 0 ? '처음 시작' : `${levelItem.minXP} XP 달성`;

            return (
              <div key={levelItem.level} className="flex items-center gap-6">
                <div className="w-[110px] h-[130px] rounded-2xl bg-[#F6F7F9] flex items-center justify-center flex-shrink-0">
                  <img
                    src={`/assets/character_lv${levelItem.level}.png`}
                    alt={levelItem.name}
                    className="w-full h-full object-contain p-4"
                    draggable={false}
                  />
                </div>
                <div className="flex-1 flex flex-col gap-[3px] min-w-0">
                  <div className="flex items-start justify-between w-full gap-2">
                    <p className="font-title text-[18px] text-[#19181E] leading-[1.5]">
                      Lv. {levelItem.level} {levelItem.name}
                    </p>
                    {isCurrent && (
                      <span className="bg-[#EDECFC] text-[#6F44F5] text-[12px] font-semibold px-2 py-1 rounded-[30px] flex-shrink-0">
                        내 레벨
                      </span>
                    )}
                  </div>
                  <p className="text-[16px] font-medium text-[#767C91] leading-[1.5]">
                    {subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        </div>{/* 안내 문구 + 레벨 목록 끝 */}
      </div>
    </div>
  );
}
