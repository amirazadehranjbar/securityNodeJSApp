// src/utils/cookieHelper.js
export function getCookie(name) {
    const cookieString = document.cookie;
    if (!cookieString) return null;

    const value = `; ${cookieString}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }

    return null;
}