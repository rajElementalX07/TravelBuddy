import { createSlice } from "@reduxjs/toolkit";
import { unsetUser } from "./userSlice";

const logoutSlice = createSlice({
  name: "logout",
  initialState: {},
  reducers: { },
});


export const logout = () => (dispatch) => {
  dispatch(unsetUser());

};


export default logoutSlice.reducer;
