import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { ReactNode } from 'react';
import HomePage from "./pages/HomePage";
import MyCartPage from "./pages/MyCartPage";
import DetailsPage from "./pages/DetailsPage";
import OrderPage from "./pages/OrderPage";
import MyOrderPage from "./pages/MyOrderPage";
import PaymentPage from "./pages/PaymentPage";
import SuccessOrderPage from "./pages/SuccessOrderPage";
import CategoryPage from "./pages/CategoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');
    setIsAuthenticated(!!currentUser); // Set to true if currentUser exists
  }, []);

  if (isAuthenticated === null) {
    // Tampilkan loading state atau semacamnya saat memeriksa otentikasi
    return <div>Loading authentication...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rute yang dilindungi */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <MyCartPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <OrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/success-booking"
          element={
            <PrivateRoute>
              <SuccessOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-booking"
          element={
            <PrivateRoute>
              <MyOrderPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/product/:slug"
          element={
            <PrivateRoute>
              <DetailsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <PrivateRoute>
              <CategoryPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
