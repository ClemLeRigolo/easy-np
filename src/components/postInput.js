import React from "react";

import "../styles/postInput.css";

export default function PostInput({handlePostContentChange, handlePostSubmit, postContent}) {
  return <div className="passwordChecker">
    <textarea
    className="post-input"
    placeholder="Exprimez-vous..."
    value={postContent}
    onChange={handlePostContentChange}
  />
  <button className="post-submit-btn" onClick={handlePostSubmit}>
    Publier
  </button>
  </div>;
}
