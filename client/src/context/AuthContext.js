import { createContext, useEffect, useReducer } from "react";
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null, // Load token from localStorage
  isFetching: false,
  error: false,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

  useEffect(() => {
    // Save both user and token to localStorage on state changes
    if (state.user) {
      localStorage.setItem("user", JSON.stringify(state.user));
    }
    if (state.token) {
      localStorage.setItem("token", state.token); // Save token to localStorage
    }
  }, [state.user, state.token]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token, // Expose token to the context
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
