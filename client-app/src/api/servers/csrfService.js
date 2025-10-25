// src/api/servers/csrfService.js
import axios from "axios";
import {ChalkActions} from "../../chalkActions/chalkActions.js";

const sendReqForSetCookie = async () => {
    try {
        const response = await axios.get("http://localhost:3000/csrf-token", {
            withCredentials: true, // very important for cookies
        });

        ChalkActions({message:`"CSRF cookie set successfully:", ${response.headers["x-csrf-token-generated"]}`})



    } catch (error) {
        console.error("Failed to get CSRF cookie:", error.message);
    }
};

export default sendReqForSetCookie;
