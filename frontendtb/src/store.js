import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import userReducer from "./features/userSlice";
import loadingReducer from "./features/loadingSlice";
import logoutReducer from "./features/logoutSlice";

const rootReducer = combineReducers({
        user: userReducer,
        loading:loadingReducer,
        logout: logoutReducer
});

const store = configureStore({
    reducer: rootReducer,
});

export default store ;

