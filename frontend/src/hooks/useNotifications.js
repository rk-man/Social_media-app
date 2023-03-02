import { BACKEND_URL } from "../config";
import axios from "axios";
import { getCookie } from "../helpers";

function useNotifications() {
    const getAllNotifications = async () => {
        let sent = [];
        let pending = [];
        try {
            let token = getCookie("chocolate_token");
            const res = await axios.get(
                `${BACKEND_URL}/api/v1/users/follows/notifications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            sent = res.data.requestsSent;
            pending = res.data.pendingRequests;
        } catch (err) {
            console.log(err);
        }

        return { sent, pending };
    };

    const cancelFollowRequest = async (followID) => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.delete(
                `${BACKEND_URL}/api/v1/users/follows/${followID}/cancel-request`,
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

    const acceptOrDeclineRequest = async (followID, status) => {
        try {
            const token = getCookie("chocolate_token");
            const res = await axios.patch(
                `${BACKEND_URL}/api/v1/users/follows/${followID}/send-response`,
                {
                    status,
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

    return { getAllNotifications, cancelFollowRequest, acceptOrDeclineRequest };
}

export default useNotifications;
