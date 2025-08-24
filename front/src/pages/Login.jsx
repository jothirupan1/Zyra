import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3004/login', {
        email,
        password
      });

      localStorage.setItem("token",res.data.token);
      localStorage.setItem("role",res.data.role);

      alert(res.data.message || 'Logged in successfully');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed, please check your details');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 mt-5 pt-4">
      <div className="container mt-5">
        <h2 className="text-center">Login</h2>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleLogin} className="card p-4 shadow-sm">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
             
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Must be at least 6 characters"
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <p style={{ color: 'red' }} className="mt-3">
                  Haven’t registered yet? Click here to register.
                </p>
              </Link>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
