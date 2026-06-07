import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function RewardPopup({ result, articleId, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!result) return null;

  const { rewards, totalXP, newXP, leveledUp, newLevel, isCorrect } = result;
  const isQuizResult = typeof isCorrect === 'boolean';
  const characterSrc = `/assets/character_lv${Math.min(newLevel?.level ?? 1, 5)}.png`;

  const handleNextArticle = () => {
    onClose();
    navigate(`/article/next`, { state: { source: 'next_article', prevId: articleId } });
  };

  const handleQuiz = () => {
    onClose();
    navigate(`/quiz/${articleId}`);
  };

  const handleClose = () => {
    onClose();
    navigate('/', { replace: true });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-[430px] bg-white rounded-t-3xl px-6 pt-5"
        style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 32px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* 드래그 핸들 */}
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />

        {leveledUp ? (
          /* ── 레벨업 팝업 ── */
          <>
            {/* 캐릭터 + 레벨업 배지 */}
            <div className="flex flex-col items-center mb-5">
              <div className="relative">
                <div className="w-28 h-28 rounded-3xl bg-[#F0ECFF] flex items-center justify-center overflow-hidden">
                  <img src={characterSrc} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="absolute -top-2 -right-2 bg-gradient-to-br from-[#7C55F6] to-[#6F44F5] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md">
                  레벨 업! 🎉
                </div>
              </div>
              <p className="mt-4 text-[13px] text-[#8E8E93] font-medium">성장했어요</p>
              <p className="text-[22px] font-bold text-[#1C1C1E] mt-0.5">
                Lv.{newLevel.level} {newLevel.name}
              </p>
            </div>

            {/* 획득 내역 */}
            <div className="bg-[#F7F5FF] rounded-2xl p-4 mb-5">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-[13px] font-semibold text-[#1C1C1E]">획득 내역</span>
                <span className="text-[17px] font-bold text-[#6F44F5]">+{totalXP} XP</span>
              </div>
              {rewards.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <span className="text-[13px] text-[#636366]">{r.label}</span>
                  <span className="text-[13px] font-semibold text-[#1C1C1E]">+{r.xp} XP</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ── XP 획득 팝업 ── */
          <>
            {/* 캐릭터 + XP */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-20 h-20 rounded-2xl bg-[#F0ECFF] flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src={characterSrc} alt="" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-[13px] text-[#8E8E93]">잘했어요!</p>
                <p className="text-[24px] font-bold text-[#1C1C1E] leading-tight">+{totalXP} XP</p>
                <p className="text-[12px] text-[#8E8E93] mt-0.5">현재 {newXP} XP</p>
              </div>
            </div>

            {/* 획득 내역 */}
            <div className="bg-[#F7F5FF] rounded-2xl p-4 mb-5">
              <p className="text-[13px] font-semibold text-[#1C1C1E] mb-2">획득 내역</p>
              {rewards.map((r, i) => (
                <div key={i} className="flex justify-between items-center py-1">
                  <span className="text-[13px] text-[#636366]">{r.label}</span>
                  <span className="text-[13px] font-semibold text-[#1C1C1E]">+{r.xp} XP</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA 버튼 */}
        <div className="flex flex-col gap-2">
          <button
            className="w-full text-white rounded-2xl py-4 text-[16px] font-semibold active:opacity-80"
            style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
            onClick={handleNextArticle}
          >
            다음 글 보기
          </button>
          {!isQuizResult && articleId && (
            <button
              className="w-full bg-[#F0ECFF] text-[#6F44F5] rounded-2xl py-4 text-[16px] font-semibold active:opacity-80"
              onClick={handleQuiz}
            >
              퀴즈 풀고 더 얻기
            </button>
          )}
          <button
            className="w-full text-[#8E8E93] py-3 text-[15px] active:opacity-60"
            onClick={handleClose}
          >
            지금은 괜찮아요
          </button>
        </div>
      </div>
    </div>
  );
}
