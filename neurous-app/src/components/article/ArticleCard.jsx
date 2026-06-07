export default function ArticleCard({ article, onClick, isRead = false }) {
  const readingMinutes = Math.max(1, Math.ceil((article.body?.length || 0) / 300));
  const badgeText = `${article.category} · ${readingMinutes}분`;

  return (
    <button
      className="w-full bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform text-left relative"
      onClick={onClick}
    >
      <div className="relative">
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="w-full h-36 object-cover" />
        ) : (
          <div
            className="w-full h-36 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #EDE8FF 0%, #C4B5FD 100%)' }}
          >
            <span className="text-3xl opacity-70">📖</span>
          </div>
        )}

        {/* 카테고리 · 읽기 시간 배지 — 우측 상단 */}
        <div className="absolute top-2.5 right-2.5 bg-black/50 rounded-full px-2.5 py-1">
          <span className="text-[11px] font-semibold text-white">{badgeText}</span>
        </div>

        {/* 읽음 표시 — 중앙 원형 체크 */}
        {isRead && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 11L9 16L18 6" stroke="#6F44F5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className={`text-[15px] font-semibold leading-snug ${isRead ? 'text-[#8E8E93]' : 'text-[#1C1C1E]'}`}>
          {article.title}
        </h3>
        <div className="mt-2 flex items-center gap-2 text-[12px] text-[#8E8E93]">
          <span>{article.date}</span>
          <span>·</span>
          <span>조회 {article.views.toLocaleString()}</span>
        </div>
      </div>
    </button>
  );
}
