import "./InviteUser.css";
import React, { useState , useEffect , useContext  } from 'react'
import {  useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../context/userContext'
import Loader from '../../components/Loader'


const InviteUser = () => {

  const [userData, setUserData] = useState({
    userEmail: "",
    name: "",
    course:""
  });


  const [message , setMessage] = useState('');
  const [error , setError] = useState('');
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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
        const coursesData = response?.data;
        const titles = coursesData.map(course => course.title);
        setCourses(titles)
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

  const changeInputHandler=(e)=>{
    setUserData(prevState=>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }


const handleStudentAccount = async (e) =>{
  e.preventDefault();
  setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/invite`, userData ,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}});
      const data = await response.data;
      data.message = 'Student invited successfully'
      setMessage(data.message)
      setError('')
      navigate('/invite')
    } catch (error) {
      setError(error.response.data.message);
      setMessage('')
    }
  }

  return (
    <div className="container">
      <div className="invite-box">
        <h1>Invite User</h1>
        <form className="invite-bar" onSubmit={handleStudentAccount}>
          { !message &&error && <p className="form__error-message">{error}</p>}
          { !error && message && <p className="form__success-message">{message}</p>}
          <input
            type="email"
            name="userEmail"
            placeholder="Enter Student Email"
            value={userData.userEmail}
            onChange={changeInputHandler}
            className="enter-email"
          />
          <input
              type="text"
              name="name"
              placeholder="Enter User Name"
              value={userData.name}
              onChange={changeInputHandler}
              className="enter-name"
            />
            <select
              value={userData.course}
              name="course"
              className="select-course"
              onChange={changeInputHandler}
            >
              <option value="">Select Course</option>
              {courses.map((courseName, index) => (
                <option key={index} value={courseName}>
                  {courseName}
                </option>
              ))}
            </select>
          <button type="submit" className="btn primary" >
            Invite
          </button>
        </form>
      </div>
    </div>
  );
};

export default InviteUser;
