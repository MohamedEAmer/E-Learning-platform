import React, {  useContext } from 'react'

import { useNavigate } from 'react-router-dom'

import {UserContext} from '../../context/userContext'


const Logout = () => {
  
  const navigate = useNavigate();

  const { setCurrentUser} = useContext(UserContext)

  setCurrentUser(null)
  navigate('/Instructor_User')


  return (
    <>  
    </>
  )
}

export default Logout
