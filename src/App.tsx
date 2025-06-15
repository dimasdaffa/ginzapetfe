import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<MyCartPage />} />
        <Route path="/Order" element={<OrderPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/success-Order" element={<SuccessOrderPage />} />
        <Route path="/my-Order" element={<MyOrderPage />} />
        <Route path="/product/:slug" element={<DetailsPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
