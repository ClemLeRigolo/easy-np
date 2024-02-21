import React from "react";

import "../styles/post.css";

export default function Post({index, post, handleLikeClick, handleCommentClick, likeCount, commentCount}) {
  return <div className="post" key={index}>
  <div className="post-header">
    <img src={require("../images/avatar.png")} alt="Avatar" className="post-avatar" />
    <div className="post-username">{post.username}</div>
    <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />            
  </div>
  <div className="post-body">
    {post.content}
  </div>
  <div className="post-footer">
    <button className="post-like-btn" onClick={handleLikeClick}>
      Like ({likeCount})
    </button>
    <button className="post-comment-btn" onClick={handleCommentClick}>
      Comment ({commentCount})
    </button>
  </div>
</div>;
}
