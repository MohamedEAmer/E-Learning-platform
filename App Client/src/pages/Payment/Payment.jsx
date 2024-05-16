import "./Payment.css";
import React, { useState,useEffect,useContext } from "react";
import { useNavigate , useParams} from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../context/userContext'

const Payment = () => {
  const [title, setTitle] = useState("");
  const [instructor, setInstructor] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiration, setExpiration] = useState("");
  const [cvv, setCVV] = useState("");
  const [ error , setError] = useState('');

  const {currentUser} = useContext(UserContext)
  const token = currentUser?.token;

  useEffect(()=>{
    if(!token){
      navigate('/Instructor_User')
    }
  }, [])

  const navigate = useNavigate();
  const {id} = useParams()

  useEffect(()=>{
    const getCourse =async () =>{
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/${id}`)
        setTitle(response.data.title)
        setInstructor(response.data.instructor)
        setPrice(response.data.price)
        setName(currentUser.name)
      } catch (err) {
        console.log(err)
      }
    }
    getCourse()
  },[])


  const buyCourseHandler = async (e)=>{
    e.preventDefault();

    const paymentData = new FormData();

    paymentData.set('title',title)
    paymentData.set('email',email)
    paymentData.set('instructor',instructor)
    paymentData.set('name',name)



    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/courses/${id}`, paymentData ,{withCredentials: true , headers: {Authorization:`Bearer ${token}`}})
      if(response.status == 200){
        const path = `/`
        return navigate(path)
      }
    } catch (err) {
      setError(err.response.data.message)
    }

  }






  return (
    <div className="payment-container">
      <h1>Payment Details</h1>
      {error && <p className='form__error-message'>{error}</p>}
      <form onSubmit={buyCourseHandler} >
        <div className="form-group">
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number:</label>
          <input
            type="text"
            id="cardNumber"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            pattern="[0-9]{16}"
            placeholder="16 digits"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="expiration">Expiration Date:</label>
          <input
            type="text"
            id="expiration"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
            placeholder="MM/YY"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV:</label>
          <input
            type="text"
            id="cvv"
            value={cvv}
            onChange={(e) => setCVV(e.target.value)}
            pattern="[0-9]{3}"
            placeholder="3 digits"
            required
          />
        </div>
        <div className="Course-data">
          <p>Course Name: </p>
          <label htmlFor="text">{title}</label>
          <p>Instructor Name: </p>
          <label htmlFor="text">{instructor}</label>
          <p>Price: </p>
          <label htmlFor="text">{price}</label>
        </div>

        <button className="btn primary" type="submit">
          Confirm Payment
        </button>
      </form>
    </div>
  );
};
export default Payment;