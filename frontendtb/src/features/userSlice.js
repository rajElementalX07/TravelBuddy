import { createSlice } from "@reduxjs/toolkit";

function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Error loading data from localStorage:", error);
    return null;
  }
}

const initialState = {
  user: loadFromLocalStorage("user") || null,
  token: loadFromLocalStorage("token") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;

      if (token) {
        state.token = token;
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", JSON.stringify(token));
        setTokenExpiration(24 * 60 * 60 * 1000); // Set token expiration for 1 day
      }
    },
    unsetUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;

function setTokenExpiration(expirationTime,dispatch) {
  if (expirationTime > 0) {
    setTimeout(() => {
      localStorage.removeItem("token"); // Remove token from local storage
      dispatch(unsetUser()); // Dispatch the unsetUser action to clear token in Redux store
    }, expirationTime);
  }
}
