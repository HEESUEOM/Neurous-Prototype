import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { articles } from '../data/articles';
import { useGameState } from '../hooks/useGameState';
import NavHeader from '../components/layout/NavHeader';
import RewardPopup from '../components/popup/RewardPopup';
import { track } from '../utils/analytics';

export default function Quiz() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const { processQuizComplete, hasCompletedQuizToday } = useGameState();

  const article = articles.find(a => a.id === articleId);
  const quiz = article?.quiz;

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [rewardResult, setRewardResult] = useState(null);

  if (!quiz) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-[#8E8E93]">퀴즈를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const alreadyDone = hasCompletedQuizToday(articleId);

  const handleNext = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const handleConfirm = () => {
    const isCorrect = selected === quiz.correct_answer;
    track('quiz_complete', { article_id: articleId, category: article.category, is_correct: isCorrect });
    const result = processQuizComplete(articleId, isCorrect);
    setRewardResult(result || { rewards: [], totalXP: 0, newXP: 0, leveledUp: false, newLevel: { level: 1 }, isCorrect });
  };

  const getOptionStyle = (index) => {
    if (!submitted) {
      return selected === index
        ? 'bg-[#F0ECFF] border-[#6F44F5]'
        : 'bg-white border-gray-200';
    }
    if (index === quiz.correct_answer) return 'bg-green-50 border-[#34C759]';
    if (index === selected && selected !== quiz.correct_answer) return 'bg-red-50 border-[#FF3B30]';
    return 'bg-white border-gray-100 opacity-50';
  };

  return (
    <>
      <div className="min-h-dvh bg-[#F2F2F7] flex flex-col">
        <div className="bg-white">
          <NavHeader title="퀴즈" />
        </div>

        <div className="flex-1 px-4 pt-6 pb-32">
          {/* 퀴즈 카드 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
            <p className="text-[11px] font-semibold text-[#6F44F5] uppercase tracking-wide mb-2">
              {article.category}
            </p>
            <p className="text-[17px] font-semibold text-[#1C1C1E] leading-snug">
              {quiz.question}
            </p>
          </div>

          {/* 선택지 */}
          <div className="flex flex-col gap-3">
            {quiz.options.map((option, index) => (
              <button
                key={index}
                className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-colors active:opacity-80 ${getOptionStyle(index)}`}
                onClick={() => !submitted && setSelected(index)}
                disabled={submitted}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-[12px] font-bold
                    ${!submitted && selected === index ? 'border-[#6F44F5] bg-[#6F44F5] text-white' : ''}
                    ${submitted && index === quiz.correct_answer ? 'border-[#34C759] bg-[#34C759] text-white' : ''}
                    ${submitted && index === selected && selected !== quiz.correct_answer ? 'border-[#FF3B30] bg-[#FF3B30] text-white' : ''}
                    ${(!submitted && selected !== index) || (submitted && index !== quiz.correct_answer && index !== selected) ? 'border-gray-300 text-gray-400' : ''}
                  `}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-[15px] text-[#1C1C1E]">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 결과 메시지 */}
          {submitted && (
            <div className={`mt-4 rounded-2xl p-4 text-center ${selected === quiz.correct_answer ? 'bg-green-50' : 'bg-red-50'}`}>
              <p className="text-[20px]">
                {selected === quiz.correct_answer ? '🎉 정답입니다!' : '😢 아쉬워요'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-40">
        <div
          className="w-full max-w-[430px] bg-white border-t border-gray-100 px-5 pt-3"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
        >
          {!submitted ? (
            <button
              className="w-full text-white rounded-2xl py-4 text-[17px] font-semibold active:opacity-80 disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
              onClick={handleNext}
              disabled={selected === null || alreadyDone}
            >
              {alreadyDone ? '오늘 이미 참여한 퀴즈예요' : '다음'}
            </button>
          ) : (
            <button
              className="w-full text-white rounded-2xl py-4 text-[17px] font-semibold active:opacity-80"
              style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
              onClick={handleConfirm}
            >
              완료
            </button>
          )}
        </div>
      </div>

      {rewardResult && (
        <RewardPopup
          result={rewardResult}
          articleId={null}
          sourceArticleId={articleId}
          onClose={() => setRewardResult(null)}
        />
      )}
    </>
  );
}
