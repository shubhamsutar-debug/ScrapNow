import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import SellScrap from './pages/SellScrap';
import SelectCity from './pages/SelectCity';
import ScrapPricesPage from './pages/ScrapPricesPage';
import MyPickups from './pages/MyPickups';
import MySales from './pages/MySales';
import CollectorRegister from './pages/CollectorRegister';
import CollectorDashboard from './pages/CollectorDashboard';
import CollectorPickupRequests from './pages/CollectorPickupRequests';
import CollectorMyPickups from './pages/CollectorMyPickups';
import CollectorTransactions from './pages/CollectorTransactions';
import CollectorStoreProfile from './pages/CollectorStoreProfile';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      {/* Public Unauthenticated Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/select-city" element={<SelectCity />} />
      <Route path="/scrap-prices" element={<ScrapPricesPage />} />

      {/* Collector Registration Flow */}
      <Route path="/collector/register" element={<CollectorRegister />} />

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

      {/* Authenticated Collector Routes */}
      <Route
        path="/collector/dashboard"
        element={
          <ProtectedRoute requiredRole="collector">
            <CollectorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collector/pickup-requests"
        element={
          <ProtectedRoute requiredRole="collector">
            <CollectorPickupRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collector/my-pickups"
        element={
          <ProtectedRoute requiredRole="collector">
            <CollectorMyPickups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collector/transactions"
        element={
          <ProtectedRoute requiredRole="collector">
            <CollectorTransactions />
          </ProtectedRoute>
        }
      />
      <Route
        path="/collector/store-profile"
        element={
          <ProtectedRoute requiredRole="collector">
            <CollectorStoreProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
