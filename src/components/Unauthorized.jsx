import React from 'react'
import unauthorImg from "../assets/unauthorised.jpg"

export function Unauthorized() {
  return (
    <div className='unauthorize' >
      <img src={unauthorImg} alt="UnAuthorized Page" />
    </div>
  )
}


