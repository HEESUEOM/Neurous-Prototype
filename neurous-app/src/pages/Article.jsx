import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { articles } from '../data/articles';
import { useGameState } from '../hooks/useGameState';
import NavHeader from '../components/layout/NavHeader';
import RewardPopup from '../components/popup/RewardPopup';

export default function Article() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { processArticleComplete, hasReadArticleToday } = useGameState();
  const [rewardResult, setRewardResult] = useState(null);

  const source = state?.source || 'direct';

  // "next" ID 처리 — 읽지 않은 글 우선, 없으면 순서대로 순환
  const resolveArticle = () => {
    if (id === 'next') {
      const prevId = state?.prevId;
      const today = new Date().toISOString().slice(0, 10);
      const history = JSON.parse(localStorage.getItem('article_read_history') || '[]');
      const readTodayIds = history.filter(h => h.date === today).map(h => h.articleId);

      const unread = articles.filter(a => !readTodayIds.includes(a.id) && a.id !== prevId);
      if (unread.length > 0) return unread[0];

      const prevIndex = articles.findIndex(a => a.id === prevId);
      const nextIndex = prevIndex >= 0 ? (prevIndex + 1) % articles.length : 0;
      return articles[nextIndex];
    }
    return articles.find(a => a.id === id);
  };

  const article = resolveArticle();

  if (!article) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-[#8E8E93]">콘텐츠를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const alreadyRead = hasReadArticleToday(article.id);

  const handleComplete = () => {
    const result = processArticleComplete(article.id, source);
    if (!result) {
      navigate(`/quiz/${article.id}`);
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

        <div className="flex-1 px-5 pt-5 pb-32">
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
            <p className="text-[13px] text-[#6F44F5]">{article.guide}</p>
          </div>

          {/* 본문 */}
          <div className="mt-5 text-[16px] text-[#1C1C1E] leading-relaxed whitespace-pre-line">
            {article.body}
          </div>

          {/* 원문 링크 */}
          <a
            href={article.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 block w-full text-center border-2 border-[#6F44F5] text-[#6F44F5] rounded-2xl py-3.5 text-[15px] font-semibold active:opacity-70"
          >
            원문 기사 확인하기 →
          </a>
        </div>
      </div>

      {/* 고정 하단 버튼 */}
      <div
        className="fixed bottom-0 left-0 right-0 flex justify-center z-40"
      >
        <div
          className="w-full max-w-[430px] bg-white border-t border-gray-100 px-5 pt-3"
          style={{ paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 16px)' }}
        >
          <button
            className="w-full text-white rounded-2xl py-4 text-[17px] font-semibold active:opacity-80 disabled:opacity-40"
            style={alreadyRead ? {} : { background: 'linear-gradient(135deg, #7C55F6, #6F44F5)' }}
            onClick={handleComplete}
            disabled={alreadyRead}
          >
            {alreadyRead ? '오늘 이미 읽은 글이에요' : '다 읽었어요'}
          </button>
        </div>
      </div>

      {/* 보상 팝업 */}
      {rewardResult && (
        <RewardPopup
          result={rewardResult}
          articleId={article.id}
          onClose={() => setRewardResult(null)}
        />
      )}
    </>
  );
}
