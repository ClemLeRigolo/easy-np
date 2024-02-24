import React from "react";
import { FaReply } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import "../styles/comment.css";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplying: false,
      replyContent: ""
    };
  }

  handleReply = () => {
    this.setState({ isReplying: true });
  };

  handleInputChange = (event) => {
    this.setState({ replyContent: event.target.value });
  };

  handlePublishReply = () => {
    const { replyContent } = this.state;
    // Vous pouvez implémenter ici la logique pour publier la réponse
    console.log("Réponse publiée :", replyContent);
    // Réinitialiser l'état de la réponse
    this.setState({ isReplying: false, replyContent: "" });
  };

  render() {
    const { comment } = this.props;
    const { isReplying, replyContent } = this.state;

    return (
      <div className="comment">
        <div className="comment-author">{comment.author}</div>
        <div className="comment-content">{comment.content}</div>
        <div className="comment-timestamp">{new Date(comment.timestamp).toLocaleTimeString()}</div>
        <div className="comment-actions">
          {isReplying ? (
            <div>
              <input
                type="text"
                className="comment-reply-input"
                value={replyContent}
                onChange={this.handleInputChange}
                placeholder="Répondre..."
              />
              <button className="comment-publish-reply" onClick={this.handlePublishReply}>
                Publier
              </button>
            </div>
          ) : (
            <button className="comment-reply" onClick={this.handleReply}>
              Répondre
              <FaReply className="comment-icon" />
            </button>
          )}
          <button className="comment-like">
            <AiOutlineHeart className="comment-icon" />
          </button>
        </div>
      </div>
    );
  }
}

export default Comment;