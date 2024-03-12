import React, { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import "../styles/postInput.css";

export default function PostInput({ handlePostSubmit }) {
  const [postContent, setPostContent] = useState("");
  const [validationError, setValidationError] = useState("");

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (postContent.trim() !== "") {
        const contentWithLinks = renderContentWithLinks();
        handlePostSubmit(contentWithLinks);
      }
    }
  };

  const handleSubmit = () => {
    if (postContent.trim() !== "") {
      if (!isValidContent(postContent)) {
        setValidationError("Le contenu du post ne peut pas contenir de code JavaScript ou HTML.");
      } else {
        setValidationError("");
        const contentWithLinks = renderContentWithLinks();
        handlePostSubmit(contentWithLinks);
      }
    } else {
      setValidationError("Le contenu du post ne peut pas être vide.");
    }
  };

  const isValidContent = (content) => {
    const jsRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    const htmlRegex = /<[^>]+>/gi;
  
    return !jsRegex.test(content) && !htmlRegex.test(content);
  };

  const renderContentWithLinks = () => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    const contentWithLinks = postContent.replace(urlRegex, (url) => {
      return `<a href="${url}">${url}</a>`;
    });

    return contentWithLinks;
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
      <button className="post-submit-btn" onClick={handleSubmit}>
        <AiOutlineArrowRight />
      </button>
      {validationError && <div className="error-message">{validationError}</div>}
    </div>
  );
}