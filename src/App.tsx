import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClientProvider } from 'react-query'
import { queryClientManager } from '../src/services/queryClientManager';
import Home from './pages/home';

function App() {
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
