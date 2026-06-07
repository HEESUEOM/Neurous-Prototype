import { useNavigate, useLocation } from 'react-router-dom';

const HomeIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
      fill={active ? '#6F44F5' : 'none'}
      stroke={active ? '#6F44F5' : '#8E8E93'}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
  </svg>
);

const LevelIcon = ({ active }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12" cy="8" r="4"
      fill={active ? '#6F44F5' : 'none'}
      stroke={active ? '#6F44F5' : '#8E8E93'}
      strokeWidth="1.8"
    />
    <path
      d="M6 20C6 17.2386 8.68629 15 12 15C15.3137 15 18 17.2386 18 20"
      stroke={active ? '#6F44F5' : '#8E8E93'}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export default function BottomTabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === '/';
  const isLevel = pathname === '/level' || pathname === '/growth';

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div
        className="w-full max-w-[430px] bg-white/90 backdrop-blur-md border-t border-gray-200"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 8px)' }}
      >
        <div className="flex">
          <button
            className="flex-1 flex flex-col items-center gap-0.5 py-2 active:opacity-70"
            onClick={() => navigate('/')}
          >
            <HomeIcon active={isHome} />
            <span className={`text-[10px] font-medium ${isHome ? 'text-[#6F44F5]' : 'text-[#8E8E93]'}`}>
              홈
            </span>
          </button>
          <button
            className="flex-1 flex flex-col items-center gap-0.5 py-2 active:opacity-70"
            onClick={() => navigate('/level')}
          >
            <LevelIcon active={isLevel} />
            <span className={`text-[10px] font-medium ${isLevel ? 'text-[#6F44F5]' : 'text-[#8E8E93]'}`}>
              나의 레벨
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
