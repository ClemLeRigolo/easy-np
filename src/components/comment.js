import React from "react";
import { FaReply } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";

import "../styles/comment.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { getUserDataById, answerToComment } from "../utils/firebase";
import Loader from "./loader";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplying: false,
      replyContent: "",
      author: "bug",
      showReplies: false,
      comment: this.props.comment,
      answers: this.props.comment.answers,
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
    const { commentKey, postId } = this.props;
    console.log(commentKey)
    // Vous pouvez implémenter ici la logique pour publier la réponse
    answerToComment(postId, commentKey, replyContent)
      .then((comment) => {
        console.log("Réponse publiée :", replyContent);
        // Actualiser l'état des réponses
        this.setState((prevState) => ({
          comment: {
            ...prevState.comment,
            answers: [...(prevState.comment.answers || []), comment],
          },
        }));
        console.log(this.state.comment);
      }
      );
    // Réinitialiser l'état de la réponse
    this.setState({ isReplying: false, replyContent: "" });
  };

  handleShowReplies = () => {
    this.setState((prevState) => ({ showReplies: !prevState.showReplies }));
  };

  render() {
    const { comment, commentKey } = this.props;
    const { isReplying, replyContent, showReplies, answers } = this.state;

    console.log("comment", comment);

    console.log(answers);

    if (this.state.author === "bug") {
      getUserDataById(comment.user).then((userData) => {
        console.log("userData", userData);
        this.setState({ author: userData.name + " " + userData.surname });
      });
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
          <div className="classics-buttons"> {/* Nouveau div pour regrouper les éléments bouton répondre et texte pour afficher/masquer les réponses */}
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
              <button className="reply" onClick={this.handleReply}>
                Répondre
                <FaReply className="comment-icon" />
              </button>
            )}
            <button className="comment-like">
              <AiOutlineHeart className="comment-icon" />
            </button>
            </div>
            {answers && answers.length > 0 && (
              <button className="comment-show-replies" onClick={this.handleShowReplies}>
                {showReplies ? "Masquer les réponses" : "Voir les réponses"}
              </button>
            )}
        </div>
        {showReplies && answers && (
          <div className="comment-replies">
            {answers.map((reply, index) => (
              <div className="comment-reply" key={reply.id}>
                <Link to={`/profile/${reply.user}`} className="comment-author">
                  <div className="comment-author">{reply.author}</div>
                </Link>
                <div className="comment-content">{reply.content}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Comment;