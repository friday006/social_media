import { EmojiEmotions, Label, PermMedia, Room, Cancel } from "@mui/icons-material"
import "./share.css"
import { useContext, useRef, useState } from "react";
import {AuthContext} from "../../context/AuthContext"
import axios from "axios"
// import { Cancel } from "@mui/icons-material";

export default function Share() {

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const API_URL = process.env.REACT_APP_API_URL;
  const {user} = useContext(AuthContext)
  const desc = useRef();
  const [file, setFile] = useState(null)

  const submitHandler = async (e)=>{
    e.preventDefault()
    const newPost = {
        userId: user._id,
        desc: desc.current.value
    }
    if(file){
        const data = new FormData();
        const fileName = Date.now() + file.name; // Use `file.name` instead of `file.fileName`
        data.append("name", fileName); // This is crucial to ensure the `name` field is sent
        data.append("file", file);
        newPost.img = fileName;
        try {
            const uploadResponse = await axios.post(API_URL+"/upload", data);
            console.log("Upload response:", uploadResponse.data);
        } catch (error) {
            console.log("Upload error:", error);
        }
    }
    try {
        const savedPost = await axios.post(API_URL+"/posts", newPost);
        console.log("Post saved with image:", savedPost.data.img);
        window.location.reload();
    } catch (err) {
        console.log("Post save error:", err);
    }
    
  }

  return (
    <div className="share">
        <div className="shareWrapper">
            <div className="shareTop">
                <img className="shareProfileImg" src={user.profilePicture ? PF + user.profilePicture :  PF + "person/noAvatar.png"} alt=""/>
                <input className="shareInput" 
                ref={desc}
                placeholder={"What's in your mind "+ user.username + " ?"}/>
            </div>
            <hr className="shareHr"/>

            {file && (
                <div className="shareImageContainer">
                    <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
                    <Cancel className="shareCancelImg" onClick={()=>{setFile(null)}}/>
                </div>
            )}

            <form className="shareBottom" onSubmit={submitHandler}>
                <div className="shareOptions">
                    <label htmlFor="file" className="shareOption">
                        <PermMedia htmlColor="tomato" className="shareIcon"/>
                        <span className="shareOptionText">Photo or Video</span>
                        <input style={{display:"none"}} type="file" id="file" accept=".png, .jpeg, .jpg" onChange={e=>{setFile(e.target.files[0])}}/>
                    </label>
                    <div className="shareOption">
                        <Label htmlColor="blue" className="shareIcon"/>
                        <span className="shareOptionText">Tag</span>
                    </div>
                    <div className="shareOption">
                        <Room htmlColor="green" className="shareIcon"/>
                        <span className="shareOptionText">Location</span>
                    </div>
                    <div className="shareOption">
                        <EmojiEmotions htmlColor="goldenrod" className="shareIcon"/>
                        <span className="shareOptionText">Feelings</span>
                    </div>
                </div>
                <button className="shareButton" type="submit">Share</button>
            </form>
        </div>
    </div>
  )
}
