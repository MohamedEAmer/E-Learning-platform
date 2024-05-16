import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from "react-router-dom";
import axios from 'axios'
import Loader from '../../components/Loader'


const CourseInfo = () => {
  const {id} = useParams()
  console.log(id)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail , setThumbnail] = useState('');
  const [intro, setIntor] = useState("");
  const [price, setPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(()=>{
    const getCourse =async () =>{
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/${id}`)
        console.log(response.data)
        setIntor(response.data.intro)
        setTitle(response.data.title)
        setDescription(response.data.description)
        setThumbnail(response.data.thumbnail)
        setPrice(response.data.price)
      } catch (err) {
        console.log(err)
      }
    }
    getCourse()
  },[])

  if (isLoading){
    return <Loader/>
  }



  return (
        <div className="content-container">
        <p className="content-title" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="content-description" dangerouslySetInnerHTML={{ __html: description }} />
        <img className="content-video" src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt='' />
        <p className="content-intro" dangerouslySetInnerHTML={{ __html: intro }} />
        <p className="content-intro" dangerouslySetInnerHTML={{ __html: `Course Price : ${price} $` }} />
        <Link className="btn buy " to={`/payment/${id}`}>
          <h3>Buy</h3>
        </Link>
        </div>
  );
};

export default CourseInfo;
