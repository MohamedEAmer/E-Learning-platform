import React, { useState ,useEffect ,useContext} from "react";
import "./CourseContent.css";
import ReactPlayer from "react-player";
import { FaEdit } from "react-icons/fa";
import { Link , useParams ,useNavigate} from "react-router-dom";
import { RiFileAddLine } from "react-icons/ri";
import { IoPersonAdd } from "react-icons/io5";
import axios from 'axios'
import { UserContext } from '../../context/userContext'
import Loader from '../../components/Loader'
import DeleteSession from "../Session/DeleteSession";






const CourseContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail , setThumbnail] = useState('');
  const [intro, setIntor] = useState("");
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSession , setCurrentSession] = useState('')
  const {currentUser} = useContext(UserContext)
  const [user , setUser] = useState({})
  const [extension , setExtension] = useState('')
  const {id} = useParams()

  const navigate = useNavigate();
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
    //course contant is reachable for each of them but according to the courses rendered to each of them 
    // student has courses in which he is enrolled in 
    // instructor has courses which is created by him
  }, [])

  useEffect(()=>{
    const getUser = async () => {

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`)
        setUser(response?.data);
      } catch (error) {
        console.log(error)
      }
    }
    getUser();
  },[])

  useEffect(()=>{
    const getCourse =async () =>{
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/${id}`)
        setIntor(response.data.intro)
        setTitle(response.data.title)
        setDescription(response.data.description)
        setThumbnail(response.data.thumbnail)
      } catch (err) {
        console.log(err)
      }
    }
    getCourse()
  },[])

  const getSingleSessionHandler = async (id) => {

    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/sessions/${id}`)
      setCurrentSession(response?.data);
      setExtension(response?.data.mediadata.mimetype)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    const fetchSessions = async () => {
      setIsLoading(true)

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/sessions/course/${id}`)
        setSessions(response?.data)
      } catch (err) {
        console.log(err)          
      }

      setIsLoading(false)
    }
    fetchSessions();
  },[])

  if (isLoading){
    return <Loader/>
  }


  return (
    <>
      <div className="course-content">
      <section>

        {(['video/mp4', 'video/mkv', 'video/avi'].includes(extension)) && (
          <div className="content-container">
            <ReactPlayer
              controls={true}
              url={`${process.env.REACT_APP_ASSETS_URL}/uploads/${currentSession.media}`}
              className="video"
              muted={false}
            />
            <p className="content-intro" dangerouslySetInnerHTML={{__html:currentSession.data}}/>
          </div>
          )}

        {(['image/jpg', 'image/jpeg', 'image/png'].includes(extension)) && (
          <div className="content-container">
            <img className="content-video" src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${currentSession.media}`} alt='' />
            <p className="content-intro" dangerouslySetInnerHTML={{__html:currentSession.data}}/>
          </div>
        )}

        {(extension === 'pdf') && (
          <div className="content-container">
            <iframe title= 'pdf' src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${currentSession.media}`} />
            <p className="content-intro" dangerouslySetInnerHTML={{__html:currentSession.data}}/>
          </div>
        )}

        {!(['video/mp4', 'video/mkv', 'video/avi','image/jpg', 'image/jpeg', 'image/png','pdf'].includes(extension)) && 
        (
          <div className="content-container">
            <p className="content-title" dangerouslySetInnerHTML={{ __html: title }} />
            <p className="content-description" dangerouslySetInnerHTML={{ __html: description }} />
            <img className="content-video" src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt='' />
            <p className="content-intro" dangerouslySetInnerHTML={{ __html: intro }} />
          </div>
        )}
          
        
      </section>

        <div className="big-container">
        {user.accType ==='instructor'&&<div className="icon-container">
            <Link to={`/sessions/course/${id}/CreatSession`} className="btn sm primary">
              <RiFileAddLine />
            </Link>
            <Link to={"/invite"} className="btn sm primary">
              <IoPersonAdd />
            </Link>
          </div>}
          <section className="video-playlist">
            <h3 className="playlist-title">Sessions Playlist</h3>
            <ul className="playlist">
              {sessions.map((session, index) => (
                <li onClick={() => getSingleSessionHandler(session._id)}
                  key={session._id}
                >
                  <div className="video-info">
                    <h4 className="video-title">{session.name}</h4>
                    <p className="video-duration">{session.description}</p>
                  </div>
                  {currentUser.id === session.creator &&<div className="video-icon">
                    <DeleteSession sessionID={session._id} />
                    <Link to={`/sessions/course/${session._id}/editsession`} className="btn sm primary">
                      <FaEdit />
                    </Link>
                  </div>}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
};

export default CourseContent;
