import { useContext } from "react";
import { Link } from "react-router-dom";
import PhotoContext from "../contexts/photoContext";
import "./../styles/photo.css";
import EachUpload from "../components/EachUpload";
import { useState, useEffect } from "react";
import LoadingSpinner from "../utils/LoadingSpinner";
import { getRandomImage } from "./../helpers";

function HomePage() {
    const { getUserFeed, getUserSavedUploads, setSavedUploads } =
        useContext(PhotoContext);
    const [authPhotos, setAuthPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserFeed().then((res) => {
            setAuthPhotos(res);
            setLoading(false);
        });
        changeScrollingDirection();
    }, []);

    useEffect(() => {
        getUserSavedUploads().then((res) => {
            setSavedUploads(res);
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

    function changeScrollingDirection() {
        const scrollContainer = document.querySelector(".all-uploads");

        scrollContainer.addEventListener("wheel", (evt) => {
            evt.preventDefault();
            scrollContainer.scrollLeft += evt.deltaY;
        });
    }

    return (
        <div>
            {loading && <LoadingSpinner />}
            <Link to="/uploads/create" className="link">
                <button className="btn btn-tertiary">Upload Photo</button>
            </Link>

            <div className="all-uploads">
                {authPhotos.length > 0 ? (
                    authPhotos.map((ph) => {
                        return <EachUpload upload={ph} key={ph._id} />;
                    })
                ) : (
                    <h3>No feeds to show</h3>
                )}
            </div>
        </div>
    );
}

export default HomePage;
