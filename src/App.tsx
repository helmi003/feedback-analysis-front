import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'
import { queryClientManager } from '../src/services/queryClientManager';
import { useMetrics } from './hooks/useMetrics';
import Home from './pages/home';

function App() {
  const { useComponentLifecycle } = useMetrics();
  
  // Track App component lifecycle
  useComponentLifecycle('App');

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClientManager.queryClient}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
