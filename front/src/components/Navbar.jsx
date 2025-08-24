import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ThemeContext } from "./ThemeContext"; 
import axios from "axios";
import "../pages/ThemeSwitch.css";

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role"); 
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext); 

  const [search, setSearch] = useState("");

  const handlelogout = () => {
    localStorage.clear();
    navigate('/');
  };

 
  
  return (
    <nav className={`navbar navbar-expand-lg ${darkMode ? 'navbar-dark bg-dark' : 'navbar-light bg-light'} fixed-top`}>
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/" style={{fontStyle:"italic",fontSize:"30px",color:"red"}}>Zyra</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        > 
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <div className="w-100 d-flex justify-content-center">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 fw-bold d-flex justify-content-center">
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/products">Products</Link></li>

              {token && role === "user" &&(
                <>
                  <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                  <li className='nav-item'><Link className='nav-link' to="/myorders">My Orders</Link></li>
                </>
              )}

              {token && role === 'admin' && (
                <li className="nav-item"><Link className="nav-link" to="/admin">Admin Dashboard</Link></li>
              )}

              {token && role === 'seller' && (
                <li className="nav-item"><Link className="nav-link" to="/seller">Seller Dashboard</Link></li>
              )}
            </ul>
          </div>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item me-3 mt-2">
              <label className="switch">
                <span className="sun"> ... </span>
                <span className="moon"> ... </span>   
                <input type="checkbox" className="input" checked={darkMode} onChange={toggleTheme}/>
                <span className="slider"></span>
              </label>
            </li>

            {!token ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <button className="btn btn-outline-primary">Login</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <button className="btn btn-outline-primary">Register</button>
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-outline-danger"
                  onClick={handlelogout}
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
