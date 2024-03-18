import React, { useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import "../styles/postInput.css";
import DOMPurify from "dompurify";

export default function PostInput({ handlePostSubmit }) {
  const [postContent, setPostContent] = useState("");
  const [validationError, setValidationError] = useState("");

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (postContent.trim() !== "") {
      if (containsHtml(postContent)) {
        setValidationError("Le contenu du post ne peut pas contenir de code HTML.");
      } else {
        const finalContent = replaceLinksAndTags(postContent);
        handlePostSubmit(finalContent);
        setPostContent("");
        setValidationError("");
      }
    } else {
      setValidationError("Le contenu du post ne peut pas être vide.");
    }
  };

  const containsHtml = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
    return sanitizedContent !== content;
  };

  const replaceLinksAndTags = (content) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    console.log("content", content);

    const parser = new DOMParser();
    //const doc = parser.parseFromString(content, "text/html");

    //console.log("doc", doc);
    //const plainText = doc.body.textContent;

    //console.log("plainText", plainText);

    const contentWithLineBreaks = content.replace(/\n/g, "<br>");

    const contentWithLinks = contentWithLineBreaks.replace(urlRegex, (url) => {
      return `"${url}"`;
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
        style={{ whiteSpace: "pre-wrap" }}
      />
      <button className="post-submit-btn" onClick={handleSubmit}>
        <AiOutlineArrowRight />
      </button>
      {validationError && <div className="error-message">{validationError}</div>}
    </div>
  );
}