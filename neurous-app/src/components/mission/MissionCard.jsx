import { MISSIONS } from '../../data/missions';

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="8" rx="1.5" stroke="#C7C7CC" strokeWidth="1.5" />
    <path d="M5 7V5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5V7" stroke="#C7C7CC" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill="#34C759" />
    <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ActiveDot = () => (
  <div className="w-2 h-2 rounded-full bg-[#6F44F5]" />
);

export default function MissionCard({ completedMissions = [], hiddenTitle = false }) {
  const activeIndex = MISSIONS.findIndex(m => !completedMissions.includes(m.id));

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      {!hiddenTitle && (
        <div className="px-4 pt-4 pb-2">
          <h2 className="text-[15px] font-semibold text-[#1C1C1E]">오늘의 미션</h2>
        </div>
      )}
      <div className="divide-y divide-gray-50">
        {MISSIONS.map((mission, index) => {
          const isCompleted = completedMissions.includes(mission.id);
          const isActive = index === activeIndex;
          const isLocked = !isCompleted && !isActive;

          return (
            <div
              key={mission.id}
              className={`flex items-center gap-3 px-4 py-3 ${isLocked ? 'opacity-40' : ''}`}
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                {isCompleted ? <CheckIcon /> : isLocked ? <LockIcon /> : <ActiveDot />}
              </div>
              <span className={`text-[16px] flex-1 ${isCompleted ? 'line-through text-[#8E8E93]' : isActive ? 'text-[#1C1C1E] font-medium' : 'text-[#1C1C1E]'}`}>
                {mission.label}
              </span>
              {isActive && (
                <span className="text-[11px] font-semibold text-[#6F44F5] bg-[#F0ECFF] px-2 py-0.5 rounded-full">
                  진행 중
                </span>
              )}
              {isCompleted && (
                <span className="text-[11px] font-semibold text-[#34C759] bg-green-50 px-2 py-0.5 rounded-full">
                  완료
                </span>
              )}
              <span className="text-[12px] text-[#8E8E93]">+{mission.xp} XP</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
