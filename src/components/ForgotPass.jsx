import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API } from '../global'

export function ForgotPass() {

  const [email, setEmail] = useState("")
  const [loading, setLoding] = useState(false)
  const navigate = useNavigate()

  const handleforgot = async (e) => {
    e.preventDefault()
    setLoding(true)
    try {
      const response = await axios.post(`${API}/user/forgotPass`, { email })
      alert(response.data.message)
      navigate("/resetPass")
    } catch (error) {
      console.error('Error Sending OTP to EMAIL:', error);
      alert('Invaild Email');
    }
    finally {
      setLoding(false)
    }
  }
  return (
    <div className="forgot">
      <div className="forgotBox">
        <h2 className="forgotTitle">FORGOT PASSWORD</h2>
        <form onSubmit={handleforgot} className="forgotForm">
          <input type="email" name='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Registered Email" required /><br />
          <button type="submit" className="forgotButton">{loading ? "Sending Email" : "Submit"}</button>
        </form>
      </div>
    </div>
  )
}


