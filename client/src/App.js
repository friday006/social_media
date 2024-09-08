import React from 'react';
import Home from "./pages/home/Home";
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Profile from "./pages/profile/Profile"
import {AuthContext} from "./context/AuthContext"
import {useContext} from "react"

import {BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

function App (){
   const {user} = useContext(AuthContext);
 return (
    <Router>
        <Routes>
            <Route exact path="/"
               element= 
               {<Home/>}/>
            <Route path="/login"
               element= 
               {<Login/>}/>
            <Route exact path="/register"
               element= {user ? <Navigate to="/"/> : <Register/>}/>
            <Route exact path="/profile/:username"
               element= {<Profile/>}/>
        </Routes>
    </Router>
 );
}
export default App;
