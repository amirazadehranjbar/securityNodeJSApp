// import jwt from "jsonwebtoken";
// import {ChalkActions} from "../../chalkActions/chalkActions.js";
//
// const AuthMiddleware = async (req, res, next)=>{
//
//     const token = req.cookies.jwt;
//
//     if(!token){
//         return res.status(401).json("user Unauthorized");
//     }
//
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         ChalkActions({ message: `JWT verified for userId: ${decoded.userId}` });
//
//         req.user = decoded;
//         next();
//     } catch (e) {
//         ChalkActions({ level: "error", message: `Invalid JWT: ${e.message}` });
//         return res.status(401).json({ message: "Invalid token" });
//     }
//
// };
//
// export default AuthMiddleware;