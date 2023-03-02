import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { setCookie, getCookie, removeCookie } from "./../helpers";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState({
        user: null,
        success: false,
        error: false,
        message: "",
    });
    const [follows, setFollows] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        getAllFollows().then((res) => {
            setFollows(res);
        });
    }, []);

    useEffect(() => {
        getMe();
    }, []);

    const login = async (userData) => {
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/users/login`,
                userData
            );
            setAuthUser((prev) => {
                return {
                    ...prev,
                    user: res.data.data.user,
                    success: true,
                };
            });

            setCookie("chocolate_token", res.data.data.token);
        } catch (err) {
            setAuthUser((prev) => {
                return {
                    ...prev,
                    user: null,
                    success: false,
                    error: true,
                    message: "incorrect username or password",
                };
            });
        }
    };

    const getMe = async () => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(`${BACKEND_URL}/api/v1/users/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAuthUser((prev) => {
                return {
                    ...prev,
                    user: res.data.user,
                };
            });
        } catch (err) {
            console.log(err);
            navigate("/auth/login");
        }
    };

    const logout = () => {
        removeCookie("chocolate_token");
        setAuthUser({
            user: null,
            success: false,
            error: false,
            message: "",
        });
        navigate("/auth/login");
    };

    const resetAuth = () => {
        setAuthUser((prev) => {
            return {
                ...prev,
                success: false,
                error: false,
                message: "",
            };
        });
    };

    const getAllFollows = async () => {
        let follows = [];
        try {
            const token = getCookie("chocolate_token");
            if (token) {
                const res = await axios.get(
                    `${BACKEND_URL}/api/v1/users/follows/all-follows`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                follows = res.data.follows;
            }
        } catch (err) {
            console.log(err);
        }
        return follows;
    };

    const checkUserFollowInfo = async (userID) => {
        let status = "";
        let followData = follows.filter((f) => {
            return f.followee._id === userID;
        });

        if (followData.length > 0) {
            status = followData[0].status ? "unfollow" : "cancel";
        } else {
            status = "follow";
        }

        return { status, followData };
    };

    const sendFollowRequest = async (followeeID) => {
        let followData = null;
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/users/follows/send-request`,
                {
                    followeeID,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            followData = res.data.follower;
        } catch (err) {
            console.log(err);
        }

        return followData;
    };

    const unfollowOrCancelFollow = async (id) => {
        try {
            const token = getCookie("chocolate_token");
            await axios.delete(
                `${BACKEND_URL}/api/v1/users/follows/${id}/cancel-request`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const searchUsers = async (search) => {
        let users = [];
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(
                `${BACKEND_URL}/api/v1/users/search?search=${search}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            users = res.data.users;
        } catch (err) {
            console.log(err);
        }

        return users;
    };

    const updateUser = async (userData) => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.patch(
                `${BACKEND_URL}/api/v1/users/update`,
                userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAuthUser((prev) => {
                return {
                    ...prev,
                    user: res.data.user,
                    success: true,
                };
            });
        } catch (err) {
            setAuthUser((prev) => {
                return {
                    ...prev,
                    error: true,
                    message: "Couldn't update user",
                };
            });
        }
    };

    const getAllUserFollowData = async () => {
        let followData = {};
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(
                `${BACKEND_URL}/api/v1/users/follows/user-follows`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            followData = {
                followers: res.data.followers,
                followingUsers: res.data.followingUsers,
            };
        } catch (err) {
            console.log(err);
        }
        return followData;
    };

    return (
        <AuthContext.Provider
            value={{
                authUser,
                login,
                resetAuth,
                logout,
                getAllFollows,
                follows,
                setFollows,
                checkUserFollowInfo,
                sendFollowRequest,
                unfollowOrCancelFollow,
                searchUsers,
                updateUser,
                getAllUserFollowData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
