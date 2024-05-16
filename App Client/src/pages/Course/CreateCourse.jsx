import React, { useState , useContext, useEffect } from 'react'
import ReactQuill from "react-quill";
import { UserContext } from '../../context/userContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import "react-quill/dist/quill.snow.css";
import "./Course.css";


const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [intro, setIntor] = useState("");
  const [duration, setDuration] = useState(0);
  const [price, setPrice] = useState(0);
  const [category , setCategory] = useState('');
  const [thumbnail , setThumbnail] = useState('');

  const [ error , setError] = useState('');


  const courseLabels = ["Math","English","Science","History","Arabic","Geography","French","Arts"];//new

  const navigate = useNavigate();

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
  }, [])



  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "indent",
    "link",
    "image",
    "bullet",
  ];



  const createCourse = async (e)=>{
    e.preventDefault();

    const courseData = new FormData();

    courseData.set('title',title)
    courseData.set('category',category)
    courseData.set('duration',duration)
    courseData.set('price',price)
    courseData.set('description',description)
    courseData.set('intro',intro)
    courseData.set('thumbnail',thumbnail)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/courses` , courseData , {withCredentials: true , headers: {Authorization:`Bearer ${token}`}})
      if(response.status == 201){
        const path = `/courses/users/${currentUser.id}`
        return navigate(path)
      }
    } catch (err) {
      setError(err.response.data.message)
    }

  }




  return (
    <div className="create-course">
      <h2>Create Course</h2>
      {error && <p className='form__error-message'>{error}</p>}
      <form className="form create-course__form" onSubmit={createCourse}>
        <label>course Name:</label>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        <label>Course Descrption:</label>
        <input
          type="text"
          placeholder="Descrption"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label>Course Introduction:</label>
        <ReactQuill
          modules={modules}
          formats={formats}
          value={intro}
          onChange={setIntor}
        />

        <div className="inline-label">
          <label>
            Course Duration (In Days):
            <input
              type="number"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            />
          </label>
          <label>
            Course Price:
            <input
              type="number"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
          </label>
        </div>
        <br />
        <div className="form-group">
          <label>Select Course Label (Category):</label>
          <select
            className="end-page"
            value={category}
            onChange={e=> setCategory(e.target.value)}
          >
            {courseLabels.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div className="upload-photo">
          <label>Upload Photo:</label>
          <input type='file' onChange={e =>setThumbnail(e.target.files[0])} accept='png,jpg,gpeg' />
        
        <br />
        <button type="submit" className="btn-submite">
          Create
        </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;
