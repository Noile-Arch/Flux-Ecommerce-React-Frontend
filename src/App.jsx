import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

import CartPage from "./pages/CartPage";
import MensPage from "./pages/MensPage";
import WomensPage from "./pages/WomensPage";
import ElectronicsPage from "./pages/ElectronicsPage";
import JeweleryPage from "./pages/JeweleryPage";
import LoginPage from "./pages/auth/LogIn";
import SignupPage from "./pages/auth/SignUp";
import PageLayout from "./layout/PageLayout";
import OrderHistory from "./pages/OrderHistory";
import AdminLayout from "./layout/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";
import AdminSettings from "./pages/admin/Settings";
import CategoryPage from "./pages/CategoryPage";
import CategoryPageWrapper from "./pages/CategoryPageWrapper";

function App() {
  const { token, user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={token ? <Navigate to={user?.is_admin ? "/admin/dashboard" : "/home"} /> : <LoginPage />} 
        />
        <Route path="/signup" element={<SignupPage />} />

        {/* User Routes */}
        <Route element={<ProtectedRoute><PageLayout /></ProtectedRoute>}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/mens" element={<MensPage />} />
          <Route path="/womens" element={<WomensPage />} />
          <Route path="/electronics" element={<ElectronicsPage />} />
          <Route path="/jewelery" element={<JeweleryPage />} />
          <Route path="/orders" element={<OrderHistory />} />
          <Route path="/category/:category" element={<CategoryPageWrapper />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
