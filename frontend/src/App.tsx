import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import DrawingFlowPage from './pages/DrawingFlowPage';
import EmotionAnalysisPage from './pages/EmotionAnalysisPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="/start" element={<StartPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="/draw" element={<DrawingFlowPage />} />
      <Route path="/analysis" element={<EmotionAnalysisPage />} />
    </Routes>
  );
}

export default App;
