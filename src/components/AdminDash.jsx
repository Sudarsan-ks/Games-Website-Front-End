import axios from 'axios'
import React, { useEffect} from 'react'
import { API } from '../global'
import { userdata, editdata } from '../Redux/slice'
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'

export function AdminDash() {
    const token = JSON.parse(sessionStorage.getItem("token") || null)
    const dispatch = useDispatch()
    const userDetails = useSelector((state) => state.game.user) || null
    const navigate = useNavigate()

    useEffect(() => {
        const getUserDetails = async () => {
            if (!token) {
                alert("Please Logout and try again");
                return;
            }
            try {
                const response = await axios.get(`${API}/user/userDetails`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                dispatch(userdata(response.data.user))
            } catch (error) {
                console.error("Error in getting Admin details", error)
            }
        }
        getUserDetails()
    }, [])

    const handleMake = async (data) => {
        const userID = data._id
        const Key = prompt("Please Provide a Access Key")
        const adminAcessKey = Key.trim()
        const AdminKEY = import.meta.env.VITE_ADMIN_KEY
        if (adminAcessKey === AdminKEY) {
            try {
                const response = await axios.put(`${API}/user/makeAnAdmin/${userID}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.user) {
                    dispatch(editdata({ ...data, isAdmin: true }))
                }
            } catch (error) {
                console.error("Error in Making an Admin", error)
            }
        }
        else {
            alert("Please Provide Key to Make to Change")
        }
    }

    const handleRemove = async (data) => {
        const userID = data._id
        const Key = prompt("Please Provide a Access Key")
        const adminAcessKey = Key.trim()
        const AdminKEY = import.meta.env.VITE_ADMIN_KEY
        if (adminAcessKey === AdminKEY) {
            try {
                const response = await axios.put(`${API}/user/removeAdmin/${userID}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                if (response.data.user) {
                    dispatch(editdata({ ...data, isAdmin: false }))
                }
            } catch (error) {
                console.error("Error in Removing an Admin", error)
            }
        }
        else {
            alert("Please Provide Key to Make to Change")
        }
    }

    return (
        <div className="AdminDash">
            <div className="makeAnAdmin">
                {userDetails.length > 0 ? (
                    userDetails.map((res) => (
                        <div className="userdata" key={res._id}>
                            <p><b>{res?.name || "No Name"}</b><span>- <b> {res?.isAdmin ? "ADMIN" : "NOT AN ADMIN"}</b></span></p>
                            {
                                res?.isAdmin ? (<button className='removebtn' onClick={() => handleRemove(res)} >Remove</button>) : (<button className='makebtn' onClick={() => handleMake(res)} >Make AN ADMIN</button>)
                            }
                        </div>
                    ))
                ) : (
                    <p>No Data Available</p>
                )}
            </div>
            <div className="backBtn">
                <button onClick={() => navigate("/gamelobby")} > <i className="fa fa-arrow-left" aria-hidden="true"></i> Back</button>
            </div>
        </div>
    )
}


