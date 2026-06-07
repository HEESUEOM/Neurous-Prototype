import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStorage } from './hooks/useStorage';
import CodeEntry from './pages/CodeEntry';
import Home from './pages/Home';
import Article from './pages/Article';
import Quiz from './pages/Quiz';
import MyLevel from './pages/MyLevel';
import GrowthStages from './pages/GrowthStages';

function RequireCode({ children }) {
  const { getUserCode } = useStorage();
  const code = getUserCode();
  if (!code) return <Navigate to="/enter" replace />;
  return children;
}

export default function App() {
  return (
    <div className="flex justify-center min-h-dvh bg-gray-200">
      <div className="w-full max-w-[430px] min-h-dvh bg-white relative shadow-xl">
        <BrowserRouter>
          <Routes>
            <Route path="/enter" element={<CodeEntry />} />
            <Route path="/" element={<RequireCode><Home /></RequireCode>} />
            <Route path="/article/:id" element={<RequireCode><Article /></RequireCode>} />
            <Route path="/quiz/:articleId" element={<RequireCode><Quiz /></RequireCode>} />
            <Route path="/level" element={<RequireCode><MyLevel /></RequireCode>} />
            <Route path="/growth" element={<RequireCode><GrowthStages /></RequireCode>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}
