import {configureStore} from "@reduxjs/toolkit";
import UserReducer from "./features/userReducer.js";


const store = configureStore(
    {
        reducer:{
            userReducer:UserReducer,
        }
    }
);


export default store;