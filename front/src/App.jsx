import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoutes from './components/ProtectedRoutes';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import AdminOrders from "./pages/AdminOrders";
import ProductDetail from './pages/Productdetail';
import SellerDashboard from './pages/SellerDashboard';
import Product from './pages/Product';
import Order from './pages/Order';
import Myorders from './pages/Myorders';
import ProductByCategory from './pages/ProductByCategory';

import { ThemeContext } from './components/ThemeContext';

function App() {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? 'bg-dark text-light min-vh-100' : 'bg-light text-dark min-vh-100'}>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Product />} />

        <Route element={<ProtectedRoutes allowedRoles={["user", "admin", "seller"]} />}>
          <Route path='/productdetails/:id' element={<ProductDetail/>}/>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />     
          <Route path="/orders/:id" element={<Order />} />
          <Route path="/myorders" element={<Myorders/>}/>
          <Route path="/products/category/:category" element={<ProductByCategory />}/>
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["seller"]}/>}>
          <Route path='/seller' element={<SellerDashboard />}/>
        </Route>

        <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminOrders />} />
        </Route>
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
