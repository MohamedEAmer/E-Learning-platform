import React, { useContext } from 'react'
import { Link } from "react-router-dom";
import CourseAttendees from "./CourseAttendees.jsx";
import "./Courses.css";
import { FaEdit } from "react-icons/fa";
import { UserContext } from '../../context/userContext'
import DeleteCourse from '../../pages/Course/DeleteCourse'


const CourseItem = ({courseID,
  thumbnail,
  category,
  title,
  description,
  creatorID,
  duration,
  createdAt,
  instructor,price,home }) => {


  const {currentUser} = useContext(UserContext)


  return (
    <article className="course">
      <div className="course__thumbnail">
        <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="course__content">

        {!home ?
        (<Link className="btn sm " to={`/sessions/course/${courseID}`}>
          <h3>{title}</h3>
        </Link>
        ) : (
        <h3>{title}</h3>
        )}

        <p dangerouslySetInnerHTML={{__html:description}}/>

        {currentUser?.accType === 'student' && home && (
        <div className="course__purchase">
          <h3>{price}$</h3>
        <Link className="btn buy " to={`/payment/${courseID}`}>
          <h3>Buy</h3>
        </Link>
        <Link className="btn buy " to={`/course/${courseID}/info`}>
          <h3>Info</h3>
        </Link>
        </div>
        )}

        {currentUser?.accType === 'instructor' && !home && (
        <div className="course__price">
          <h3>{price}$</h3>
        </div>
        )}

        <div className="course__footer">
          <p>Course Duration (Days) : {duration}</p>
          <p>Class : {category}</p>

          {currentUser.id === creatorID && (
            <div className="course__actions">
              <DeleteCourse courseID={courseID}/>
              <Link to={`/courses/${courseID}/edit`} className="btn sm primary">
                <FaEdit />
              </Link>
            </div>
          )}

          <CourseAttendees courseID={courseID}
              thumbnail={thumbnail}
              category={category}
              title={title}
              description={description}
              creatorID={creatorID}
              duration={duration}
              createdAt={createdAt}
              instructor={instructor} />
        </div>
      </div>
    </article>
  );
};

export default CourseItem;
