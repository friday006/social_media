import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  // user:JSON.parse(localStorage.getItem("user")) || null,
  user:{
    // "originalPassword": "",
    // "_id": "66d19209e8648d6cd9ef6e61",
    // "username": "priyankar",
    // "email": "priyankar@example.com",
    // "profilePicture": "person/1.jpeg",
    // "coverPicture": "person/2.jpeg",
    // "followers": [
    //     "66cf271fd463091d88cced50",
    //     "66d193c0e8648d6cd9ef6e67"
    // ],
    // "followings": [
    //   "66d193c0e8648d6cd9ef6e67"
    // ],
    // "isAdmin": false,
    // "__v": 0,
    // "desc": "priyankar description",
    // "city": "Agra",
    // "from": "Jagdishpura",
    // "relationship": 1
  "originalPassword": "",
    "_id": "66d193c0e8648d6cd9ef6e67",
    "username": "nigam",
    "email": "nigam@gmail.com",
    "profilePicture": "1k7FMNQBan3OrGEH7yqie-rxH0R_Ithm_",
    "coverPicture": "1k7FMNQBan3OrGEH7yqie-rxH0R_Ithm_",
    "followers": [
        "66cf271fd463091d88cced50"
    ],
    "followings": [
        "66d19209e8648d6cd9ef6e61"
    ],
    "isAdmin": false,
    "__v": 0,
    "desc": "hey it is my desciption",
    "city": "Jaipur",
    "from": "Malvia Nagar",
    "relationship": 0
},
  isFetching: false,
  error: false,
};


export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);
  
  useEffect(()=>{
    localStorage.setItem("user", JSON.stringify(state.user))
  },[state.user])
  
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
