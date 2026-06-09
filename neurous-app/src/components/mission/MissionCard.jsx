import { MISSIONS } from '../../data/missions';

export default function MissionCard({ completedMissions = [] }) {
  const activeIndex = MISSIONS.findIndex(m => !completedMissions.includes(m.id));

  return (
    <div className="flex flex-col gap-4 w-full">
      {MISSIONS.map((mission, index) => {
        const isCompleted = completedMissions.includes(mission.id);
        const isActive = index === activeIndex;
        const isLocked = !isCompleted && !isActive;

        if (isLocked) {
          return (
            <div
              key={mission.id}
              className="relative w-full h-[72px] rounded-2xl border border-[#D9DCE5]"
              style={{ background: 'linear-gradient(90deg, #FBFBFC 0%, #FBFBFC 100%)' }}
            >
              <div className="absolute inset-0 flex flex-col items-start justify-center px-5 py-6">
                <span className="text-[16px] font-semibold text-[#19181E] opacity-30 whitespace-nowrap">
                  {mission.label}
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img src="/assets/Lock.png" alt="" className="w-[33px] h-[38px]" draggable={false} />
              </div>
            </div>
          );
        }

        return (
          <div
            key={mission.id}
            className="bg-white border border-[#D9DCE5] rounded-2xl px-5 py-6 flex items-center justify-between w-full"
          >
            <span className={`text-[16px] font-semibold whitespace-nowrap ${isCompleted ? 'text-[#767C91]' : 'text-[#19181E]'}`}>
              {mission.label}
            </span>
            <span className={`inline-flex items-center text-[12px] font-semibold leading-none px-2 py-[6px] rounded-[30px] whitespace-nowrap flex-shrink-0
              ${isCompleted ? 'bg-[#E8E9EF] text-[#9EA5BB]' : 'bg-[#EDECFC] text-[#6F44F5]'}`}>
              {isCompleted ? '완료' : '진행 중'}
            </span>
          </div>
        );
      })}
    </div>
  );
}
