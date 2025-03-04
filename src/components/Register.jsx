import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { API } from '../global'


export function Register() {

  const [registerdata, setregisterData] = useState({
    email: "",
    phone: "",
    name: "",
    password: ""
  })
  const [pass, setPass] = useState(false)
  const [loading, setLoding] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setregisterData({
      ...registerdata, [e.target.name]: e.target.value
    })
  }
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoding(true)
    try {
      const response = await axios.post(`${API}/user/register`, registerdata)
      alert(response.data.message)
      navigate("/")
    } catch (error) {
      console.error('Error registering user:', error);
      alert('User Already Exist');
    }
    finally {
      setLoding(false)
    }
  }

  return (
    <div className="register">
      <div className="registerBox">
        <h2 className="registerTitle">REGISTER HERE</h2>
        <form onSubmit={handleRegister} className="registerForm">
          <input type="text" name='name' value={registerdata.name} onChange={handleChange} placeholder="Name" required /><br />
          <input type="email" name='email' value={registerdata.email} onChange={handleChange} placeholder="Email" required /><br />
          <input type="tel" name='phone' value={registerdata.phone} onChange={handleChange} placeholder="Phone" required /><br />
          <input type={pass ? "text" : "password"} name='password' value={registerdata.password} onChange={handleChange} placeholder="Password" required /><br />
          {pass ? <i className="fa fa-eye registerPassShow" onClick={() => setPass(!pass)} aria-hidden="true"></i> : <i className="fa fa-eye-slash registerPassShow" onClick={() => setPass(!pass)} aria-hidden="true"></i>}
          <button type="submit" className="registerButton" disabled={loading} >{loading ? <div className="spinner"></div> : 'Register'}</button>
          <div className="signIN">
            <a href="" onClick={() => navigate("/")} ><b>Sign in</b></a>
          </div>
        </form>
      </div>
    </div>
  )
}

