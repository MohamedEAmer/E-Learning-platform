import React, { useState , useContext } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'

import { UserContext } from '../../context/userContext'
import "./RegisterLogin.css";
const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const [error , setError] = useState('');
  const navigate = useNavigate();

  const {setCurrentUser} = useContext(UserContext)

  const changeInputHandler=(e)=>{
    setUserData(prevState=>{
      return {...prevState,[e.target.name]:e.target.value}
    })
  }

  const loginUser = async (e)=>{
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/login`, userData);
      const user = await response.data;
      setCurrentUser(user)
      navigate('/')
    } catch (error) {
      setError(error.response.data.message);
    }
  }

  return (
    <div className="background-image">
      <section className="login">
        <div className="form-container">
          <h2>Sign In</h2>
          <form className="formlogin__form" onSubmit={loginUser}>
            { error && <p className="form__error-message">{error}</p>}
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={changeInputHandler}
              required
              className="Email"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={userData.password}
              onChange={changeInputHandler}
              required
              className="password"
            />
            <button type="submit" className="btn primary lo">
              Login
            </button>
          </form>
          <small>
            You Don't have an account?<Link to="/register"> Register</Link>
          </small>
        </div>
      </section>
    </div>
  );
};

export default Login;
