import React, { useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./RegisterLogin.css";
const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error , setError] = useState('');
  const navigate = useNavigate();

  const changeInputHandler=(e)=>{
    setUserData(prevState=>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }

  const registerUser = async (e)=>{

    e.preventDefault()
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
      const newUser = await response.data;

      if(!newUser){
        setError("Couldn't register user. Please try again.")
      }
      navigate('/login')
    } catch (error) {
        setError(error.response.data.message);
    }
  }

  return (
    <div className="background-image">
      <section className="register">
        <div className="form-container">
          <h2>Sign Up</h2>
          <form className="form register__form" onSubmit={registerUser}>
            {error && <p className="form__error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              name="name"
              value={userData.name}
              onChange={changeInputHandler}
              autoFocus
              required
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={changeInputHandler}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="password2"
              value={userData.password2}
              onChange={changeInputHandler}
              required
            />
            <button type="submit" className="btn primary">
              Register
            </button>
          </form>
          <small>
            Already have an account?<Link to="/login"> sign in</Link>
          </small>
        </div>
      </section>
    </div>
  );
};

export default Register;
