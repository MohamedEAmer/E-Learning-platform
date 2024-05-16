import React, { useState , useContext, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import Loader from '../../components/Loader'
import { RiDeleteBin6Fill } from "react-icons/ri";

const DeleteCourse = ({courseID}) => {

  const [isLoading , setIsLoading]= useState(false)
  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
  }, [])

  const removeCourse = async ()=>{
    setIsLoading(true)
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/courses/${courseID}`,{withCredentials:true , headers: {Authorization: `Bearer ${token}`}})

      if(response.status === 200){
        const path = `/`
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
      <Link className='btn sm danger' onClick={()=>removeCourse(courseID)}><RiDeleteBin6Fill /></Link>
    </div>
  )
};

export default DeleteCourse;
