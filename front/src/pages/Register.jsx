import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"

function Register() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [contact,setContact]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role,setRole]=useState("user");

  const navigate =useNavigate();
  

 const  handleRegister=async(e)=>{
    e.preventDefault();

    try{
      await axios.post("https://zyra-7ccl.onrender.com/register",
        {
          name,
          email,
          contact,password,role
        }
      )

      alert("Registered Successfully")
     navigate("/login")
    } catch (err) {
  console.error(err.response ? err.response.data : err.message);
  alert("Registration failed, please check the given details");
}
  }
  return (
   <div className=' d-flex flex-column min-vh-100 mt-5'>
    <div className='mt-5 '>
        <div className="container mt-5">
      <h2 className="text-center">Register</h2>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleRegister} className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input 
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='***'
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input 
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='@gmail.com'
                required 
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contact</label>
              <input 
                type="number"
                className="form-control"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder='xxxxx xxxxx'
                required 
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

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select 
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="user">user</option>
                <option value="seller">seller</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
             
          </form>
        </div>
      </div>
    </div>
    </div>
   </div>
  )
}

export default Register