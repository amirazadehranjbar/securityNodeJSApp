import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";
import {getCookie} from "../../utils/getCookie.js";

// region Async Thunk : register
export const registerUser = createAsyncThunk(
    "register",
    async ({username, password}, thunkAPI) => {

        try {

            const csrfToken = getCookie("XSRF-TOKEN");


            const response = await axios.post("http://localhost:3000/users/register", {username, password}, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "x-xsrf-token": csrfToken
                }
            });

            return {username: response.data.username}; // just data that needed

        } catch (e) {

            console.log("Error in registerUser thunk:", e.message);
            return thunkAPI.rejectWithValue(e.message || "error in register progress");
        }
    }
);
// endregion


// region Async Thunk : login
export const loginUser = createAsyncThunk(
    "loginUser",

    async ({username, password}, thunkAPI) => {

        try {
            function getCookie(name) {
                const value = `; ${document.cookie}`;
                const parts = value.split(`; ${name}=`);
                if (parts.length === 2) return parts.pop().split(';').shift();
            }

            const csrfToken = getCookie("XSRF-TOKEN");

            const response = await axios.post("http://localhost:3000/users/login", {username, password}, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    "x-xsrf-token": csrfToken
                }
            });

            console.log(`[FRONTEND LOGIN SUCCESS] Response: ${response.data.message}`);

            return {username: response.data.username};
        } catch (e) {


            return thunkAPI.rejectWithValue(e.message || "error in login")

        }

    }
)
// endregion

// region Async Thunk : logout
export const logoutUser = createAsyncThunk(
    "logoutUser",
    async (_, thunkAPI) => {
        try {
            const csrfToken = getCookie("XSRF-TOKEN");

            const response = await axios.post("http://localhost:3000/users/logout",
                {},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        "x-xsrf-token": csrfToken
                    }
                }
            );

            console.log(`[FRONTEND LOGOUT SUCCESS]`);
            return response.data;
        } catch (e) {
            // Even if logout fails on server, clear local state
            return thunkAPI.fulfillWithValue({});
        }
    }
)
// endregion


const initialState = {
    isLoading: false,
    isError: false,
    data: [],
    user: null,
    isAuthenticated: false,
}

const UserReducer = createSlice(
    {
        name: "UserRegister",
        initialState,
        reducers: {
            // Synchronous logout (if you don't need server call)
            clearUser: (state) => {
                state.user = null;
                state.isAuthenticated = false;
                state.error = null;
            }
        },
        extraReducers: builder => {
            builder
                // region register
                .addCase(registerUser.pending, (user) => {
                    user.isLoading = true;
                    user.isError = false;
                })

                .addCase(registerUser.fulfilled, (user, action) => {
                    user.isLoading = false;
                    user.isError = false;
                    user.data.push(action.payload);
                })

                .addCase(registerUser.rejected, (user) => {
                    user.isLoading = false;
                    user.isError = true;
                })
                // endregion

                // region login
                .addCase(loginUser.pending, user => {
                    user.isLoading = true;
                    user.isError = false;
                })
                .addCase(loginUser.fulfilled, (user, action) => {
                    user.isLoading = false;
                    user.isError = false;
                    console.log(`[REDUX] Login fulfilled for user: ${action.payload.username}`);
                    user.user = action.payload;
                    user.isAuthenticated = true;
                })
                .addCase(loginUser.rejected, user => {
                    user.isLoading = false;
                    user.isError = true;
                })
            // endregion

                // region logout
                .addCase(logoutUser.pending, (state) => {
                    state.isLoading = true;
                })
                .addCase(logoutUser.fulfilled, (state) => {
                    state.isLoading = false;
                    state.isError = false;
                    state.user = null;
                    state.isAuthenticated = false;
                    state.error = null;
                })
                .addCase(logoutUser.rejected, (state) => {
                    // Even if logout fails, clear the state
                    state.isLoading = false;
                    state.user = null;
                    state.isAuthenticated = false;
                })
            // endregion
        }
    }
);

export const {clearUser} = UserReducer.actions;
export default UserReducer.reducer;


