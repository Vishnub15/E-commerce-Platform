import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { LoginRegister } from './pages/LoginRegister';
import { Checkout } from './pages/Checkout';
import { OrderHistory } from './pages/OrderHistory';
import { AdminDashboard } from './pages/AdminDashboard';
import { Info, CheckCircle, AlertTriangle } from 'lucide-react';

export const App: React.FC = () => {
  const { toast, loading } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const getToastIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} color="#34d399" />;
      case 'error':
        return <AlertTriangle size={18} color="#f87171" />;
      default:
        return <Info size={18} color="#22d3ee" />;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      {/* Top Header Navbar */}
      <Navbar onSearch={setSearchTerm} />

      {/* Slide-out Shopping Cart Drawer */}
      <CartDrawer />

      {/* Main Page Content */}
      <main style={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Foot Footer */}
      <Footer />

      {/* Floating System-wide Toast Notification */}
      {toast && (
        <div className="toast" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          borderLeft: '4px solid',
          borderColor: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#06b6d4',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
        }}>
          {getToastIcon(toast.type)}
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#ffffff' }}>
            {toast.message}
          </span>
        </div>
      )}
    </div>
  );
};
export default App;
