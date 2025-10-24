import React from 'react'
import {useNavigate} from "react-router";

function App() {

    const navigation = useNavigate();

    return (
        <div className="h-screen w-screen bg-indigo-200">

            <header className="w-screen bg-indigo-400 flex p-3 justify-between">

                <img src="/public/rocket.png" alt="" width="40" className="animate-pulse"/>

                <div className="flex space-x-2">
                    <button className="button">login</button>
                    <button className="button" onClick={() => {
                        navigation("/users/register");
                    }}>register
                    </button>
                </div>

            </header>


        </div>
    )
}

export default App
