import React, { useState , useContext , useEffect } from 'react'
import { FaCheck, FaEdit } from 'react-icons/fa'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../context/userContext'
import "./UserProfile.css";
const UserProfile = () => {
  const [avatar,setAvatar]=useState('');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [currentPassword,setcurrentPassword]=useState('');
  const [newPassword,setNewPassword]=useState('');
  const [confirmNewPassword,setConfirmNewPassword]=useState('');
  const [isAvatarTouched,setIsAvatarTouched]=useState(false);
  const [error,setError]=useState('');


  const navigate = useNavigate()
  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
  }, [])

  useEffect(()=>{
    const getUser = async () => {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
      {withCredentials: true , headers:{Authorization: `Bearer ${token}`}})
      const {name , email , avatar} = response.data;
      setName(name)
      setEmail(email)
      setAvatar(avatar)
    }
    getUser()
  }, [])


  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar)
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData ,
      {withCredentials: true , headers: {Authorization: `Bearer ${token}`}})
      setAvatar(response?.data.avatar)
    } catch (err) {
      console.log(err)
    }
  }



  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const userData = new FormData();
      userData.set('name' , name);
      userData.set('email' , email);
      userData.set('currentPassword' , currentPassword);
      userData.set('newPassword' , newPassword);
      userData.set('confirmNewPassword' , confirmNewPassword);

      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData , {withCredentials: true , headers:{Authorization: `Bearer ${token}`}})
      if(response.status === 200){
        navigate('/logout')
      }
    } catch (error) {
      setError(error.response.data.message)
    }
  }

  return (
    <div className="background-image">
      <section className="profile">
        <div className="container profile__container">
          <Link to={`/courses/users/${currentUser.id}`} className="btn user">
            My Courses
          </Link>
          <div className="profile__details">
            <div className="avatar__wrapper">
              <div className="profile__avatar">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="" />
              </div>
              {/*Form to update avatar*/}
              <form className="avatar__form">
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  accept="png,jpg,jpeg"
                />
                <label htmlFor="avatar" onClick={()=> setIsAvatarTouched(true)}>
                  <FaEdit className="edit" />
                </label>
              </form>
              {isAvatarTouched && <button className='profile__avatar-btn' onClick={changeAvatarHandler}><FaCheck/></button>}
            </div>
            <h1>{currentUser.name}</h1>
            {/*update user details*/}
            <form className="form profile__form" onSubmit={updateUserDetails}>
              {error && <p className="form__error-message">{error}</p>}
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="full-name"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setcurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Pasword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <button type="submit" className="btn primary">
                Update Details
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserProfile;
