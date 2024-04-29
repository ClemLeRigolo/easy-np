import React from "react";
import "../styles/ressource.css";
import { getCurrentUser } from "../utils/firebase";
import { formatPostTimestamp } from "../utils/helpers";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FaShareSquare } from "react-icons/fa";
import { FaAngleDown, FaAngleUp, FaFileArchive, FaFileCode, FaFilePdf, FaFileImage } from "react-icons/fa";
import Comment from "./comment";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import Loader from "./loader";
import ProfileImage from "./profileImage";
import { FaEllipsisH } from "react-icons/fa";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

class Ressource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false,
      commentInputValue: "",
      expandedComments: false, // État pour gérer l'affichage des commentaires
      ressource: this.props.ressource,
      commentCollected: false,
      pollAnswers: [],
      pollSetted: false,
      vote: null,
    };
  }

  handleShareClick = () => {
    const { ressource: post } = this.state;
    const postUrl = `/group/${post.groupId}/event/${post.id}`; // Remplacez par l'URL réelle vers le post
    //On récupère l'url de base
    const baseUrl = window.location.origin;
    //On enlève tout ce qu'il y a après le premier /
    const url = baseUrl.split("/")[0] + baseUrl.split("/")[1] + "//" + baseUrl.split("/")[2];
    const finalUrle = url + postUrl;
  
    navigator.clipboard.writeText(finalUrle)
      .then(() => {
        console.log("URL copiée avec succès :", finalUrle);
        // Ajoutez ici une logique supplémentaire si nécessaire, par exemple, afficher un message de succès
      })
      .catch((error) => {
        console.error("Erreur lors de la copie de l'URL :", error);
        // Ajoutez ici une logique supplémentaire si nécessaire, par exemple, afficher un message d'erreur
      });
  };

  handleDeletePost = () => {
    // Logique de suppression du post
    const { handleDeletePost } = this.props;
    handleDeletePost(this.state.ressource.id);
  }

  render() {
    const ressource = this.state.ressource;

    return (
      <div className="post">
        <div className="post-header">
          <div className="post-username">
            <div className="ressource-title">
              {ressource.name}
              {/* <div className="post-date">{formatPostTimestamp(ressource.date)}</div> */}
            </div>
          </div>
          {(getCurrentUser().uid === ressource.creator || this.props.canModify) && (
          <div className="post-menu">
          <ContextMenuTrigger id={ressource.id}>
            <FaEllipsisH className="post-options" />
          </ContextMenuTrigger>

          <ContextMenu id={ressource.id}>
            <MenuItem onClick={this.handleDeletePost}>{fr.POSTS.DELETE}</MenuItem>
          </ContextMenu>
          </div>)}
        </div>
        {ressource.title && <Link to={`/group/${ressource.groupId}/event/${ressource.id}`} className="post-title"><h1>{ressource.title}</h1></Link>}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: ressource.description }}></div>
        <div className="ressource-list">
          {ressource.urls && ressource.urls.map((url, index) => {
            let fileName = url.split("%2F").pop();
            fileName = fileName.split("?")[0];
            return (
              <a href={url} key={index} className="ressource" target="_blank" rel="noopener noreferrer">
                {url.includes(".pdf") ? <FaFilePdf /> : url.includes(".zip") || url.includes(".tar") || url.includes(".gz") ? <FaFileArchive /> : url.includes(".jpg") || url.includes(".png") || url.includes(".jpeg") ? <FaFileImage /> : <FaFileCode />}
                <p className="ressource-name">{fileName}</p>
              </a>
            );
          }
          )}
        </div>
        <div className="post-footer">
          <button className="post-share-btn" data-cy="share" onClick={this.handleShareClick}>
            <FaShareSquare /> {fr.POSTS.SHARE}
          </button>
        </div>
      </div>
    );
  }
}

export default Ressource;