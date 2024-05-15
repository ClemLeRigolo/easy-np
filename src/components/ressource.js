import React from "react";
import "../styles/ressource.css";
import { getCurrentUser, reportRessource } from "../utils/firebase";
import { FaShareAlt } from "react-icons/fa";
import { FaAngleDown, FaAngleUp, FaFileArchive, FaFileCode, FaFilePdf, FaFileImage } from "react-icons/fa";
import Comment from "./comment";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import Loader from "./loader";
import { FaEllipsisH } from "react-icons/fa";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { NotificationManager } from "react-notifications";
import { Modal } from '@mantine/core';
import { MdDelete } from "react-icons/md";
import { FaFlag } from "react-icons/fa";

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
      isReportModalOpen: false,
      reportReason: "spam",
      reportDetails: "",
      modalLoading: false,
      contextTrigger: null,
    };
  }

  handleShareClick = () => {
    const { ressource: post } = this.state;
    const postUrl = `/course/${post.groupId}/ressource/${post.type}/${post.id}`; // Remplacez par l'URL réelle vers le post
    //On récupère l'url de base
    const baseUrl = window.location.origin;
    //On enlève tout ce qu'il y a après le premier /
    const url = baseUrl.split("/")[0] + baseUrl.split("/")[1] + "//" + baseUrl.split("/")[2];
    const finalUrle = url + postUrl;
  
    navigator.clipboard.writeText(finalUrle)
      .then(() => {
        console.log("URL copiée avec succès :", finalUrle);
        NotificationManager.success("URL copiée avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la copie de l'URL :", error);
        NotificationManager.error("Erreur lors de la copie de l'URL.");
      });
  };

  handleDeletePost = () => {
    // Logique de suppression du post
    const { handleDeletePost } = this.props;
    handleDeletePost(this.state.ressource.id);
  };

  handleContextMenu = (e) => {
    if(this.state.contextTrigger) {
      this.state.contextTrigger.handleContextClick(e);
    }
  };

  openReportModal = () => {
    this.setState({ isReportModalOpen: true });
  };

  closeReportModal = () => {
    this.setState({ isReportModalOpen: false });
  };

  reportRessource = () => {
    this.setState({ modalLoading: true });
    reportRessource(this.state.ressource.id, this.state.reportReason, this.state.reportDetails)
      .then(() => {
        this.setState({ isReportModalOpen: false, modalLoading: false });
        NotificationManager.success("Ressource signalée avec succès.");
      })
      .catch((error) => {
        console.error("Erreur lors du signalement de la ressource :", error);
        NotificationManager.error("Erreur lors du signalement de la ressource.");
      });
  };

  handleReportReasonChange = (e) => {
    this.setState({ reportReason: e.target.value });
  }

  handleReportDetailsChange = (e) => {
    this.setState({ reportDetails: e.target.value });
  }

  render() {
    const ressource = this.state.ressource;
    const isMobile = window.innerWidth <= 768;

    return (
      <div className="post" data-cy='ressource'>
        <div className="post-header">
          <div className="post-username">
            <div className="ressource-title">
              {ressource.name}
            </div>
          </div>
          <div className="post-menu">
          <ContextMenuTrigger
            id={ressource.id.toString()}
            ref={c => this.state.contextTrigger = c}
          >
            <FaEllipsisH className="post-options" onClick={(e) => this.handleContextMenu(e, ressource)} data-cy="postOptions"/>
          </ContextMenuTrigger>

          <ContextMenu id={ressource.id.toString()} className="context-menu">
          {(getCurrentUser().uid === ressource.user || this.props.canModify) && (
            <MenuItem onClick={this.handleDeletePost} className="menu-delete">{fr.POSTS.DELETE} <MdDelete /></MenuItem>
            )}
            <MenuItem onClick={this.handleShareClick} className="menu-item">{fr.POSTS.SHARE} <FaShareAlt /></MenuItem>
            <MenuItem onClick={this.openReportModal} style={{color: 'black'}} className="menu-item">{fr.POSTS.REPORT} <FaFlag /></MenuItem>
            <Modal
              opened={this.state.isReportModalOpen}
              onClose={this.closeReportModal}
              withCloseButton={false}
              className="modal"
              centered
              fullScreen={isMobile}
            >
              {this.state.modalLoading ? <Loader /> : 
              <>
              <h2 className="modal-title">Signaler la ressource</h2>
              <form onSubmit={this.handleSubmitReport} className="modal-form">
                <label className="modal-label">
                  Raison du signalement :
                  <select value={this.state.reportReason} onChange={this.handleReportReasonChange} className="modal-select">
                    <option value="spam">Spam</option>
                    <option value="harassment">Harcèlement</option>
                    <option value="inappropriate">Contenu inapproprié</option>
                    <option value="hs">Hors-sujet</option>
                    <option value="incorrect">Information incorrecte</option>
                    <option value="other">Autre</option>
                  </select>
                </label>
                <label className="modal-label">
                  Détails supplémentaires (facultatif) :
                  <textarea value={this.state.reportDetails} onChange={this.handleReportDetailsChange} className="modal-textarea" />
                </label>
                <div className="modal-footer">
                  <button onClick={this.reportRessource} className="modal-submit" >Signaler</button>
                  <button onClick={this.closeReportModal} className="modal-close-button">Close</button>
                </div>
              </form>
              </>
              }
            </Modal>
          </ContextMenu>
          </div>
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
            <FaShareAlt /> {fr.POSTS.SHARE}
          </button>
        </div>
      </div>
    );
  }
}

export default Ressource;
