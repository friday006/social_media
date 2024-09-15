import { useContext, useRef } from "react"
import "./login.css"
import { AuthContext } from "../../context/AuthContext";
import { loginCall } from "../../apiCalls";
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const email = useRef();
    const password = useRef();
    const { user,isFetching, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClick = (e) => {
      e.preventDefault();
      loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
    };
  
    if (user) {
      // If the user is already logged in, redirect them to the profile page
      navigate("/profile");
    }
  return (
    <div className="login">
        <div className="loginWrapper">
            <div className="loginRight">
                <h3 className="loginLogo">SocialNode</h3>
                <span className="loginDesc">
                    Connect with your friends and world around you with Social Node.
                </span>
            </div>
            <div className="loginLeft">
                <form className="loginBox" onSubmit={handleClick} >
                    <input placeholder="Email" type="email" ref={email} required className="loginInput"/>
                    <input placeholder="Password" type="password" minLength={6} required ref={password} className="loginInput"/>
                    <button className="loginButton" disabled={isFetching}>
                      {isFetching ? <CircularProgress  style={{'color': 'white', 'size':'20px'}}/> : "Log In"}
                      </button>
                    <span className="loginForgot">Forgot Password?</span>
                    <button className="loginRegisterButton" onClick={()=>{navigate("/register")}}>
                    {isFetching ? <CircularProgress  style={{'color': 'white', 'size':'20px'}}/> : "Create a New Account"}
                      </button>
                </form>
            </div>
        </div>
    </div>
  )
}
