import { useState , useEffect , useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import CourseItem from "../components/Courses/CourseItem";
import Loader from '../components/Loader'
import { UserContext } from '../context/userContext'
const Home = () => {

  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const home = true;
  const navigate = useNavigate();


  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
  }, [])


  useEffect(()=>{
    const fetchAllCourses = async () => {
      setIsLoading(true)

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/`)
        setCourses(response?.data)
      } catch (err) {
        console.log(err)          
      }

      setIsLoading(false)
    }
    fetchAllCourses();
  },[])


  if (isLoading){
    return <Loader/>
  }

  return (
    <div>
      {courses.length > 0 && currentUser?.accType === 'student'? (
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
              home ={home}
            />
          ))}
        </div>
      ) : (
        <div className="home">
          <h2>Welcome Back</h2>
          {currentUser?.id &&<h3>{currentUser.name}</h3>}
        </div>
      )}
    </div>
  );
};

export default Home;
