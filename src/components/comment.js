import React from "react";
import { FaReply } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";

import "../styles/comment.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { getUserDataById, answerToComment, getComment } from "../utils/firebase";
import Loader from "./loader";
import fr from "../utils/i18n";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplying: false,
      replyContent: "",
      author: "bug",
      showReplies: false,
      comment: this.props.comment,
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
      .then(() => {
        getComment(postId, commentKey).then((comment) => {
          console.log("Réponse publiée :", comment);
          // Actualiser l'état des réponses
          this.setState((prevState) => ({
            comment: {
              ...prevState.comment,
              answers: comment.answers,
            },
          }));
          console.log(this.state.comment);
          const promises = [];
          console.log(this.state.comment.answers)
          this.state.comment.answers.forEach(answer => {
            getUserDataById(answer.user).then((userData) => {
              console.log("userData", userData);
              answer.author = userData.name + " " + userData.surname;
              answer.profileImg = userData.profileImg;
              answer.school = userData.school;
              promises.push(answer);
            }
            );
          });
          Promise.all(promises).then((answers) => {
            this.setState({ answers });
          });
        });
      }
      );
    // Réinitialiser l'état de la réponse
    this.setState({ isReplying: false, replyContent: "" });
  };

  handleShowReplies = () => {
    this.setState((prevState) => ({ showReplies: !prevState.showReplies }));
  };

  componentDidMount() {
    const { replyContent } = this.state;
    const { commentKey, postId } = this.props;
    console.log(commentKey)
    // Vous pouvez implémenter ici la logique pour publier la réponse
        getComment(postId, commentKey).then((comment) => {
          console.log("Réponse publiée :", comment);
          // Actualiser l'état des réponses
          this.setState((prevState) => ({
            comment: {
              ...prevState.comment,
              answers: comment.answers,
            },
          }));
          console.log(this.state.comment);
          const promises = [];
          console.log(this.state.comment.answers)
          if (this.state.comment.answers === undefined) {
            return;
          }
          this.state.comment.answers.forEach(answer => {
            getUserDataById(answer.user).then((userData) => {
              console.log("userData", userData);
              answer.author = userData.name + " " + userData.surname;
              answer.profileImg = userData.profileImg;
              answer.school = userData.school;
              promises.push(answer);
            }
            );
          });
          Promise.all(promises).then((answers) => {
            this.setState({ answers });
          });
        });
    }

  render() {
    const { comment } = this.props;
    const { isReplying, replyContent, showReplies } = this.state;

    const answers = this.state.comment.answers;

    console.log("comment", comment);

    console.log(answers);

    if (this.state.author === "bug") {
      getUserDataById(comment.user).then((userData) => {
        this.setState({ 
          author: userData.name + " " + userData.surname 
        });
      });
      return <Loader />;
    }

    console.log("comment", comment);
    console.log("school", comment.school);

    return (
      <div className="comment">
        <Link to={`/profile/${comment.user}`} className="comment-author">
          {comment.profileImg ? (
              <img src={comment.profileImg} alt="Profile" className="post-avatar"/>
            ) : (
              <img src={require(`../images/Profile-pictures/${comment.school}-default-profile-picture.png`)} alt="Profile" className="post-avatar" />
            )
            }
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
                  {fr.POSTS.PUBLISH}
                </button>
              </div>
            ) : (
              <button className="reply" onClick={this.handleReply}>
                {fr.POSTS.ANSWER}
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
                  {reply.profileImg ? (
                      <img src={reply.profileImg} alt="Profile" className="post-avatar"/>
                    ) : (
                      <img src={require(`../images/Profile-pictures/${reply.school}-default-profile-picture.png`)} alt="Profile" className="post-avatar" />
                    )}
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