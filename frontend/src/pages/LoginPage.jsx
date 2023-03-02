import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/authContext";
import "./../styles/form.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getRandomImage } from "../helpers";

function LoginPage() {
    const { login, authUser, resetAuth } = useContext(AuthContext);

    const { user, success, error, message } = authUser;

    const [userData, setUserData] = useState({
        username: "",
        password: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (user && success) {
            toast.success("Logged in Successfully");
            navigate("/");
            resetAuth();
        } else if (error && message) {
            toast.error(message);
            resetAuth();
        }
    }, [user, success, error, message]);

    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(../${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(userData);
        // console.log(userData);
    };

    return (
        <div className="form-wrapper">
            <form className="form" onSubmit={handleSubmit}>
                <h3>Login here...</h3>
                <div className="form-field">
                    <label htmlFor="username" className="form-field-label">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="form-field-input"
                        onChange={(e) => {
                            e.preventDefault();
                            setUserData((prev) => {
                                return {
                                    ...prev,
                                    username: e.target.value,
                                };
                            });
                        }}
                        value={userData.username}
                    />
                </div>
                <div className="form-field">
                    <label htmlFor="password" className="form-field-label">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="form-field-input"
                        onChange={(e) => {
                            e.preventDefault();
                            setUserData((prev) => {
                                return {
                                    ...prev,
                                    password: e.target.value,
                                };
                            });
                        }}
                        value={userData.password}
                    />
                </div>
                <div className="btns-container">
                    <button className="btn btn-primary" type="submit">
                        Login
                    </button>
                    <button
                        className="btn btn-secondary"
                        onClick={(e) => {
                            e.preventDefault();
                            setUserData({
                                username: "",
                                password: "",
                            });
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage;
