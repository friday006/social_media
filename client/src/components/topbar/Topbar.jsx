import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@mui/icons-material";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useDebounce } from "use-debounce";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const AU = process.env.REACT_APP_API_URL;
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500); // Debounce with 500ms delay

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearchQuery) {
        try {
          const res = await axios.get(`${AU}users?username=${debouncedSearchQuery}`);
          const data = Array.isArray(res.data) ? res.data : [res.data]; // Normalize the response to always be an array
        setSearchResults(data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSearchResults([]);
      }
    };

    fetchUsers();
  }, [debouncedSearchQuery, AU]);
  // console.log('Search results:', typeof searchResults); // Log searchResults
  // console.log('Search results length:', searchResults.length); // Log searchResults.length
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to={"/"} style={{ textDecoration: "none" }}>
          <span className="logo">SocialNode</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friend, post or video"
            className="searchInput"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map((result) => (
                <Link to={`/profile/${result.username}`} key={result._id} className="searchResultItem">
                  <Search className="searchResultIcon" /> {/* This is where we add the search icon */}
                  <span className="searchResultName">{result.username}</span>
                </Link>
              ))}
              {/* <h4>This is profile name</h4> */}
            </div>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink">Homepage</span>
          <span className="topbarLink">Timeline</span>
        </div>
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat />
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications />
            <span className="topbarIconBadge">3</span>
          </div>
        </div>
        <div className="topbarProfile">
          <img
            src={user.profilePicture ? PF + user.profilePicture : PF + "person/noAvatar.png"}
            alt=""
            className="topbarImg"
            onClick={() => setDropdownVisible(!dropdownVisible)}
          />
          {dropdownVisible && (
            <div className="dropdownMenu">
              <Link to={`/profile/${user.username}`} className="dropdownItem">
                Profile
              </Link>
              <span className="dropdownItem" onClick={handleLogout}>
                Logout
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
