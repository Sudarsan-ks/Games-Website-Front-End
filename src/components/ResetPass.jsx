import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../global'

export function ResetPass() {

  const [resetdata, setResetData] = useState({
    email: "",
    otp: "",
    password: ""
  })
  const [pass, setPass] = useState(false)
  const [loading, setLoding] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setResetData({
      ...resetdata, [e.target.name]: e.target.value
    })
  }
  const handleReset = async (e) => {
    e.preventDefault()
    setLoding(true)
    try {
      const response = await axios.post(`${API}/user/resetPass`, { ...resetdata, newPass: resetdata.password })
      alert(response.data.message)
      navigate("/")
    } catch (error) {
      console.error('Error in Changing Password:', error);
      alert('OTP Expire click re-send OTP to Verify');
    }
    finally {
      setLoding(false)
    }
  }
  const handleResendOtp = async (e) => {
    e.preventDefault()
    const email = prompt("Please Enter the Register Email ID")
    try {
      const response = await axios.post(`${API}/user/resendOtp`, { email })
      alert(response.data.message)
    } catch (error) {
      console.error('Error in Re-sending OTP:', error);
      alert('Invaild Credential');
    }
  }

  return (
    <div className="reset">
      <div className="resetBox">
        <h2 className="resetTitle">RESET PASSWORD</h2>
        <form onSubmit={handleReset} className="resetForm">
          <input type="email" name='email' value={resetdata.email} onChange={handleChange} placeholder="Email" required /><br />
          <input type="otp" name='otp' value={resetdata.otp} onChange={handleChange} placeholder="Otp" required /><br />
          <input type={pass ? "text" : "password"} name='password' value={resetdata.password} onChange={handleChange} placeholder="Password" required /><br />
          {pass ? <i className="fa fa-eye resetPassShow" onClick={() => setPass(!pass)} aria-hidden="true"></i> : <i className="fa fa-eye-slash resetPassShow" onClick={() => setPass(!pass)} aria-hidden="true"></i>}
          <button type="submit" className="ResetPassButton">{loading ? "Changing" : "Reset"}</button>
          <div className="resendOtp">
            <a href="" onClick={handleResendOtp} >re-send OTP</a>
          </div>
        </form>
      </div>
    </div>
  )
}

