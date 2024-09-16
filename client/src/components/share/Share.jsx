import { EmojiEmotions, Label, PermMedia, Room, Cancel } from "@mui/icons-material";
import "./share.css";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Share() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const AU = process.env.REACT_APP_API_URL;
// console.log("PF:",PF)
  const { user } = useContext(AuthContext);
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();

    const newPost = {
      userId: user._id,
      desc: desc.current.value,
    };

    const data = new FormData();
    if (file) {
      const fileName = Date.now() + file.name;
      data.append("file", file);
      newPost.img = fileName;
    }

    // Add all post data to FormData
    data.append("userId", user._id);
    data.append("desc", desc.current.value);
    if (file) {
      data.append("img", newPost.img);
    }

    try {
      // Send the data (including file) to /posts
      await axios.post(`${AU}posts/upload`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    //   console.log("Post saved:", response.data);
      window.location.reload();
    } catch (err) {
      console.error("Post save error:", err);
    }
  };
//  console.log(user)
  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img className="shareProfileImg" 
          src={PF + user.profilePicture || PF + "person/noAvatar.png"} alt="" />
          <input className="shareInput"
            ref={desc}
            placeholder={"What's in your mind " + user.username + "?"}
          />
        </div>
        <hr className="shareHr" />

        {file && (
          <div className="shareImageContainer">
            <img src={URL.createObjectURL(file)} alt="" className="shareImg" />
            <Cancel className="shareCancelImg" onClick={() => { setFile(null) }} />
          </div>
        )}

        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="shareFileInput" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo or Video</span>
              <input style={{ display: "none" }} type="file" id="shareFileInput" accept=".png, .jpeg, .jpg" onChange={e => { setFile(e.target.files[0]) }} />
            </label>
            <div className="shareOption">
              <Label htmlColor="blue" className="shareIcon" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="shareOption">
              <Room htmlColor="green" className="shareIcon" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button className="shareButton" type="submit">Share</button>
        </form>
      </div>
    </div>
  );
}
