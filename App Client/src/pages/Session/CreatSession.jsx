import React, { useState , useContext, useEffect } from 'react'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from 'axios'
import { useNavigate ,useParams } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import "./Session.css";
const CreatSession = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [data, setData] = useState("");
  const [media , setMedia] = useState('');

  const [ error , setError] = useState('');

  const navigate = useNavigate();
  const {id} = useParams()

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


  const createSession = async (e)=>{
    e.preventDefault();

    const sessionData = new FormData();

    sessionData.set('name',name)
    sessionData.set('data',data)
    sessionData.set('description',description)
    sessionData.set('media',media)

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/sessions/course/${id}` , sessionData , {withCredentials: true , headers: {Authorization:`Bearer ${token}`}})
      if(response.status == 201){
        const path = `/sessions/course/${id}`
        return navigate(path)
      }
    } catch (err) {
      setError(err.response.data.message)
    }

  }


  return (
    <div className="create-session">
      {error && <p className='form__error-message'>{error}</p>}
      <form className="container-session" onSubmit={createSession}>
        <h2>New Session</h2>
        <div className="form create-course__form">
          <h4>Session Name</h4>
          <input
            type="text"
            placeholder="Session Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            className="session-name"
            required
          />
          <h4>Description</h4>
          <input
            type="text"
            placeholder="Session Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoFocus
            className="session-name"
            required
          />
          <h4>Data</h4>
          <ReactQuill
            className="react-quill"
            modules={modules}
            formats={formats}
            value={data}
            onChange={setData}
            placeholder="Session Descreption"
            required
          />
          <div className="upload-Media">
            <label>Upload Session Media: </label>
            <input type="file" onChange={e => setMedia(e.target.files[0])} accept=".png, .jpg, .jpeg, .pdf, .mp4, .mkv, .avi" />
            {/* no loading animation added or logic because it uploads and call from uploads file in backend folder  */}
          </div>
          <button type="submit" className="btn primary">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatSession;
