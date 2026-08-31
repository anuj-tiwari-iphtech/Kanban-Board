import { HiOutlineThumbUp, HiThumbUp } from "react-icons/hi";

export default function CommentThread({ 
  comment, 
  depth = 0, 
  onLike, 
  onReplyClick, 
  activeReplyId, 
  replyInput, 
  setReplyInput, 
  onSubmitReply,
  currentUserAvatar 
}) {
  return (
    <div className="comment-thread" style={{ marginLeft: depth > 0 ? "24px" : "0" }}>
      <div className="comment-item">
        <img src={comment.avatar} alt={comment.name} className="comment-avatar" />
        <div className="comment-body">
          <div className="comment-meta">
            <span className="comment-name">{comment.name}</span>
            <span className="comment-time">{comment.time}</span>
          </div>
          <p className="comment-text">{comment.text}</p>
          <div className="comment-actions">
            <button
              className={`comment-action-btn ${comment.liked ? "liked" : ""}`}
              onClick={() => onLike(comment.id)}
            >
              {comment.liked ? <HiThumbUp /> : <HiOutlineThumbUp />}
              {comment.likes > 0 ? ` (${comment.likes})` : ""}
            </button>
            <button 
              className="comment-action-btn"
              onClick={() => onReplyClick(comment.id)}
            >
              Reply
            </button>
          </div>

          {activeReplyId === comment.id && (
            <div className="reply-input-row">
              <img src={currentUserAvatar} alt="you" className="comment-avatar small" />
              <input
                type="text"
                className="comment-input"
                placeholder={`Reply to ${comment.name}...`}
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSubmitReply(comment.id);
                }}
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="nested-replies">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              onLike={onLike}
              onReplyClick={onReplyClick}
              activeReplyId={activeReplyId}
              replyInput={replyInput}
              setReplyInput={setReplyInput}
              onSubmitReply={onSubmitReply}
              currentUserAvatar={currentUserAvatar}
            />
          ))}
        </div>
      )}
    </div>
  );
}