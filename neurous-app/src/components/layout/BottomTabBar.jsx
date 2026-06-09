import { useNavigate, useLocation } from 'react-router-dom';

const HomeIcon = ({ active }) => (
  <div className="overflow-clip relative size-[28px]">
    <svg
      width="22" height="22" viewBox="0 0 22 22" fill="none"
      className="absolute left-1/2 top-1/2 size-[22px] -translate-x-1/2 -translate-y-1/2"
    >
      <path
        d="M0 7.84184C0 7.39036 0.229797 6.96679 0.616698 6.70515L10.15 0.258099C10.6589 -0.0860335 11.3411 -0.0860327 11.85 0.2581L21.3833 6.70515C21.7702 6.96679 22 7.39036 22 7.84184V19.9078C22 21.0633 21.015 22 19.8 22H2.2C0.984974 22 0 21.0633 0 19.9078V7.84184Z"
        fill={active ? '#6F44F5' : '#CACED9'}
      />
    </svg>
    <div
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-tl-[1px] rounded-tr-[1px] w-[6px] h-[9px]"
      style={{ top: 'calc(50% + 6.5px)' }}
    />
  </div>
);

const LevelIcon = ({ active }) => (
  <svg width="27" height="25" viewBox="0 0 27 25" fill="none">
    <path
      d="M10.016 0.912368C8.30487 -0.297772 7.04375 -0.0485135 6.62708 0.227383C3.766 2.02547 6.12702 5.45039 4.40479 6.99161C2.68255 8.53282 0.84873 6.64912 0.126808 8.64699C-0.610841 10.6884 2.04371 11.2157 3.59928 14.241C5.15484 17.2664 2.26593 19.9207 4.18261 21.7188C6.0993 23.5169 6.8493 22.6321 10.0715 22.4323C13.2938 22.2325 15.4883 25.6574 17.4327 24.8868C19.3772 24.1162 19.4327 22.4323 19.5994 21.7188C19.7661 21.0053 19.6549 19.808 22.905 18.4936C27.9328 16.1247 27.6828 10.7305 25.5994 9.58884C23.5161 8.4472 21.4605 5.90705 22.1272 3.3669C22.7939 0.826743 20.5161 -0.429063 18.8216 0.227383C17.1272 0.88383 12.1549 2.42504 10.016 0.912368Z"
      fill={active ? '#6F44F5' : '#CACED9'}
    />
    <path
      d="M11.9516 7.36495C11.1911 6.88089 10.6306 6.98059 10.4454 7.09095C9.17378 7.81019 10.2231 9.18016 9.45768 9.79664C8.69225 10.4131 7.87721 9.65965 7.55636 10.4588C7.22852 11.2754 8.40832 11.4863 9.09968 12.6964C9.79104 13.9066 8.50708 14.9683 9.35894 15.6875C10.2108 16.4067 10.5441 16.0528 11.9762 15.9729C13.4084 15.893 14.3837 17.263 15.2479 16.9547C16.1121 16.6465 16.1368 15.9729 16.2108 15.6875C16.2849 15.4021 16.2355 14.9232 17.68 14.3975C19.9146 13.4499 19.8035 11.2922 18.8775 10.8355C17.9516 10.3789 17.038 9.36282 17.3343 8.34676C17.6306 7.3307 16.6183 6.82837 15.8652 7.09095C15.1121 7.35353 12.9022 7.97002 11.9516 7.36495Z"
      fill="white"
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
