import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import Sidebar from "../../components/sidebar/Sidebar";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import { AuthContext } from "../../context/AuthContext"; // Import the AuthContext

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const AU = process.env.REACT_APP_API_URL;

  const { user: currentUser, dispatch } = useContext(AuthContext); // Get current user and dispatch from context
  const [user, setUser] = useState({});
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const username = useParams().username;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${AU}users?username=${username}`, {
          withCredentials: true,
        });
        setUser(res.data);
        // console.log('User Data:', res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [username, AU]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const filePreview = URL.createObjectURL(file);
      setPreview(filePreview);
      
      // Clean up the object URL when component unmounts or when preview is cleared
      return () => URL.revokeObjectURL(filePreview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("No file selected.");
      return;
    }
    setUploading(true);

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = Cookies.get("token");
      const res = await axios.put(`${AU}users/${user._id}/updateProfilePicture`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        },
        withCredentials: true,
      });

      // Update user in local state
      setUser(res.data.user);

      // Dispatch an action to update the user in the AuthContext
      dispatch({
        type: "UPDATE_USER",
        payload: res.data.user, // Send the updated user data to the context
      });

      setError("");
      alert(res.data.message);
      setPreview("");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("Failed to upload profile picture.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancelPreview = () => {
    if (preview) {
      URL.revokeObjectURL(preview); // Clean up the object URL
      setPreview("");
      setFile(null);
    }
  };

  // Conditional rendering logic
  const isOwnProfile = currentUser && currentUser._id === user._id;

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={user.coverPicture ? PF + user.coverPicture : PF + "person/noCover.png"}
                alt="Cover"
              />
              <div className="profileUserImgContainer">
                <img
                  className="profileUserImg"
                  src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
                  alt="Profile"
                />
                {isOwnProfile && ( // Show edit container only for own profile
                  <div className="editContainer">
                    <form className="fileInputContainer" onSubmit={handleSubmit}>
                      <label htmlFor="profileFileInput" className="updateOption">
                        <AddIcon htmlColor="blue" className="updateIcon" />
                        <input
                          style={{ display: "none" }}
                          type="file"
                          id="profileFileInput"
                          accept=".png, .jpeg, .jpg"
                          onChange={handleFileChange}
                        />
                      </label>
                      {preview && (
                        <div className="previewContainer">
                          <img src={preview} alt="Preview" className="previewImg" />
                          <CancelIcon className="cancelPreview" onClick={handleCancelPreview} />
                          <button
                            className="profileEditButton"
                            onClick={handleSubmit}
                            disabled={uploading}
                            type="button"
                          >
                            {uploading ? "Uploading..." : "Upload"}
                          </button>
                        </div>
                      )}
                      {error && <p className="error">{error}</p>}
                    </form>
                  </div>
                )}
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
