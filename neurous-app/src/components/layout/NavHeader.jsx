import { useNavigate } from 'react-router-dom';

export default function NavHeader({ title, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="flex items-center h-11 px-4 bg-white border-b border-gray-100">
      <button
        className="flex items-center gap-1 text-[#6F44F5] active:opacity-60 mr-2"
        onClick={handleBack}
      >
        <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
          <path d="M8.5 1.5L1.5 8.5L8.5 15.5" stroke="#6F44F5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[17px]">뒤로</span>
      </button>
      {title && (
        <span className="absolute left-0 right-0 text-center text-[17px] font-semibold text-[#1C1C1E] pointer-events-none">
          {title}
        </span>
      )}
    </div>
  );
}
