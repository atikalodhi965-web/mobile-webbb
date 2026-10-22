import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AuthModal from './components/Auth/AuthModal';

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
            <AuthModal />
          </BrowserRouter>
        </CartProvider>
      </AdminAuthProvider>
    </AuthProvider>
  );
}

export default App;

