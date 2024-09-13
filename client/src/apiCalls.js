import axios from "axios";

// Login Function: No need to manually handle JWT tokens
export const loginCall = async (userCredentials, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const res = await axios.post(
      process.env.REACT_APP_API_URL + "auth/login",
      userCredentials,
      { withCredentials: true } // Important to send/receive cookies
    );
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });
  }
};

// Logout Function: Clear JWT from cookies via backend
export const logoutCall = async (dispatch) => {
  try {
    await axios.post(process.env.REACT_APP_API_URL + "auth/logout", {}, {
      withCredentials: true // Ensure cookies are sent
    });
    dispatch({ type: "LOGOUT" });
  } catch (err) {
    console.error("Logout failed", err);
  }
};
