function EachPhoto({ photo, owner }) {
    return (
        <div className="each-photo">
            <img
                src={photo.url}
                alt={owner.username}
                className="each-photo-img"
            />
            <div className="each-photo-footer">
                <p className="each-photo-footer-genre">{photo.genre}</p>
                {photo.soloDescription && <p>{photo.soloDescription}</p>}

                <div className="each-photo-footer-details">
                    <div className="each-photo-footer-details-field">
                        <label className="each-photo-footer-details-field-label">
                            Exif -
                        </label>
                        <p>{photo.exif}</p>
                    </div>
                    <div className="each-photo-footer-details-field">
                        <label className="each-photo-footer-details-field-label">
                            Gears -
                        </label>
                        <p>{photo.gears}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EachPhoto;
