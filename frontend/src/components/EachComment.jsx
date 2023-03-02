export default function EachComment({ comment }) {
    return (
        <div className="each-comment">
            <div className="each-comment-user-img-wrapper">
                <img
                    src={comment.commentedBy.profileImage}
                    alt={comment.commentedBy.username}
                    className="each-comment-user-img"
                />
            </div>
            <div className="each-comment-user-and-comment">
                <p className="each-comment-user-name">
                    {comment.commentedBy.username}
                </p>
                <p>{comment.comment}</p>
            </div>
        </div>
    );
}
