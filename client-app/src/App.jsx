import React, {useEffect} from 'react'
import {useNavigate} from "react-router";
import sendReqForSetCookie from "./api/servers/csrfService.js";
import {useSelector, useDispatch} from "react-redux";
import {ChalkActions} from "./chalkActions/chalkActions.js";
import {logoutUser} from "./redux/features/userReducer.js";

function App() {

    const navigation = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        sendReqForSetCookie();
    }, []);

    const {isAuthenticated, user} = useSelector(state => state.userReducer);

    const handleClick = () => {
        ChalkActions({message: `isAuthenticated: ${isAuthenticated}`});
        if (user) {
            ChalkActions({message: `Current user: ${user.username}`});
        }
    }

    const handleLogout = () => {
        dispatch(logoutUser());
        ChalkActions({message: "User logged out"});
    }

    return (
        <div className="h-screen w-screen bg-indigo-200 flex flex-col items-center">

            <header className="w-screen bg-indigo-400 flex p-3 justify-between">

                <img src="/public/rocket.png" alt="" width="40" className="animate-pulse"/>

                {/* Fixed condition: show logout when authenticated, login/register when NOT authenticated */}
                {isAuthenticated ? (
                    <div className="flex space-x-2 items-center">
                        <span className="text-white font-bold">Welcome, {user?.username}!</span>
                        <button className="button" onClick={handleLogout}>
                            logout
                        </button>
                    </div>
                ) : (
                    <div className="flex space-x-2">
                        <button className="button" onClick={() => {
                            navigation("/users/login");
                        }}>login</button>

                        <button className="button" onClick={() => {
                            navigation("/users/register");
                        }}>register</button>
                    </div>
                )}

            </header>

            <button className="button w-1/5" onClick={handleClick}>
                {isAuthenticated ? `Logged in as: ${user?.username}` : 'Not logged in'}
            </button>

        </div>
    )
}

export default App