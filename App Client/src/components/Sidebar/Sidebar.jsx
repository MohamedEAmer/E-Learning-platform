import React, { useState ,useContext , useEffect} from "react";
import { FaBook } from "react-icons/fa";
import {  Link } from "react-router-dom";
import Logo from "../../images/storkyLogo.png";
import { IoSettingsOutline } from "react-icons/io5";
import { UserContext } from '../../context/userContext'
import axios from 'axios'

import {
  MdOutlineDashboard,
  MdLogout,
  MdOutlinePeopleOutline,
} from "react-icons/md";
import "./Sidebar.css";
const Sidebar = ({ children }) => {
  const [user , setUser] = useState({})
  const {currentUser} = useContext(UserContext)

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

  return (
    <>
      { currentUser?.id &&<sidebar className="sidebar">
        <div>
          <Link to="/">
            <img src={Logo} alt="Navbar Logo" className="img" />
          </Link>
        </div>

         <div  className="links">
          <Link to= '/' className='link'> <MdOutlineDashboard className="icon" /> </Link>
          <Link to= {`/courses/users/${currentUser.id}`} className='link'> <FaBook className="icon" /> </Link>
          <Link to= {`/profile/${currentUser.id}`} className='link'> <IoSettingsOutline className="icon" /> </Link>
          {user.accType ==='instructor'&&<Link to= '/invite' className='link'> <MdOutlinePeopleOutline className="icon" /> </Link>}
          <Link to= '/logout' className='link'> <MdLogout className="icon" /> </Link>
          
        </div>
      </sidebar>}
      <main className="main">{children}</main>
    </>
  );
};

export default Sidebar;
