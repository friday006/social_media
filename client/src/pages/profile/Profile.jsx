import "./profile.css"
import Topbar from "../../components/topbar/Topbar"
import Feed from "../../components/feed/Feed"
import Rightbar from "../../components/rightbar/Rightbar"
import Sidebar from "../../components/sidebar/Sidebar"
import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "react-router-dom"

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const AU = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState({});
  const username = useParams().username;

  useEffect(()=>{
    const fetchUser = async ()=>{
      const res = await axios.get(`${AU}users?username=${username}`);
      setUser(res.data); 
    };
    fetchUser()
  },[username]);

  useEffect(() => {
    const imageUrl = `https://drive.google.com/uc?export=view&id=1k7FMNQBan3OrGEH7yqie-rxH0R_Ithm_`;
    console.log("Image URL:", imageUrl);
  }, []);
  
console.log(user.username)


  return (
    <>
    {/* <Topbar/> */}
    <div className="profile">
    {/* <Sidebar/> */}
    <div className="profileRight">
        <div className="profileRightTop">
            <div className="profileCover">
            <img
  src="https://via.placeholder.com/150"
  alt="Placeholder"
/>

                {/* <img className="profileUserImg" src={`https://drive.google.com/uc?id=1k7FMNQBan3OrGEH7yqie-rxH0R_Ithm_` }
          alt="Avatar" /> */}
            </div>
            <div className="profileInfo">
                <h4 className="profileInfoName">{user.username}</h4>
                <span className="profileInfoDesc">{user.desc}</span>
            </div>
        </div>
        <div className="profileRightBottom">
        {/* <Feed username={username}/>
        <Rightbar user={user} someProp={"testprop"}/> */}
        </div>
    </div>
    </div>
    </>
  )
}
