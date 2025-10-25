import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import {Provider} from "react-redux";
import store from "./redux/store.js";
import LoginPage from "./pages/auth/LoginPage.jsx";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <StrictMode>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/users/register" element={<RegisterPage/>}/>
                    <Route path="/users/login" element={<LoginPage/>}/>
                </Routes>
            </StrictMode>
        </BrowserRouter>
    </Provider>
)
