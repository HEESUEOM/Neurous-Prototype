import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import { articles } from '../data/articles';
import { useGameState } from '../hooks/useGameState';
import NavHeader from '../components/layout/NavHeader';
import RewardPopup from '../components/popup/RewardPopup';
import { track } from '../utils/analytics';

export default function Article() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { processArticleComplete, hasReadArticleToday, hasCompletedQuizToday, getNextArticle } = useGameState();
  const [rewardResult, setRewardResult] = useState(null);

  const source = state?.source || 'direct';
  const prevId = state?.prevId;

  // "next" ID 처리 — 홈 추천과 동일한 order 기준으로, 이미 읽은 뉴스는 건너뛰고 다음 미읽 뉴스를 보여준다.
  // id/prevId(=이 화면으로 들어온 시점의 파라미터)가 바뀔 때만 다시 계산한다 — "다 읽었어요"로
  // 소진 기록이 갱신된 뒤 리렌더링이 일어나도 같은 화면에서는 동일한 글을 계속 가리켜야 하기 때문이다.
  // (그렇지 않으면 완독 처리로 소진 기록이 바뀌면서 article이 다음 글로 밀려, 퀴즈 버튼이 엉뚱한 글의
  // 퀴즈로 연결되는 문제가 발생한다.)
  const article = useMemo(() => {
    if (id === 'next') {
      return getNextArticle(prevId);
    }
    return articles.find(a => a.id === id);
  }, [id, prevId]);

  const startTracked = useRef(false);
  useEffect(() => {
    if (!article || startTracked.current) return;
    startTracked.current = true;
    track('article_start', { article_id: article.id, category: article.category });
  }, [article?.id]);

  if (!article) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-[#8E8E93]">콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const alreadyRead = hasReadArticleToday(article.id);
  // 읽기는 완료했지만 퀴즈를 아직 안 푼 경우, 다시 들어와도 '퀴즈 풀기' CTA로 계속 진입할 수 있어야 한다.
  const quizAlreadyDone = hasCompletedQuizToday(article.id);
  const showQuizCTA = alreadyRead && !quizAlreadyDone;
  const hasBottomCTA = !alreadyRead || showQuizCTA;

  const handleComplete = () => {
    track('article_complete', { article_id: article.id, category: article.category });
    const result = processArticleComplete(article.id, source);
    if (!result) {
      navigate(`/quiz/${article.id}`, { replace: true });
      return;
    }
    setRewardResult(result);
  };

  return (
    <>
      <div className="min-h-dvh bg-white flex flex-col">
        <NavHeader />

        {/* 커버 이미지 */}
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="w-full h-52 object-cover" />
        ) : (
          <div className="w-full h-52 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EDE8FF 0%, #C4B5FD 100%)' }}>
            <span className="text-5xl opacity-70">📖</span>
          </div>
        )}

        <div className={`px-5 pt-5 ${hasBottomCTA ? 'pb-32' : 'pb-12'}`}>
          {/* 카테고리 */}
          <span className="text-[12px] font-semibold text-[#6F44F5] uppercase tracking-wide">
            {article.category}
          </span>

          {/* 제목 */}
          <h1 className="mt-1 text-[22px] font-bold text-[#1C1C1E] leading-snug">
            {article.title}
          </h1>

          {/* 날짜, 조회수 */}
          <div className="mt-2 flex items-center gap-2 text-[13px] text-[#8E8E93]">
            <span>{article.date}</span>
            <span>·</span>
            <span>조회 {article.views.toLocaleString()}</span>
          </div>

          {/* 안내 문구 */}
          <div className="mt-4 bg-[#F0ECFF] rounded-xl px-4 py-3">
            <p className="text-[13px] text-[#767C91]">
              기사의 <span className="text-[#6F44F5] font-semibold">핵심 사실만 추출해 재구성한 글</span>이에요.
            </p>
          </div>

          {/* 본문 */}
          <div className="mt-5 text-[16px] text-[#1C1C1E] leading-relaxed whitespace-pre-line">
            {article.body}
          </div>
        </div>
      </div>

      {/* 고정 하단 버튼 — 읽기+퀴즈를 모두 완료한 글은 더 이상 액션이 없으므로 영역 자체를 노출하지 않는다 */}
      {!alreadyRead && (
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-center z-40"
        >
          <div
            className="w-full max-w-[430px] bg-white border-t border-gray-100 px-5 pt-3"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
          >
            <button
              className="w-full text-white rounded-2xl py-4 text-[17px] font-semibold active:opacity-80"
              style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
              onClick={handleComplete}
            >
              다 읽었어요
            </button>
          </div>
        </div>
      )}

      {/* 읽기는 완료했지만 퀴즈를 아직 안 푼 경우 — 같은 위치/스타일의 CTA로 퀴즈 화면 재진입을 허용한다 */}
      {showQuizCTA && (
        <div
          className="fixed bottom-0 left-0 right-0 flex justify-center z-40"
        >
          <div
            className="w-full max-w-[430px] bg-white border-t border-gray-100 px-5 pt-3"
            style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
          >
            <button
              className="w-full text-white rounded-2xl py-4 text-[17px] font-semibold active:opacity-80"
              style={{ background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
              onClick={() => navigate(`/quiz/${article.id}`)}
            >
              퀴즈 풀기
            </button>
          </div>
        </div>
      )}

      {/* 보상 팝업 */}
      {rewardResult && (
        <RewardPopup
          result={rewardResult}
          articleId={article.id}
          sourceArticleId={article.id}
          onClose={() => setRewardResult(null)}
        />
      )}
    </>
  );
}
