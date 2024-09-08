import Share from "../share/Share"
import Post from "../post/Post"
import "./feed.css"
import axios from 'axios'
// import { Posts } from "../../dummyData"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"

export default function Feed({username}) {
  const API_URL = process.env.REACT_APP_API_URL;
  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);

  useEffect(()=>{
    const fetchPosts = async ()=>{
      const res = username
      ? await axios.get(API_URL+'/posts/profile/'+ username)
      : await axios.get(API_URL+'/posts/timeline/'+ user._id)
      // console.log(res.data)
      setPosts(
        res.data.sort((p1,p2)=>{
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts()
  },[username, user._id]);

  return (
    <div className='feed'>
      <div className="feedWrapper">
          {(!username || username === user.username) &&  <Share/>}
          {posts.map((p)=> (
            <Post key={p._id} post={p}/>
          ))}
      </div>
    </div>
  )
}
