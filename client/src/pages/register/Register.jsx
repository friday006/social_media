import axios from "axios";
import "./register.css";
import { useRef, useState } from "react";
import { useNavigate} from "react-router-dom";

export default function Register() {
  const email = useRef();
  const username = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const navigate = useNavigate();
  const [error, setError] = useState('');


  const handleClick = async (e) => {
    e.preventDefault();
    if(password.current.value !== passwordAgain.current.value){
        passwordAgain.current.setCustomValidity("Password didn't match!")
    }
    else{
        const user={
            username: username.current.value,
            email: email.current.value,
            password: password.current.value
        }
        try{
            await axios.post("https://social-backend.netlify.app/api/auth/register", user);
            navigate("/login");
        }
        catch(err){
          if (err.response && err.response.status === 400) {
            if (err.response.data.message === 'Username already exists') {
              username.current.setCustomValidity('Username already exists!');
            } else {
              setError('An unexpected error occurred');
            }
          } else {
            setError('An unexpected error occurred');
          }
        }
    }
  };

  const loginFun = ()=>{
    navigate("/login")
  };
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginRight">
          <h3 className="loginLogo">LamaSocial</h3>
          <span className="loginDesc">
            Connect with your friends and world around you with LamaSocial.
          </span>
        </div>
        <div className="loginLeft">
        {error && <div className="error-popup">{error}</div>}
          <form className="loginBox" onSubmit={handleClick}>
            <input
              placeholder="User Name"
              required
              ref={username}
              className="loginInput"
            />
            <input 
                placeholder="Email"
                required
                ref={email}
                className="loginInput" />
            <input 
                placeholder="Password" 
                required
                ref={password}
                type="password"
                minLength="6"
                className="loginInput" />
            <input 
                placeholder="Password Again" 
                required
                ref={passwordAgain}
                type="password"
                className="loginInput" />
            <button className="loginButton" type="submit">Sign Up</button>
            <button className="loginRegisterButton" onClick={loginFun}>Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}
