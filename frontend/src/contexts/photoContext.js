import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { BACKEND_URL } from "../config";
import { getCookie } from "./../helpers";

const PhotoContext = createContext();

export function PhotoProvider({ children }) {
    const [authPhoto, setAuthPhoto] = useState({
        photo: null,
        success: false,
        error: false,
        message: "",
    });

    const [savedUploads, setSavedUploads] = useState([]);
    const [userUploads, setUserUploads] = useState([]);

    useEffect(() => {
        getAllUserUploads().then((res) => {
            setUserUploads(res);
        });
    }, []);

    const uploadPhoto = async (photoData) => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/photos`,
                photoData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setAuthPhoto({
                photo: res.data.photo,
                success: true,
                error: false,
                message: "",
            });

            console.log(res.data);
        } catch (err) {
            setAuthPhoto({
                photo: null,
                success: false,
                error: true,
                message: err.response.data.message
                    ? err.response.data.message
                    : "Something went wrong",
            });
        }
    };

    const getUserFeed = async () => {
        let photos = [];
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(`${BACKEND_URL}/api/v1/photos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            photos = res.data.photos;
        } catch (err) {
            console.log(err);
        }

        return photos;
    };

    const getSinglePhoto = async (id) => {
        let photo = null;
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(`${BACKEND_URL}/api/v1/photos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            photo = res.data.photo;
        } catch (err) {
            console.log(err);
        }
        return photo;
    };

    const getUserSavedUploads = async () => {
        let saved = [];
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(`${BACKEND_URL}/api/v1/photos/saved`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            saved = res.data.saved;
        } catch (err) {
            console.log(err);
        }
        return saved;
    };

    const getAllUploadsForExplore = async () => {
        let exploreUploads = [];
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(
                `${BACKEND_URL}/api/v1/photos/explore`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            exploreUploads = res.data.uploads;
        } catch (err) {
            console.log(err);
        }
        return exploreUploads;
    };

    const resetPhotoData = () => {
        setAuthPhoto((prev) => {
            return {
                photo: null,
                success: false,
                error: false,
                message: "",
            };
        });
    };

    const createComment = async (id, comment) => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/photos/${id}/comments`,
                {
                    comment,
                },
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

    const getAllUserUploads = async () => {
        let uploads = [];
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.get(
                `${BACKEND_URL}/api/v1/users/uploads/all-uploads`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            uploads = res.data.uploads;
        } catch (err) {
            console.log(err);
        }
        return uploads;
    };

    const deleteUpload = async (id) => {
        try {
            const token = getCookie("chocolate_token");
            await axios.delete(`${BACKEND_URL}/api/v1/photos/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.log(err);
        }
    };

    const updateUpload = async (id, uploadData) => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.patch(
                `${BACKEND_URL}/api/v1/photos/${id}`,
                uploadData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setAuthPhoto((prev) => {
                return {
                    ...prev,
                    photo: res.data.photo,
                    success: true,
                };
            });
        } catch (err) {
            setAuthPhoto((prev) => {
                return {
                    ...prev,
                    error: true,
                    message: "can't edit the upload",
                };
            });
        }
    };

    return (
        <PhotoContext.Provider
            value={{
                authPhoto,
                uploadPhoto,
                resetPhotoData,
                getUserFeed,
                getSinglePhoto,
                savedUploads,
                setSavedUploads,
                getUserSavedUploads,
                getAllUploadsForExplore,
                createComment,
                getAllUserUploads,
                userUploads,
                deleteUpload,
                updateUpload,
            }}
        >
            {children}
        </PhotoContext.Provider>
    );
}

export default PhotoContext;
