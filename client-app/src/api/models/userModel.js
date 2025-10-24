import mongoose, {model} from "mongoose";

const userScheme = new mongoose.Schema({

    username:{
        type:String,
        required:[true , "user name is requered!"]
    },

    password:{
        type:String,
        required:[true , "password is requred!"]
    }

});

const userModel = model("Users" , userScheme);
export default userModel;