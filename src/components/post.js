import React from "react";
import "../styles/post.css";
import { getCurrentUser } from "../utils/firebase";

class Post extends React.Component {
  handleLikeClick = () => {
    // Logique de gestion du clic sur le bouton Like
    const { post, handleLikeClick } = this.props;
    handleLikeClick(post.index);
    this.render();
  };

  handleCommentClick = () => {
    // Logique de gestion du clic sur le bouton Comment
    const { post, handleCommentClick } = this.props;
    handleCommentClick(post.index);
  };

  render() {
    const { post, likeCount, commentCount } = this.props;
    var isLiked = false;
    console.log(post);
    console.log("---------------------")
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
            Like ({likeCount})
          </button>
          <button className="post-comment-btn" onClick={this.handleCommentClick}>
            Comment ({commentCount})
          </button>
        </div>
      </div>
    );
  }
}

export default Post;