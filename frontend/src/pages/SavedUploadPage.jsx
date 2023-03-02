import "./../styles/photo.css";
import EachUpload from "../components/EachUpload";
import { useContext, useEffect, useState } from "react";
import PhotoContext from "../contexts/photoContext";
import LoadingSpinner from "../utils/LoadingSpinner";
import { getRandomImage } from "../helpers";
function SavedUploadPage() {
    const { savedUploads, setSavedUploads, getUserSavedUploads } =
        useContext(PhotoContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserSavedUploads().then((res) => {
            setSavedUploads(res);
            setLoading(false);
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
        <div>
            {loading && <LoadingSpinner />}
            <div className="all-uploads">
                {savedUploads.length > 0 ? (
                    savedUploads.map((savedUpload) => {
                        return (
                            <EachUpload
                                upload={savedUpload.upload}
                                key={savedUpload.upload._id}
                            />
                        );
                        // return <p>fhsddg</p>;
                    })
                ) : (
                    <h3>You have not saved anything</h3>
                )}
            </div>
        </div>
    );
}

export default SavedUploadPage;
