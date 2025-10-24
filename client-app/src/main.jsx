import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter, Route, Routes} from "react-router";
import AuthPage from "./pages/auth/AuthPage.jsx";
import {Provider} from "react-redux";
import store from "./redux/store.js";

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <StrictMode>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/users/register" element={<AuthPage/>}/>
                </Routes>
            </StrictMode>
        </BrowserRouter>
    </Provider>
)
