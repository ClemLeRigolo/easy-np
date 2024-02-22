import React from "react";
import "../styles/postInput.css";

export default function PostInput({ handlePostContentChange, handlePostSubmit, postContent }) {
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handlePostSubmit();
    }
  };

  return (
    <div className="postInput">
      <textarea
        className="post-input"
        placeholder="Exprimez-vous..."
        value={postContent}
        onChange={handlePostContentChange}
        onKeyPress={handleKeyPress}
      />
      <button className="post-submit-btn" onClick={handlePostSubmit}>
        Publier
      </button>
    </div>
  );
}