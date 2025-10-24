import React, {useState} from 'react'
import {useDispatch} from "react-redux";
import {registerUser} from "../../redux/features/userReducer.js";

function AuthPage() {

    const [userData, setUserData] = useState({username: "", password: ""})
    const dispatch = useDispatch();

    const handleRegisterUser = async () => {

        await dispatch(registerUser({username: userData.username, password: userData.password}));


    }

    return (
        <div className="w-full h-screen bg-violet-200 flex flex-col justify-center items-center space-y-2">

            <input className="input" placeholder="name" value={userData.username}
                   onChange={(e) => setUserData({...userData, username: e.target.value})}/>


            <input className="input" placeholder="password" type="password"
                   value={userData.password}
                   onChange={(e) => setUserData({...userData, password: e.target.value})}/>


            <button className="button" onClick={handleRegisterUser}>
                register
            </button>

        </div>
    )
}

export default AuthPage
