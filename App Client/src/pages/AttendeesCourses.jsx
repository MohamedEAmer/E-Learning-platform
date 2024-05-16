import React from "react";
import { useState , useEffect , useContext } from 'react'
import CourseItem from "../components/Courses/CourseItem.jsx";
import Loader from '../components/Loader.jsx'
import { Link ,useNavigate } from "react-router-dom";
import axios from 'axios'
import { UserContext } from '../context/userContext'

import "./../components/Courses/Courses.css";
const AttendeesCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const home = false ;
  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
  }, [])


  useEffect(()=>{
    const fetchCourses = async () => {
      setIsLoading(true)

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/users/${currentUser.id}`)
        setCourses(response?.data)
      } catch (err) {
        console.log(err)          
      }

      setIsLoading(false)
    }
    fetchCourses();
  },[])

  if (isLoading){
    return <Loader/>
  }



  return (
    <section>
      {currentUser?.accType === 'instructor' &&<div className="course-header">
        <Link className="btn primary +" to={"/create"}>
        Create Course +
        </Link>
      </div>}
      {courses.length > 0 ? (
        <div className="courses__container">
          {courses.map((course) => (
            <CourseItem key={course._id}
              courseID={course._id}
              thumbnail={course.thumbnail}
              category={course.category}
              title={course.title}
              description={course.description}
              creatorID={course.creator}
              duration={course.duration}
              createdAt={course.createdAt}
              instructor={course.instructor}
              price={course.price}
              home = {home}
            />
          ))}
        </div>
      ) : (
        <>
          <h2 className="center">No courses Founded</h2>
        </>
      )}
    </section>
  );
};

export default AttendeesCourses;
