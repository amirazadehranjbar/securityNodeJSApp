import {config} from 'dotenv';

config();
import express from "express";

const app = express();
import mongoose from "mongoose"
import {ChalkActions} from "../chalkActions/chalkActions.js";

import userRoutes from "./routers/userRoutes.js";
import cookieParser from 'cookie-parser';

import cors from "cors";

import { csrfInit } from "./middlewares/csrfMiddleware.js";

// middlewars *******************************************
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // cookies send permission
}));
// initialize csrf middleware
app.use(csrfInit());

// routes ***********************************************
app.use("/",userRoutes);
// conect to mongoDB ************************************
mongoose.connect(process.env.MONGODB_URL).then(() => {
    ChalkActions({message: "connect to mongoDB successfully"})
}).catch(reason =>
    ChalkActions({level: "error", message: {reason}})
)

// set cookies *****************************************



// srart server *****************************************
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {

    ChalkActions({message: `server start on port : ${PORT}`})
})