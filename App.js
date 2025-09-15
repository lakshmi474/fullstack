import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cuisine from "./pages/Cuisine";
import Cart from "./components/Cart";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { addActivity } from "./data/users";

function AppRoutes({ user, cart, handleLogout, handleLogin, setCart, addToCart }) {
  const location = useLocation();
  const showGlobalNavbar = !!user; // Show on all pages when authenticated
  return (
    <>
      {showGlobalNavbar && (
        <Navbar cartCount={cart.length} user={user} onLogout={handleLogout} />
      )}
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/" element={<Home />} />
        <Route 
          path="/menu" 
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <Menu />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cuisine/:id" 
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <Cuisine addToCart={addToCart} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <Cart cart={cart} setCart={setCart} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={!!user}>
              <UserDashboard user={user} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    // Log the logout activity
    if (user) {
      addActivity(user.id, "logout");
    }
    setUser(null);
    setCart([]);
  };

  return (
    <Router>
      <AppRoutes 
        user={user}
        cart={cart}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
        setCart={setCart}
        addToCart={addToCart}
      />
    </Router>
  );
}

export default App;
