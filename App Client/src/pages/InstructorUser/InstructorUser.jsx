import React, { useState } from "react";
import "./InstructorUser.css";
import Avatar3Image from "../../images/instructor.png";
import Avatar1Image from "../../images/student.png";
import logoImage from "../../images/storkyLogo.png";
import { Link } from "react-router-dom";

const InstructorUser = () => {
  const [avatar3, setAvatar3] = useState(Avatar3Image);
  const [avatar1, setAvatar1] = useState(Avatar1Image);
  const [logo, setlogo] = useState(logoImage);

  return (
    <div className="background-image">
      <div>
        <div className="container-users">
          <header className="logo-u">
            <img src={logo} alt="" />
          </header>
          <div className="paragraph1">
            <h1>Welcome to Storky App</h1>
            <p>Create a new account</p>
          </div>
          <div className="center-page-u">
            <div className="avatar3">
              <Link to={"/register"}>
                <img src={avatar3} alt="" />
              </Link>
              <p>Instructor</p>
            </div>
            <div className="avatar1">
              <Link to={"/UserMessage"}>
                <img src={avatar1} alt="" />
              </Link>
              <p>Attendee</p>
            </div>
          </div>
        </div>
        <footer>
          <p className="footer">
            Already have an account? <a href="/login">Login</a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default InstructorUser;
