import React, { useState } from "react";
import { AiOutlineCloseCircle, AiOutlineArrowRight, AiOutlineCamera, AiOutlineBarChart, AiOutlineGif, AiOutlineVideoCamera } from "react-icons/ai";
import "../styles/postInput.css";
import DOMPurify from "dompurify";
import { compressImage } from "../utils/helpers";

export const containsHtml = (content) => {
  const sanitizedContent = DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
  return sanitizedContent !== content;
};

export const replaceLinksAndTags = (content) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;

  const contentWithLineBreaks = content.replace(/\n/g, "<br>");

  const contentWithLinks = contentWithLineBreaks.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank">${url}</a>`;
  });

  return contentWithLinks;
};

export default function PostInput({ handlePostSubmit }) {
  const [postContent, setPostContent] = useState("");
  const [validationError, setValidationError] = useState("");
  const [photos, setPhotos] = useState([]);
  const [pollOptions, setPollOptions] = useState([]);
  const [showPoll, setShowPoll] = useState(false);

  const togglePoll = () => {
    setShowPoll(!showPoll);
    if (!showPoll) {
      setPollOptions(["", ""]); // Ajouter deux options de sondage par défaut lorsque vous basculez pour afficher les options
    } else {
      setPollOptions([]); // Réinitialiser les options de sondage lors du basculement pour masquer les options
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const deletePollOption = (index) => {
    const updatedOptions = [...pollOptions];
    updatedOptions.splice(index, 1);
    setPollOptions(updatedOptions);
    if (updatedOptions.length === 1) {
      setShowPoll(false);
    }
  };

  const updatePollOption = (index, value) => {
    const updatedOptions = [...pollOptions];
    updatedOptions[index] = value;
    setPollOptions(updatedOptions);
  };

  const validatePollOption = () => {
    const isEmpty = pollOptions.every((option) => option.trim() === "");
    return isEmpty;
  };

  const handlePostContentChange = (event) => {
    setPostContent(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (postContent.trim() !== "") {
      if (containsHtml(postContent)) {
        setValidationError("Le contenu du post ne peut pas contenir de code HTML.");
      } else {
        const finalContent = replaceLinksAndTags(postContent);
        if (validatePollOption()) {
          setValidationError("Veuillez saisir au moins une option de sondage.");
          return;
        }
        const compressedImagesPromises = photos.map((photo) => compressImage(photo.file));
        
        Promise.all(compressedImagesPromises)
          .then((compressedImages) => {
            handlePostSubmit(finalContent, compressedImages, pollOptions);
            setPhotos([]);
            setPostContent("");
            setValidationError("");
            setPollOptions([]); // Réinitialiser les options de sondage après la soumission
          })
          .catch((error) => {
            console.error("Erreur lors de la compression des images :", error);
            setValidationError("Une erreur s'est produite lors de la compression des images.");
          });
      }
    } else {
      setValidationError("Le contenu du post ne peut pas être vide.");
    }
  };

  const handlePhotoImport = (event) => {
    const files = event.target.files;
    const selectedPhotos = [];
  
    console.log(files);

    if (files.length > 4) {
      setValidationError("Vous ne pouvez importer que 4 photos à la fois.");
      setPhotos([]);
      return;
    }
  
    for (let i = 0; i < files.length && i < 4; i++) {
      const file = files[i];
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const photoData = {
          name: file.name,
          dataURL: e.target.result,
          file: file,
        };
        selectedPhotos.push(photoData);
  
        if (selectedPhotos.length === files.length) {
          setPhotos(selectedPhotos);
        }
      };
  
      reader.readAsDataURL(file);
    }
  };

  const handleCameraIconClick = () => {
    document.getElementById("photo-input").click();
  };

  const handleDeletePhoto = (index) => {
    const updatedPhotos = [...photos];
    updatedPhotos.splice(index, 1);
    setPhotos(updatedPhotos);
  };

  return (
    <div className="post-wrapper">
    <div className="postInput">
      <div className="post-input-wrapper">
        <textarea
          className="post-input"
          placeholder="Exprimez-vous..."
          value={postContent}
          onChange={handlePostContentChange}
          onKeyPress={handleKeyPress}
          style={{ whiteSpace: "pre-wrap" }}
        />
        {showPoll && (
          <div className="poll-options-wrapper">
            {pollOptions.map((option, index) => (
              <div key={index} className="poll-option">
                <input
                  type="text"
                  className="poll-option-input"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(event) => updatePollOption(index, event.target.value)}
                />
                <div className="delete-poll-option" onClick={() => deletePollOption(index)}>
                  <AiOutlineCloseCircle />
                </div>
              </div>
            ))}
            {pollOptions.length < 4 && (
              <div className="add-poll-option" onClick={addPollOption}>
                +
              </div>
            )}
          </div>
        )}
        <div className="post-input-icons">
          <div className="post-input-icon" onClick={handleCameraIconClick}>
            <AiOutlineCamera />
          </div>
          <div className="post-input-icon" onClick={togglePoll}>
            {showPoll ? <AiOutlineCloseCircle /> : <AiOutlineBarChart />}
          </div>
          <div className="post-input-icon">
            <AiOutlineGif />
          </div>
          <div className="post-input-icon">
            <AiOutlineVideoCamera />
          </div>
        </div>
      </div>
      <button className="post-submit-btn" onClick={handleSubmit}>
        <AiOutlineArrowRight />
      </button>
      </div>
      <div className="photos-preview">
      {photos.map((photo, index) => (
        <div key={index} style={{ marginBottom: '10px', position: 'relative' }}>
          <img
            src={photo.dataURL}
            alt={photo.name}
            style={{ maxWidth: '100%', maxHeight: '10vh', borderRadius: '5px', objectFit: 'cover'}}
          />
          <div
            className="delete-icon"
            onClick={() => handleDeletePhoto(index)}
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              borderRadius: '50%',
              padding: '5px',
              cursor: 'pointer',
            }}
          >
            <AiOutlineCloseCircle style={{ color: 'red', fontSize: '18px' }} />
          </div>
        </div>
      ))}
      </div>
      {validationError && <div className="error-message">{validationError}</div>}
      <input type="file" id="photo-input" multiple accept="image/*" onChange={handlePhotoImport} style={{ display: "none" }} />
    </div>
  );
}