import { MoreVert } from "@mui/icons-material";
import "./post.css";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const AU = process.env.REACT_APP_API_URL;
  const { user: currentUser } = useContext(AuthContext);

  const likeHandler = async () => {
    try {
      await axios.put(`${AU}posts/${post._id}/like`, { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Error liking the post:", err);
    }
  };

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    if (currentUser._id === post.userId) {
      setUser(currentUser);
    } else {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`${AU}users?userId=${post.userId}`);
          setUser(res.data);
        } catch (err) {
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }
  }, [post.userId, AU, currentUser]);
  
  // console.log(user.profilePicture)
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={user.profilePicture ? PF + user.profilePicture : PF + 'person/noAvatar.png' }
                alt="Profile"
              />
            </Link>
            <span className="postUsername">{user.username}</span>
            <span className="postDate">{format(post.createdAt)}</span>
          </div>
          <div className="postTopRight">
            <MoreVert />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post.desc}</span>
          {post.img && <img className="postImg" src={post.img ? PF + post.img : PF + 'person/noCover.png'} alt="Post" />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={PF + `fa5inhbxmiymwurygmo0.png`} // like.png name changes in cloudinary
              alt="Like"
              onClick={likeHandler}
            />
            <img
              className="likeIcon"
              src={`${PF}hpm8mjdnggslhuh28whb.png`} // hear.png changed
              alt="Heart"
              onClick={likeHandler}
            />
            <span className="postLikeCounter">{like} people like it</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} comments</span>
          </div>
        </div>
      </div>
    </div>
  );
}
