import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { articles } from '../../data/articles';
import { track } from '../../utils/analytics';

const LEVEL_UP_CHARACTERS = {
  2: '/assets/Character_Lv.2.png',
  3: '/assets/Character_Lv.3.png',
};

const REWARD_LABEL_MAP = {
  '읽기 완료':           '글 읽기',
  '퀴즈 정답':           '퀴즈 정답',
  '퀴즈 참여':           '퀴즈 참여',
  '데일리 출석':         '데일리 출석',
  '전체 미션 완료 보너스': '전체 미션 완료',
};

const formatRewardLabel = (label) => {
  if (label.startsWith('미션: ')) return '미션 완료';
  return REWARD_LABEL_MAP[label] ?? label;
};

const RewardTags = ({ rewards }) => (
  <div className="flex flex-wrap gap-2 justify-center">
    {rewards.map((r, i) => (
      <span
        key={i}
        className="bg-[#F6F6F6] text-[#767C91] text-[14px] px-[10px] py-1 rounded-full"
      >
        {formatRewardLabel(r.label)} +{r.xp}XP
      </span>
    ))}
  </div>
);

// articleId: '퀴즈 풀고 더 얻기' 버튼 노출 여부 및 '다음 글 보기'의 기준(prevId)·퀴즈 이동 대상으로 쓰이는
// 기존 UI/내비게이션 전용 값 — 퀴즈 완료 팝업에서는 의도적으로 null이 전달된다(기존 동작, 변경하지 않음).
// sourceArticleId: 이 팝업이 어떤 글에 대한 보상인지 나타내는 분석 전용 값 — 진입 경로와 무관하게 항상
// 실제 글 id가 전달되어, article_id/category가 이벤트 payload에 항상 일관되게 포함되도록 한다.
export default function RewardPopup({ result, articleId, sourceArticleId, onClose }) {
  const navigate = useNavigate();
  const category = articles.find(a => a.id === sourceArticleId)?.category;

  const viewTracked = useRef(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (result && !viewTracked.current) {
      viewTracked.current = true;
      const { totalXP, leveledUp, newLevel, levelBefore } = result;
      track('reward_popup_view', {
        article_id: sourceArticleId,
        reward_type: leveledUp ? 'xp+level_up' : 'xp',
        xp_amount: totalXP,
        level_before: levelBefore ?? (newLevel?.level ?? 1),
        level_after: newLevel?.level ?? 1,
        category,
      });
    }
    return () => { document.body.style.overflow = ''; };
  }, []);

  if (!result) return null;

  const { rewards, totalXP, leveledUp, newLevel, isCorrect } = result;
  const isQuizResult = typeof isCorrect === 'boolean';
  const characterSrc = `/assets/character_lv${Math.min(newLevel?.level ?? 1, 5)}.png`;
  const levelUpCharacterSrc = LEVEL_UP_CHARACTERS[newLevel?.level] ?? characterSrc;

  const handleNextArticle = () => {
    track('next_content_click', { article_id: sourceArticleId, category });
    onClose();
    // prevId는 '다음 글' 계산 기준(추천 뉴스 로직)이므로 기존 그대로 articleId를 사용한다 — 변경하지 않음.
    navigate(`/article/next`, { state: { source: 'next_article', prevId: articleId }, replace: true });
  };

  const handleQuiz = () => {
    track('quiz_enter', { article_id: sourceArticleId, category });
    onClose();
    navigate(`/quiz/${articleId}`, { replace: true });
  };

  const handleClose = () => {
    onClose();
    navigate('/', { replace: true });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-[rgba(0,0,0,0.55)]" />
      <div className="relative w-[312px]" onClick={e => e.stopPropagation()}>
        {leveledUp ? (
          /* ── 레벨업 팝업 ── */
          <>
            <div className="relative z-[2] flex justify-center mb-[-68px]">
              <img src={levelUpCharacterSrc} alt="" className="w-[260px] h-[164px] object-contain" />
            </div>
            <div className="relative z-[1] rounded-[20px] overflow-hidden">
              <div className="bg-[#F6F4FE] rounded-tl-[20px] rounded-tr-[20px] pt-[76px] pb-[16px] px-5 flex flex-col items-center gap-[6px] text-center">
                <p className="text-[#767C91] text-[14px] leading-[1.35]">축하해요! 레벨 업!</p>
                <p className="text-[#19181E] text-[24px] font-extrabold leading-[1.4] font-title">
                  Lv.{newLevel.level} {newLevel.name}
                </p>
              </div>
              <div className="bg-white rounded-bl-[20px] rounded-br-[20px] pt-4 pb-7 px-5 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <p className="text-[#6F44F5] text-[22px] font-extrabold leading-[1.5] font-title text-center w-full">
                    + {totalXP} XP
                  </p>
                  <RewardTags rewards={rewards} />
                </div>
                <div className="flex flex-col gap-[14px] items-center w-full">
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      className="w-full bg-[#6F44F5] text-white rounded-2xl py-3 text-[16px] font-bold active:opacity-80"
                      onClick={handleNextArticle}
                    >
                      다음 글 보기
                    </button>
                    {articleId && (
                      <button
                        className="w-full bg-white border border-[#D9DCE5] text-[#9EA5BB] rounded-2xl py-3 text-[16px] font-semibold active:opacity-80"
                        onClick={handleQuiz}
                      >
                        퀴즈 풀고 더 얻기
                      </button>
                    )}
                  </div>
                  <button
                    className="text-[#9EA5BB] text-[14px] active:opacity-60"
                    onClick={handleClose}
                  >
                    지금은 괜찮아요
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ── XP 획득 팝업 ── */
          <>
            <div className="relative z-[2] flex justify-center mb-[-80px]">
              <img src="/assets/xp_celebration.png" alt="" className="w-[260px] h-auto" />
            </div>
            <div className="relative z-[1] rounded-[20px] overflow-hidden">
              <div className="bg-[#F6F4FE] rounded-tl-[20px] rounded-tr-[20px] pt-[76px] pb-[16px] px-5 flex flex-col items-center gap-2 text-center">
                <p className="text-[#6F44F5] text-[26px] font-extrabold leading-[1.4] font-title">+ {totalXP} XP</p>
                <p className="text-[#19181E] text-[20px] leading-[1.5]">
                  <span className="font-title font-extrabold">경험치</span>를 획득했어요!
                </p>
              </div>
              <div className="bg-white rounded-bl-[20px] rounded-br-[20px] pt-4 pb-7 px-5 flex flex-col gap-5">
                <RewardTags rewards={rewards} />
                <div className="flex flex-col gap-[14px] items-center w-full">
                  <div className="flex flex-col gap-3 w-full">
                    <button
                      className="w-full bg-[#6F44F5] text-white rounded-2xl py-3 text-[16px] font-bold active:opacity-80"
                      onClick={handleNextArticle}
                    >
                      다음 글 보기
                    </button>
                    {!isQuizResult && articleId && (
                      <button
                        className="w-full bg-white border border-[#D9DCE5] text-[#9EA5BB] rounded-2xl py-3 text-[16px] font-semibold active:opacity-80"
                        onClick={handleQuiz}
                      >
                        퀴즈 풀고 더 얻기
                      </button>
                    )}
                  </div>
                  <button
                    className="text-[#9EA5BB] text-[14px] active:opacity-60"
                    onClick={handleClose}
                  >
                    지금은 괜찮아요
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
