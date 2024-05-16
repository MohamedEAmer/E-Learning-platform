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
      <section className="main-video">
        {(['video/mp4', 'video/mkv', 'video/avi'].includes(extension)) && (<ReactPlayer
            controls={true}
            url={`${process.env.REACT_APP_ASSETS_URL}/uploads/${currentSession.media}`}
            className="video"
            muted={false}
            width="700px"
            height="500px"
          />)}
          {(['image/jpg', 'image/jpeg', 'image/png'].includes(extension)) &&(<img className="video" src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${currentSession.media}`} alt='' style={{ width: '700px', height: '500px' }} />)}
          {(extension === 'pdf') && (<iframe title= 'pdf'className="video" src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${currentSession.media}`} style={{ width: '700px', height: '500px' }}/>)}
          {!(['video/mp4', 'video/mkv', 'video/avi','image/jpg', 'image/jpeg', 'image/png','pdf'].includes(extension)) && (
            <p>Please Select a Session</p>
          )}
          <p className="main-video-title" dangerouslySetInnerHTML={{__html:currentSession.data}}/>
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
                    {/* <p>{session.name}</p> */}
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
