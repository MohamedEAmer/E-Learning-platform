import React, { useState , useContext, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import Loader from '../../components/Loader'
import { RiDeleteBin6Fill } from "react-icons/ri";

const DeleteSession = ({sessionID }) => {

  const [isLoading , setIsLoading]= useState(false)
  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
  }, [])

  const removeSession = async ()=>{
    setIsLoading(true)
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/sessions/${sessionID}`,{withCredentials:true , headers: {Authorization: `Bearer ${token}`}})

      if(response.status === 200){
        const path = `/courses/users/${currentUser.id}`
          navigate(path)
      }
      setIsLoading(false)
    } catch (error) {
      
    }
  }


  if (isLoading){
    return <Loader/>
  }

  return (
    <div>
      <Link className='btn sm danger' onClick={()=>removeSession(sessionID)}><RiDeleteBin6Fill /></Link>
    </div>
  )
};

export default DeleteSession;
