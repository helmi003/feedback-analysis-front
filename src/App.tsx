import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'
import { queryClientManager } from '../src/services/queryClientManager';;
// import FeedbackList from './pages/feedback';
// import FeedbackStatistics from './pages/statistics';
import Home from './pages/home';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClientManager.queryClient}>
        <Routes>
          {/* <Route path="/feedbacks" element={<FeedbackList />} /> */}
          {/* <Route path="/stats" element={<FeedbackStatistics />} /> */}
          <Route path="/" element={<Home />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
