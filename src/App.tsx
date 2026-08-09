import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SellScrap from './pages/SellScrap';
import SelectCity from './pages/SelectCity';
import ScrapPricesPage from './pages/ScrapPricesPage';
import MyPickups from './pages/MyPickups';
import MySales from './pages/MySales';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/select-city" element={<SelectCity />} />
      <Route path="/scrap-prices" element={<ScrapPricesPage />} />

      {/* Authenticated Customer Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sell-scrap"
        element={
          <ProtectedRoute>
            <SellScrap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-pickups"
        element={
          <ProtectedRoute>
            <MyPickups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-sales"
        element={
          <ProtectedRoute>
            <MySales />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
