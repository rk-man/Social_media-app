import "./../styles/notification.css";
import { useState, useEffect } from "react";
import useNotifications from "../hooks/useNotifications";
import { FaTimesCircle, FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { getRandomImage } from "../helpers";

function NotificationsPage() {
    const { getAllNotifications, cancelFollowRequest, acceptOrDeclineRequest } =
        useNotifications();
    const [pendingRequests, setPendingRequests] = useState([]);
    const [requestsSent, setRequestsSent] = useState([]);
    const [showing, setShowing] = useState("sent");

    useEffect(() => {
        getAllNotifications().then((res) => {
            setPendingRequests(res.pending);
            setRequestsSent(res.sent);
        });
    }, []);

    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <div className="notifications-header-title">
                    <p
                        className="notifications-header-title-link notifications-header-title-link-selected"
                        id="sent"
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById("sent")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            document
                                .getElementById("pending")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            setShowing("sent");
                        }}
                    >
                        Sent Requests
                    </p>
                    <p
                        className="notifications-header-title-link"
                        id="pending"
                        onClick={(e) => {
                            e.preventDefault();
                            document
                                .getElementById("sent")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            document
                                .getElementById("pending")
                                .classList.toggle(
                                    "notifications-header-title-link-selected"
                                );
                            setShowing("pending");
                        }}
                    >
                        Pending Requests
                    </p>
                </div>
                <hr className="notifications-header-line" />
            </div>
            <div className="notifications-people">
                {showing === "sent" && requestsSent.length > 0
                    ? requestsSent.map((sent) => {
                          return (
                              <div
                                  className="notifications-people-details"
                                  key={sent._id}
                              >
                                  <div className="notifications-people-details-each">
                                      <div className="notifications-people-details-each-img-wrapper">
                                          <img
                                              src={sent.followee.profileImage}
                                              alt={sent.followee.username}
                                              className="notifications-people-details-each-img"
                                          />
                                      </div>
                                      <p className="notifications-people-details-name">
                                          {sent.followee.username}
                                      </p>
                                  </div>
                                  <FaTimesCircle
                                      className="icon-medium"
                                      onClick={(e) => {
                                          e.preventDefault();
                                          cancelFollowRequest(sent._id);
                                          setRequestsSent(
                                              requestsSent.filter((s) => {
                                                  return s._id !== sent._id;
                                              })
                                          );
                                      }}
                                  />
                              </div>
                          );
                      })
                    : showing === "sent" && <h3>No requests sent</h3>}

                {showing === "pending" && pendingRequests.length > 0
                    ? pendingRequests.map((pending) => {
                          return (
                              <div
                                  className="notifications-people-details"
                                  key={pending._id}
                              >
                                  <div className="notifications-people-details-each">
                                      <div className="notifications-people-details-each-img-wrapper">
                                          <img
                                              src={
                                                  pending.followedBy
                                                      .profileImage
                                              }
                                              alt={pending.followedBy.username}
                                              className="notifications-people-details-each-img"
                                          />
                                      </div>
                                      <p className="notifications-people-details-name">
                                          {pending.followedBy.username}
                                      </p>
                                  </div>

                                  <div className="notifications-people-details-icons">
                                      <FaCheckCircle
                                          className="icon-medium"
                                          onClick={(e) => {
                                              e.preventDefault();
                                              acceptOrDeclineRequest(
                                                  pending._id,
                                                  "accepted"
                                              );
                                              toast.success("Request Accepted");
                                              setPendingRequests(
                                                  pendingRequests.filter(
                                                      (p) => {
                                                          return (
                                                              p._id !==
                                                              pending._id
                                                          );
                                                      }
                                                  )
                                              );
                                          }}
                                      />
                                      <FaTimesCircle
                                          className="icon-medium"
                                          onClick={(e) => {
                                              e.preventDefault();
                                              acceptOrDeclineRequest(
                                                  pending._id,
                                                  "declined"
                                              );
                                              toast.success("Request Declined");
                                              setPendingRequests(
                                                  pendingRequests.filter(
                                                      (p) => {
                                                          return (
                                                              p._id !==
                                                              pending._id
                                                          );
                                                      }
                                                  )
                                              );
                                          }}
                                      />
                                  </div>
                              </div>
                          );
                      })
                    : showing === "pending" && <h3>No Pending requests</h3>}
            </div>
        </div>
    );
}

export default NotificationsPage;
