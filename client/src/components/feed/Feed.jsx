import Share from "../share/Share"
import Post from "../post/Post"
import "./feed.css"
import axios from 'axios'
// import { Posts } from "../../dummyData"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/AuthContext"

export default function Feed({username}) {
  const [posts, setPosts] = useState([]);
  const {user} = useContext(AuthContext);
  const AU = process.env.REACT_APP_API_URL;

  useEffect(()=>{
    const fetchPosts = async ()=>{
      try {
        const url = username
        ? `${AU}posts/profile/${username}`
        : `${AU}posts/timeline/${user._id}`;
        
        // Fetch posts from the backend
        const res = await axios.get(url);
        // console.log(res)

      // Sort posts by creation date (latest first)
        const sortedPosts = res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        });
      // Update state with sorted posts
            setPosts(sortedPosts);
            
            // console.log(sortedPosts);
            } catch (err) {
              console.error('Failed to fetch posts', err);
            }
            };
    fetchPosts()
    // console.log(`${AU}posts/profile/${username}`);
    // console.log(posts); // Should be a string, e.g., "john_doe"

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
