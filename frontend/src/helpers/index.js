import Cookies from "js-cookie";

export const setCookie = (cookieName, token) => {
    Cookies.set(cookieName, token, {
        expires: 30,
        secure: false,
        sameSite: "strict",
        path: "/",
    });
};

export const getCookie = (cookieName) => {
    return Cookies.get(cookieName);
};

export const removeCookie = (cookieName) => {
    Cookies.remove(cookieName);
};

export const convertDateToString = (date) => {
    return new Date(date).toLocaleString("en-us", {
        timeStyle: "short",
        dateStyle: "long",
    });
};

const images = ["bg1.jpg", "bg2.jpg", "bg3.jpg", "bg4.jpg", "bg5.jpg"];

export const getRandomImage = () => {
    return images[Math.floor(Math.random() * images.length)];
};
