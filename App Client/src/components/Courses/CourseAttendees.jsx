import React, { useEffect , useState , useContext } from 'react'
import { Link } from "react-router-dom";
import "./Courses.css";
import axios from 'axios';
import RealTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'
import { UserContext } from '../../context/userContext'


TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


const CourseAttendees = ({courseID,
  thumbnail,
  category,
  title,
  description,
  creatorID,
  duration,
  createdAt,
  instructor
   }) => {

    const {currentUser} = useContext(UserContext)
    const [teacher , setTeacher] = useState({});
    useEffect(()=>{
      const getUser = async () => {

        try {
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${creatorID}`)
          setTeacher(response?.data);
        } catch (error) {
          console.log(error)
        }
      }
      getUser();
    },[])

    //if with the login the data stored was all user data it would be easier to make this app :)
    //check user login controller

    return (
      <>
        {currentUser.id === creatorID ? (
          <Link to={`/profile/${creatorID}`} className="course__author">
            <div className="course__author-avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${teacher?.avatar}`} alt="" />
            </div>
            <div className="courset__author-details">
              <h5>By: {instructor} </h5>
              <small><RealTimeAgo date={new Date(createdAt)} locale='en-US' /></small>
            </div>
          </Link>
        ) : (
          <div className="course__author">
            <div className="course__author-avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${teacher?.avatar}`} alt="" />
            </div>
            <div className="courset__author-details">
              <h5>By: {instructor} </h5>
              <small><RealTimeAgo date={new Date(createdAt)} locale='en-US' /></small>
            </div>
          </div>
        )}
      </>
    );
  };

export default CourseAttendees;
