import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from "react-router-dom"
import { API } from '../global'
import { jwtDecode } from "jwt-decode";

export function Login() {

    const navigate = useNavigate()
    const [pass, setPass] = useState(false)
    const [loading, setLoding] = useState(false)
    const [logindata, setLoginData] = useState({
        phone: "",
        password: ""
    })
    const handleChange = (e) => {
        setLoginData({
            ...logindata, [e.target.name]: e.target.value
        })
    }

    const setLogoutTimer = (token) => {
        if (!token) return;

        const decoded = jwtDecode(token);
        console.log(decoded)
        const expiresIn = decoded.exp * 1000 - Date.now();

        setTimeout(() => {
            alert("Session expired! Please log in again.");
            sessionStorage.removeItem("token");
            window.location.href = "/";
        }, expiresIn);
    };

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoding(true)
        try {
            const response = await axios.post(`${API}/user/login`, logindata)
            alert(response.data.message)
            sessionStorage.setItem("token", JSON.stringify(response.data.token))
            sessionStorage.setItem("user", JSON.stringify(response.data.user))
            const token = response.data.token
            setLogoutTimer(token)
            navigate("/gamelobby")
        } catch (error) {
            console.error('Error Logging In user:', error);
            alert('Invaild Credentials');
        }
        finally {
            setLoding(false)
        }
    }


    return (
        <div className="login">
            <div className="loginBox">
                <h2 className="loginTitle">LOGIN</h2>
                <form onSubmit={handleLogin} className="loginForm">
                    <input type="tel" name='phone' value={logindata.phone} onChange={handleChange} placeholder="Phone" required /><br />
                    <input type={pass ? "text" : "password"} name='password' value={logindata.password} onChange={handleChange} placeholder="Password" required /><br />
                    {pass ? <i className="fa fa-eye loginPassShow" onClick={() => setPass(!pass)} aria-hidden="true"></i> : <i className="fa fa-eye-slash loginPassShow" onClick={() => setPass(!pass)} aria-hidden="true"></i>}
                    <button type="submit" className="loginButton" disabled={loading}>{loading ? <div className="spinner"></div> : 'Login'}</button>
                    <div className="forgotPass">
                        <a href="" onClick={() => navigate("/forgotPass")} >Forgot Password</a>
                    </div>
                    <div className="signUp"><b>Don't have an account?</b><a href="" onClick={() => navigate("/register")} ><b>Sign Up</b></a></div>
                </form>
            </div>
        </div>
    )
}


