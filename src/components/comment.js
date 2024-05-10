import React from "react";
import { FaReply } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { AiFillHeart } from "react-icons/ai";
import { formatPostTimestamp } from "../utils/helpers";
import "../styles/comment.css";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { getUserDataById, answerToComment, getComment, likeComment, getCurrentUser, getEventComment } from "../utils/firebase";
import Loader from "./loader";
import fr from "../utils/i18n";
import ProfileImage from "./profileImage";
import { IoMdArrowBack } from "react-icons/io";
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

class Comment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReplying: false,
      replyContent: "",
      author: "bug",
      showReplies: false,
      comment: this.props.comment,
      liked: false,
      likeCount: 0,
      expandedImage: null,
    };
  }

  handleReply = () => {
    if (this.state.isReplying) {
      this.setState({ isReplying: false });
    } else {
      this.setState({ isReplying: true });
    }
  };

  handleInputChange = (event) => {
    this.setState({ replyContent: event.target.value });
  };

  handlePublishReply = () => {
    const { replyContent } = this.state;
    const { commentKey, postId } = this.props;
    // Vous pouvez implémenter ici la logique pour publier la réponse
    answerToComment(postId, commentKey, replyContent, this.props.event)
      .then(() => {
        if (!this.props.event) {
          getComment(postId, commentKey).then((comment) => {
            // Actualiser l'état des réponses
            this.setState((prevState) => ({
              comment: {
                ...prevState.comment,
                answers: comment.answers,
              },
            }));
            const promises = [];
            this.state.comment.answers.forEach(answer => {
              getUserDataById(answer.user).then((userData) => {
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
        } else {
          getEventComment(postId, commentKey).then((comment) => {
            // Actualiser l'état des réponses
            this.setState((prevState) => ({
              comment: {
                ...prevState.comment,
                answers: comment.answers,
              },
            }));
            const promises = [];
            this.state.comment.answers.forEach(answer => {
              getUserDataById(answer.user).then((userData) => {
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
      }
      );
    // Réinitialiser l'état de la réponse
    this.setState({ isReplying: false, replyContent: "" });
  };

  handleLike = () => {
    const { commentKey, postId, event } = this.props;
    likeComment(postId, commentKey, event).then(() => {
        getComment(postId, commentKey, event).then((comment) => {
          if (comment.likes && comment.likes.hasOwnProperty(getCurrentUser().uid)) {
            //this.state.liked = true;
            this.setState({ liked: true })
            this.setState({ likeCount: this.state.likeCount + 1})
          } else {
            this.setState({ liked: false })
            this.setState({ likeCount: this.state.likeCount - 1})
          }
          if (comment.likes !== undefined) {
            const likeCount = Object.keys(comment.likes).length;
            this.setState({ likeCount });
          } else {
            this.setState({ likeCount: 0})
          }
          this.setState({ comment })
        });
      
    });
  };

  handleShowReplies = () => {
    this.setState((prevState) => ({ showReplies: !prevState.showReplies }));
  };

  componentDidMount() {
    const { commentKey, postId } = this.props;
    // Vous pouvez implémenter ici la logique pour publier la réponse
      if (!this.props.event) {
        getComment(postId, commentKey).then((comment) => {
          // Actualiser l'état des réponses
          this.setState((prevState) => ({
            comment: {
              ...prevState.comment,
              answers: comment.answers,
            },
          }));
          if (comment.likes && comment.likes.hasOwnProperty(getCurrentUser().uid)) {
            this.setState({ liked: true });
          } else {
            this.setState({ liked: false });
          }
          if (comment.likes !== undefined) {
            const likeCount = Object.keys(comment.likes).length;
            this.setState({ likeCount });
          } else {
            this.setState({ likeCount: 0})
          }
          const promises = [];
          if (this.state.comment.answers === undefined) {
            return;
          }
          this.state.comment.answers.forEach(answer => {
            getUserDataById(answer.user).then((userData) => {
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
      } else {
        getEventComment(postId, commentKey).then((comment) => {
          // Actualiser l'état des réponses
          this.setState((prevState) => ({
            comment: {
              ...prevState.comment,
              answers: comment.answers,
            },
          }));
          if (comment.likes && comment.likes.hasOwnProperty(getCurrentUser().uid)) {
            this.setState({ liked: true });
          } else {
            this.setState({ liked: false });
          }
          if (comment.likes !== undefined) {
            const likeCount = Object.keys(comment.likes).length;
            this.setState({ likeCount });
          } else {
            this.setState({ likeCount: 0})
          }
          const promises = [];
          if (this.state.comment.answers === undefined) {
            return;
          }
          this.state.comment.answers.forEach(answer => {
            getUserDataById(answer.user).then((userData) => {
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
    }

  render() {
    const { comment } = this.state;
    const { isReplying, replyContent, showReplies } = this.state;

    const answers = this.state.comment.answers;

    if (this.state.author === "bug") {
      getUserDataById(comment.user).then((userData) => {
        this.setState({ 
          author: userData.name + " " + userData.surname 
        });
      });
      return null;
    }

    let isLiked = this.state.liked;
    if (comment.likes && comment.likes.hasOwnProperty(getCurrentUser().uid) && !isLiked) {
      isLiked = true;
    }

    return (
      <div className="comment" data-cy="comment">
        <div className="comment-thread">
        <Link to={`/profile/${comment.user}`} className="comment-author" data-cy='gotoProfile'>
          <ProfileImage uid={comment.user} post={true} />
          <div>
            <div className="comment-author">{this.state.author}</div>
            <div className="comment-timestamp">{formatPostTimestamp(comment.timestamp)}</div>
          </div>
        </Link>
        <div className="comment-content" data-cy="commentContent">{comment.content}</div>
        {comment.photos && (
          <div className="comment-photos">
            {comment.photos.map((photo, index) => (
              <div className="comment-photo">
                <img key={index} src={photo} alt="comment" onClick={() => this.props.handleImageClick(comment.photos, index)} />
              </div>
            ))}
          </div>
        )}
        {comment.gif && (
          <div className="comment-gif">
            <img src={comment.gif} alt="gif" />
          </div>
        )}
        <div className="comment-actions">
          <div className="classics-buttons"> {/* Nouveau div pour regrouper les éléments bouton répondre et texte pour afficher/masquer les réponses */}
              <button className="reply" data-cy="commentReply" onClick={this.handleReply}>
                <FaReply className="comment-icon" />
                {fr.POSTS.ANSWER}
              </button>
            <button className={`comment-like ${isLiked ? 'liked' : ''}`} data-cy="commentLikes" onClick={this.handleLike}>
              {isLiked ? <AiFillHeart /> : <AiOutlineHeart />} {this.state.likeCount} {this.state.likeCount > 1 ? fr.POSTS.LIKES : fr.POSTS.LIKE}
            </button>
            </div>
            {answers && answers.length > 0 && (
              <button className="comment-show-replies" onClick={this.handleShowReplies} data-cy='commentReplyResponse'>
                {showReplies ? "Masquer les réponses" : "Voir les réponses"}
              </button>
            )}
        </div>
        {isReplying && (
              <div className="reply-container">
                <input
                  type="text"
                  className="comment-reply-input"
                  value={replyContent}
                  onChange={this.handleInputChange}
                  data-cy="commentReply"
                  placeholder="Répondre..."
                  onKeyDown={(e) => { if (e.key === 'Enter') this.handlePublishReply() }}
                />
                <button className="comment-publish-reply" onClick={this.handlePublishReply} data-cy="commentReplyPost">
                  {fr.POSTS.PUBLISH}
                </button>
              </div>
            )}
        </div>
        {showReplies && answers && (
          <div className={'comment-replies '}>
            {answers.map((reply, index) => (
              <div className="comment-thread">
              <div className="comment-reply" key={reply.id}>
                <Link to={`/profile/${reply.user}`} className="comment-author">
                  <ProfileImage uid={reply.user} post={true}/>
                  <div>
                  <div className="comment-author">{reply.author}</div>
                  <div className="comment-timestamp">{formatPostTimestamp(reply.timestamp)}</div>
                  </div>
                </Link>
                <div className="comment-content">{reply.content}</div>
              </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Comment;
