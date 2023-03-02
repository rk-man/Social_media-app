import axios from "axios";
import { BACKEND_URL } from "../config";
import { getCookie } from "../helpers";
import { useContext } from "react";
import PhotoContext from "../contexts/photoContext";

function useSavedUpload() {
    const { savedUploads } = useContext(PhotoContext);

    const saveOrUnsaveUpload = async (id) => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/photos/saved/${id}`,
                {},
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

    const checkIfUserSavedUpload = (id) => {
        if (savedUploads && savedUploads.length > 0) {
            let userSavedUploads = savedUploads.filter((saved) => {
                return saved.upload._id === id;
            });
            return userSavedUploads.length > 0 ? true : false;
        } else {
            return false;
        }
    };

    return {
        saveOrUnsaveUpload,
        checkIfUserSavedUpload,
    };
}

export default useSavedUpload;
