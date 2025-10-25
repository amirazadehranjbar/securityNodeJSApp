// src/api/middlewares/csrfMiddleware.js
import crypto from "crypto";

/*
  CSRF middleware (double-submit cookie)
  - generate a random token and set it as a readable cookie if not present
  - on unsafe methods (POST/PUT/PATCH/DELETE) verify header matches cookie
*/

const CSRF_COOKIE_NAME = "XSRF-TOKEN";
const CSRF_HEADER_NAME = "x-xsrf-token"; // client must send this header

// helper: create a secure random token
function createToken() {
    return crypto.randomBytes(32).toString("hex"); // 64 hex chars ~ 256 bits
}

// helper: check if method is state-changing
function isUnsafeMethod(method) {
    return ["POST", "PUT", "PATCH", "DELETE"].includes(method.toUpperCase());
}

export const csrfInit = (options = {}) => {
    const {
        cookieName = CSRF_COOKIE_NAME,
        headerName = CSRF_HEADER_NAME,
        cookieOptions = {
            httpOnly: false, // must be readable by JS for double-submit
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
            path: "/",
        },
    } = options;

    return function csrfMiddleware(req, res, next) {
        try {
            // 1) Ensure cookie exists: if not, create and set it
            const existingToken = req.cookies ? req.cookies[cookieName] : undefined;

            if (!existingToken) {
                const token = createToken();
                console.log(`[CSRF] setting new token for ${req.ip} token=${token}`);
                res.cookie(cookieName, token, cookieOptions);
                // expose token in response header for convenience (optional)
                res.setHeader("X-CSRF-Token-Generated", "true");
            } else {
                // debug log for educational purposes
                console.log(`[CSRF] token present for ${req.ip} token=${existingToken}`);
            }

            // 2) If request is unsafe, verify header matches cookie
            if (isUnsafeMethod(req.method)) {
                const cookieToken = req.cookies ? req.cookies[cookieName] : undefined;
                // prefer header, fallback to body._csrf for old forms
                const headerToken = (req.headers[headerName] || req.body && req.body._csrf) || "";

                console.log(`[CSRF] verifying tokens for ${req.ip} method=${req.method}`);
                console.log(`[CSRF] cookieToken=${cookieToken}`);
                console.log(`[CSRF] headerToken=${headerToken}`);


                if (!cookieToken || !headerToken || cookieToken !== headerToken) {
                    console.log(`[CSRF] verification failed for ${req.ip}`);
                    return res.status(403).json({ message: "Invalid CSRF token" });
                }
                console.log(`[CSRF] verification succeeded for ${req.ip}`);
            }

            next();
        } catch (err) {
            console.log("[CSRF] middleware error:", err);
            return res.status(500).json({ message: "CSRF middleware error" });
        }
    };
};
