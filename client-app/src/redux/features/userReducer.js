import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import axios from "axios";


export const registerUser = createAsyncThunk(
    "register",
    async ({ username, password }, thunkAPI) => {

        try {

            const response = await axios.post("http://localhost:3000/users/register", {
                username,
                password
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true // for sending cookies
            });

            return { username: response.data.username }; // just data that needed

        } catch (e) {

            console.log("Error in registerUser thunk:", e.message);
            return thunkAPI.rejectWithValue(e.message || "error in register progress");
        }
    }
);

const initialState = {
    isLoading: false,
    isError: false,
    data: [],
}

const UserReducer = createSlice(
    {
        name: "UserRegister",
        initialState,
        extraReducers: builder => {
            builder.addCase(registerUser.pending, (users) => {
                users.isLoading = true;
                users.isError = false;
            })

                .addCase(registerUser.fulfilled, (users, action) => {
                    users.isLoading = false;
                    users.isError = false;
                    users.data.push(action.payload);
                })

                .addCase(registerUser.rejected, (users) => {
                    users.isLoading = false;
                    users.isError = true;
                })
        }
    }
);

export default UserReducer.reducer;


