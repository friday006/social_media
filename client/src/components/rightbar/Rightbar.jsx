import "./rightbar.css";
// import { Users } from "../../dummyData";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from '@mui/icons-material';


export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  
  const [friends, setFriends] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // State for all users
  const {user: currentUser, dispatch} = useContext(AuthContext)
  const [followed, setFollowed] = useState(currentUser.followings.includes(user?.id));
  
  const AU = process.env.REACT_APP_API_URL;
  useEffect(() => {
    if (user && user._id) {
      const getFriends = async () => {
        try {
          const friendList = await axios.get(`${AU}users/friends/${user._id}`);
          setFriends(friendList.data);
        } catch (error) {
          console.log("Error fetching friends:", error);
        }
      };
      getFriends();
    }
  }, [user, AU]);

// Fetch all users for the home page
useEffect(() => {
  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${AU}users/all`);
      const sortedUsers = res.data.sort((a, b) => a.username.localeCompare(b.username)); // Sort users by name
        setAllUsers(sortedUsers); // Set the sorted users
    } catch (error) {
      console.log("Error fetching all users:", error);
    }
  };
  fetchAllUsers();
}, [AU]);

  const handleClick = async ()=>{
    try {
      if(followed){
        await axios.put(AU + "users/"+user._id+ "/unfollow", {userId: currentUser._id})
        dispatch({type:"UNFOLLOW", payload: user._id})
      }
      else{
        await axios.put(AU + "users/"+user._id+ "/follow", {userId: currentUser._id})
        dispatch({type:"FOLLOW", payload: user._id})
      }
    } catch (error) {
      console.log(error)
    }
    setFollowed(!followed)
  }
  
  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have birthdays today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
        {allUsers.map((u) => (
            <Online key={u._id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  // If user exists, this is the Profile Rightbar content
  const ProfileRightbar = () => {
    return (
      <>
       {user.username !== currentUser.username && (
        <button className="rightbarFollowButton" onClick={handleClick}>
          {followed ? "Unfollow" : "Follow"}
          {followed ? <Remove/> : <Add/>}
        </button>
      )}
        <h4 className="rightbarTitle">User Information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1 ? "Single" : user.relationship === 0 ? "Married" : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User Friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link to={"/profile/"+friend.username} style={{textDecoration: "none"}} key={friend._id}>
            <div className="rightbarFollowing" >
              <img
                src={PF + friend.profilePicture || PF + "person/noAvatar.png"}
                alt=""
                className="rightbarFollowingImg"
              />
              <span className="rightbarFollowingName">{friend.username}</span>
            </div>
            </Link>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {/* Render HomeRightbar if no user prop is passed, else render ProfileRightbar */}
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
