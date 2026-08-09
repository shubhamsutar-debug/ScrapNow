import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SellScrap from './pages/SellScrap';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sell-scrap" element={<SellScrap />} />
    </Routes>
  );
}

export default App;
