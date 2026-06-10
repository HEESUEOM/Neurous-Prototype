import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStorage } from '../hooks/useStorage';
import { identifyUser } from '../utils/analytics';

export default function CodeEntry() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUserCode } = useStorage();

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const prev = meta?.getAttribute('content') ?? '#ffffff';
    if (meta) meta.setAttribute('content', '#F0ECFF');
    document.body.style.background = 'linear-gradient(160deg, #F0ECFF 0%, #ffffff 55%)';
    return () => {
      if (meta) meta.setAttribute('content', prev);
      document.body.style.background = '';
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) {
      setError('참여 코드를 입력해주세요.');
      return;
    }
    identifyUser(trimmed);
    setUserCode(trimmed);
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6"
      style={{ background: 'linear-gradient(160deg, #F0ECFF 0%, #FFFFFF 55%)' }}
    >
      <div className="w-full max-w-[390px]">
        {/* 로고 영역 */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-3xl mx-auto mb-5 flex items-center justify-center overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
          >
            <img
              src="/assets/character_lv1.png"
              alt="Neurous"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-[28px] font-bold text-[#1C1C1E] mb-1">Neurous</h1>
          <p className="text-[15px] text-[#8E8E93]">참여 코드를 입력해주세요</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <input
              type="text"
              value={code}
              onChange={e => { setCode(e.target.value); setError(''); }}
              placeholder=""
              maxLength={10}
              autoComplete="off"
              autoCapitalize="characters"
              className="w-full text-center text-[22px] font-semibold tracking-widest bg-white rounded-2xl px-4 py-5 outline-none border-2 border-transparent focus:border-[#6F44F5] text-[#1C1C1E] placeholder:text-[#C7C7CC] placeholder:font-normal placeholder:tracking-normal placeholder:text-[16px] shadow-sm transition-colors"
            />
            {error && (
              <p className="mt-2 text-center text-[13px] text-red-500">{error}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full text-white rounded-2xl py-4 text-[17px] font-semibold active:opacity-80 mt-1 shadow-lg shadow-purple-200"
            style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
          >
            시작하기
          </button>
        </form>
      </div>
    </div>
  );
}
