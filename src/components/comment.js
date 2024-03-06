import React from "react";
import { FaReply } from "react-icons/fa";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

import "../styles/comment.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { getUserDataById } from "../utils/firebase";
import Loader from "./loader";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplying: false,
      replyContent: "",
      author: "bug",
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

    console.log("comment", comment);

    if (this.state.author === "bug") {
      getUserDataById(comment.user).then((userData) => {
        console.log("userData", userData);
        this.setState({ author: userData.name + " " + userData.surname });
      }
      );
      return <Loader />;
    }

    return (
      <div className="comment">
        <Link to={`/profile/${comment.user}`} className="comment-author">
        <div className="comment-author">{this.state.author}</div>
        </Link>
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