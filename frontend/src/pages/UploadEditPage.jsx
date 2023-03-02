import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PhotoContext from "../contexts/photoContext";
import { getRandomImage } from "../helpers";
import "./../styles/form.css";
import { GENRES } from "../config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./../utils/LoadingSpinner";
function UploadEditPage() {
    const {
        getSinglePhoto,
        resetPhotoData,
        authPhoto,
        deleteUpload,
        updateUpload,
    } = useContext(PhotoContext);
    const [upload, setUpload] = useState(null);
    const { id } = useParams();

    const { photo, success, error, message } = authPhoto;

    const [description, setDescription] = useState("");

    const [images, setImages] = useState([]);

    const [showOverallDescription, setShowOverallDescription] = useState(false);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (upload) {
            setDescription(upload.description);
            setImages(upload.images);
            let status = false;
            upload.images.forEach((img) => {
                if (img.soloDescription.length > 0) {
                    status = true;
                }

                // setting the genre values
                img.genre.forEach((g) => {
                    let el = document.getElementById(g + img._id);
                    if (el) {
                        el.checked = true;
                    }
                });
            });

            if (!status) {
                setShowOverallDescription(true);
                document.getElementById("overall").checked = true;
            } else {
                document.getElementById("solo").checked = true;
            }
        }
    }, [upload]);

    useEffect(() => {
        if (photo && success) {
            setLoading(false);
            toast.success("Successfully updated");
            resetPhotoData();
            navigate("/account");
        } else if (error && message) {
            setLoading(false);
            toast.error(message);
            resetPhotoData();
        }
    }, [photo, success, error, message, navigate, resetPhotoData]);

    useEffect(() => {
        document.querySelector(
            "body"
        ).style.backgroundImage = `url(./../../${getRandomImage()})`;
        return () => {
            document.querySelector("body").style.backgroundImage = "None";
        };
    }, []);

    useEffect(() => {
        if (id.length > 0) {
            getSinglePhoto(id).then((res) => {
                setUpload(res);
            });
        }
    }, [id]);

    const handleChangePhotoGenre = (e) => {
        let curImgID = Number(e.target.closest(".form-img-preview-wrapper").id);
        let curGenre = document.getElementById(e.target.id);

        setImages(
            images.map((img, index) => {
                if (index === curImgID && !curGenre.checked) {
                    return {
                        ...img,
                        genre: img.genre.filter((g) => g != curGenre.name),
                    };
                } else if (index === curImgID && curGenre.checked) {
                    return {
                        ...img,
                        genre: [...img.genre, curGenre.name],
                    };
                } else {
                    return img;
                }
            })
        );
    };

    const handleChangePhotoData = (e) => {
        e.preventDefault();
        const id = e.target.closest(".form-img-preview-wrapper").id;
        console.log(id);

        setImages(
            images.length > 0
                ? images.map((img, index) => {
                      if (Number(id) === index) {
                          return {
                              ...img,
                              [`${e.target.id}`]: e.target.value,
                          };
                      } else {
                          return img;
                      }
                  })
                : images
        );
    };

    const handleDelete = (e) => {
        e.preventDefault();
        deleteUpload(id).then(() => {
            toast.success("Deleted Successfully");
            navigate("/account");
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let data = {
            images: images.map((img) => {
                delete img._id;
                return img;
            }),
            description,
        };

        if (showOverallDescription) {
            data = {
                description,
                images: images.map((img) => {
                    return {
                        ...img,
                        soloDescription: "",
                    };
                }),
            };
        } else {
            data = {
                description: "",
                images,
            };
        }
        updateUpload(id, data);
        setLoading(true);
    };

    return (
        <div className="form-wrapper">
            {loading && <LoadingSpinner />}
            <form className="form" onSubmit={handleSubmit}>
                <button className="btn btn-primary" onClick={handleDelete}>
                    Delete
                </button>
                <div className="form-field">
                    <label className="form-field-label">
                        Do you want a description for each photo or an overall
                        description ?
                    </label>
                    <div className="form-field-radio-btns">
                        <div className="form-field-radio-btn">
                            <input
                                type="radio"
                                id="solo"
                                onClick={(e) => {
                                    setShowOverallDescription(false);
                                    document.getElementById(
                                        "overall"
                                    ).checked = false;
                                }}
                            />
                            <p>Solo Description</p>
                        </div>
                        <div className="form-field-radio-btn">
                            <input
                                type="radio"
                                id="overall"
                                onClick={(e) => {
                                    setShowOverallDescription(true);
                                    document.getElementById(
                                        "solo"
                                    ).checked = false;
                                }}
                            />
                            <p>Overall Description</p>
                        </div>
                    </div>
                </div>

                {showOverallDescription && (
                    <div className="form-field">
                        <label
                            className="form-field-label"
                            htmlFor="description"
                        >
                            Description
                        </label>
                        <textarea
                            className="form-field-input"
                            rows={14}
                            id="description"
                            value={description}
                            onChange={(e) => {
                                e.preventDefault();
                                setDescription(e.target.value);
                            }}
                        ></textarea>
                    </div>
                )}

                <div className="form-img-previews">
                    {images.length > 0 &&
                        images.map((img, index) => {
                            return (
                                <div
                                    key={index}
                                    className="form-img-preview-wrapper"
                                    id={index}
                                >
                                    <img
                                        src={img.url}
                                        className="form-preview-img"
                                        alt={index}
                                    />
                                    {!showOverallDescription && (
                                        <div className="form-field">
                                            <label
                                                className="form-field-label"
                                                htmlFor="soloDescription"
                                            >
                                                Solo Description
                                            </label>
                                            <textarea
                                                className="form-field-input"
                                                rows={3}
                                                id="soloDescription"
                                                name={index}
                                                onChange={handleChangePhotoData}
                                                value={img.soloDescription}
                                            ></textarea>
                                        </div>
                                    )}

                                    <div className="form-field">
                                        <label
                                            className="form-field-label"
                                            htmlFor="gears"
                                        >
                                            Gears
                                        </label>
                                        <textarea
                                            className="form-field-input"
                                            rows={3}
                                            id="gears"
                                            name={index}
                                            onChange={handleChangePhotoData}
                                            value={img.gears}
                                        ></textarea>
                                    </div>

                                    <div className="form-field">
                                        <label
                                            className="form-field-label"
                                            htmlFor="exif"
                                        >
                                            Exif
                                        </label>
                                        <textarea
                                            className="form-field-input"
                                            rows={3}
                                            id="exif"
                                            name={index}
                                            onChange={handleChangePhotoData}
                                            value={img.exif}
                                        ></textarea>
                                    </div>

                                    <div className="form-field">
                                        <label
                                            className="form-field-label"
                                            htmlFor="genre"
                                        >
                                            Genres
                                        </label>
                                        <div className="form-field-checkboxes">
                                            {GENRES.map((g, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className="form-field-checkbox"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="form-field-checkbox-input"
                                                            id={g + img._id}
                                                            name={g}
                                                            onChange={
                                                                handleChangePhotoGenre
                                                            }
                                                        />
                                                        <p
                                                            style={{
                                                                fontSize:
                                                                    "2rem",
                                                            }}
                                                        >
                                                            {g}
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <hr className="form-field-line" />
                                </div>
                            );
                        })}
                </div>

                <div className="btns-container">
                    <button className="btn btn-primary" type="submit">
                        Save Changes
                    </button>
                    <button className="btn btn-secondary" type="submit">
                        Reset Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default UploadEditPage;
