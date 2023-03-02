import axios from "axios";
import { BACKEND_URL } from "./../config";
import { getCookie } from "./../helpers";
import { useContext } from "react";
import AuthContext from "./../contexts/authContext";
function useLikeSystem() {
    const { authUser } = useContext(AuthContext);

    const addOrRemoveLike = async (id) => {
        let like = null;
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/photos/${id}/likes/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            // like = res.data.like;
        } catch (err) {
            console.log(err);
        }

        return like;
    };

    const checkIfUserAlreadyLiked = (likes) => {
        let like = likes.filter((like) => {
            return (
                like.likedBy._id === authUser.user._id && like.status === true
            );
        });

        // console.log(like);

        return like.length > 0 ? true : false;
    };

    return { addOrRemoveLike, checkIfUserAlreadyLiked };
}

export default useLikeSystem;
