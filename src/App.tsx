import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import FeedbackList from './pages/feedback';
import { queryClientManager } from '../src/services/queryClientManager';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClientManager.queryClient}>
        <Routes>
          <Route path="/feedbacks" element={<FeedbackList />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
