import React from "react";
import "../styles/post.css";
import { getCurrentUser, addComment } from "../utils/firebase";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false,
      commentInputValue: "",
    };
  }

  handleLikeClick = () => {
    // Logique de gestion du clic sur le bouton Like
    const { post, handleLikeClick } = this.props;
    handleLikeClick(post.index);
  };

  handleCommentClick = () => {
    // Logique de gestion du clic sur le bouton Comment
    this.setState({ showCommentInput: true });
  };

  handleCommentInputChange = (e) => {
    // Logique de mise à jour de la valeur de l'entrée de commentaire
    this.setState({ commentInputValue: e.target.value });
  };

  handleCommentSubmit = () => {
    // Logique de soumission du commentaire
    const { post } = this.props;
    const { commentInputValue } = this.state;

    addComment(post.id, commentInputValue)
        .then(() => {
            console.log("Commentaire ajouté avec succès");
        })
        .catch((error) => {
            console.error("Erreur lors de l'ajout du commentaire :", error);
        });

    // Réinitialiser la zone de texte des commentaires
    this.setState({
      showCommentInput: false,
      commentInputValue: "",
    });
  };

  render() {
    const { post, likeCount, commentCount } = this.props;
    const { showCommentInput, commentInputValue } = this.state;
    var isLiked = false;

    if (post.likes != undefined && post.likes.hasOwnProperty(getCurrentUser().uid)) {
      isLiked = true;
    }

    return (
      <div className="post">
        <div className="post-header">
          <img src={require("../images/avatar.png")} alt="Avatar" className="post-avatar" />
          <div className="post-username">{post.username}</div>
          <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />
        </div>
        <div className="post-body">{post.content}</div>
        <div className="post-footer">
          <button className={`post-like-btn ${isLiked ? "liked" : ""}`} onClick={this.handleLikeClick}>
            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />} {likeCount}
          </button>
          <button className="post-comment-btn" onClick={this.handleCommentClick}>
            <AiOutlineComment /> {commentCount}
          </button>
        </div>
        {showCommentInput && (
          <div className="comment-input">
            <input
              type="text"
              placeholder="Ajouter un commentaire"
              value={commentInputValue}
              onChange={this.handleCommentInputChange}
            />
            <button className="comment-btn" onClick={this.handleCommentSubmit}>Publier</button>
          </div>
        )}
      </div>
    );
  }
}

export default Post;