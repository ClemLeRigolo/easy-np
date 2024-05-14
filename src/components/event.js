import React from "react";
import "../styles/post.css";
import { getCurrentUser, getUserDataById, addEventComment, getEventComments, reportEvent } from "../utils/firebase";
import { formatPostTimestamp, getEventStatus } from "../utils/helpers";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FaShareAlt } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Comment from "./comment";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import Loader from "./loader";
import ProfileImage from "./profileImage";
import { FaEllipsisH } from "react-icons/fa";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import { Modal } from '@mantine/core';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { MdDelete } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { MdOutlineDateRange } from "react-icons/md";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false,
      commentInputValue: "",
      expandedComments: false, // État pour gérer l'affichage des commentaires
      post: this.props.post,
      commentCollected: false,
      isReportModalOpen: false,
      modalLoading: false,
      reportReason: "spam",
      reportDetails: "",
    };
  }

  reportPost = () => {
    this.setState({ modalLoading: true })
    reportEvent(this.state.post.id, this.state.reportReason, this.state.reportDetails)
      .then(() => {
        NotificationManager.success("Post signalé avec succès !");
        this.setState({ isReportModalOpen: false, modalLoading: false });
      })
      .catch((error) => {
        NotificationManager.error("Erreur lors du signalement du post !");
        console.error("Error while reporting post:", error);
      });
  }

  handleReportDetailsChange = (e) => {
    this.setState({ reportDetails: e.target.value });
  }

  handleReportReasonChange = (e) => {
    this.setState({ reportReason: e.target.value });
  }

  openReportModal = () => {
    this.setState({ isReportModalOpen: true });
  }

  closeReportModal = () => {
    this.setState({ modalLoading: false, reportReason: "spam", reportDetails: "" })
    this.setState({ isReportModalOpen: false });
  }

  handleContextMenu = (e) => {
    if(this.state.contextTrigger) {
      this.state.contextTrigger.handleContextClick(e);
    }
  };

  handleShareClick = () => {
    const { post } = this.state;
    const postUrl = `/group/${post.groupId}/event/${post.id}`; // Remplacez par l'URL réelle vers le post
    //On récupère l'url de base
    const baseUrl = window.location.origin;
    //On enlève tout ce qu'il y a après le premier /
    const url = baseUrl.split("/")[0] + baseUrl.split("/")[1] + "//" + baseUrl.split("/")[2];
    const finalUrle = url + postUrl;
  
    navigator.clipboard.writeText(finalUrle)
      .then(() => {
        NotificationManager.success("URL copiée avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la copie de l'URL :", error);
        NotificationManager.error("Erreur lors de la copie de l'URL !");
      });
  };

  handleLikeClick = () => {
    // Logique de gestion du clic sur le bouton Like
    const { handleLikeClick } = this.props;
    handleLikeClick(this.state.post.id);
  };

  handleCommentClick = () => {
    // Logique de gestion du clic sur le bouton Comment
    if (this.state.showCommentInput) {
      this.setState({ showCommentInput: false });
      return;
    }
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
  
    addEventComment(post.id, commentInputValue)
      .then(() => {
        // Réinitialiser la zone de texte des commentaires
        this.setState({
          showCommentInput: false,
          commentInputValue: "",
        });
  
        // Attendre un court délai avant de récupérer les commentaires
        const delay = 50; // Délai en millisecondes
        return new Promise((resolve) => setTimeout(resolve, delay));
      })
      .then(() => {
        // Actualiser les commentaires après un court délai
        return getEventComments(post.id);
      })
      .then((comments) => {
        const promises = comments.map((comment) => {
          // On boucle sur les commentaires pour rajouter le nom d'utilisateur
          if (comment) {
            return getUserDataById(comment.user).then((user) => {
              comment.author = user.name + " " + user.surname;
              comment.profileImg = user.profileImg;
              comment.school = user.school;
              return comment;
            });
          } else {
            return null;
          }
        });
        return Promise.all(promises);
      })
      .then((updatedComments) => {
        this.setState((prevState) => ({
          post: {
            ...prevState.post,
            comments: updatedComments,
            commentCount: updatedComments.length,
          },
        }));
      })
      .catch((error) => {
        console.error("Erreur lors de l'ajout ou de la récupération des commentaires :", error);
      });
  };

  toggleCommentVisibility = () => {
    // Basculer l'affichage des commentaires
    this.setState((prevState) => ({
      expandedComments: !prevState.expandedComments,
    }));
  };

  handleDeletePost = () => {
    // Logique de suppression du post
    const { handleDeletePost } = this.props;
    handleDeletePost(this.state.post.id);
    NotificationManager.error("Post supprimé avec succès !");
  }

  componentDidMount() {
    const { post } = this.state;
  
    // Récupérer les commentaires à partir de la source de données (par exemple, Firebase)
    getEventComments(post.id)
      .then((comments) => {
        const promises = comments.map((comment) => {
          // On boucle sur les commentaires pour rajouter le nom d'utilisateur
          if (comment) {
            return getUserDataById(comment.user).then((user) => {
              comment.author = user.name + " " + user.surname;
              comment.profileImg = user.profileImg;
              comment.school = user.school;
              return comment;
            });
          } else {
            return null;
          }
        });
        return Promise.all(promises);
      })
      .then((updatedComments) => {
        this.setState((prevState) => ({
          post: {
            ...prevState.post,
            comments: updatedComments,
            commentCount: updatedComments.length,
          },
        }));
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des commentaires :", error);
      });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post !== this.props.post) {
      this.setState({ post: this.props.post });
    }
  }

  render() {
    const { likeCount } = this.props;
    const { showCommentInput, commentInputValue, expandedComments } = this.state;
    var isLiked = false;
    const post = this.state.post;
    const comments = post.comments || [];

    if (post.likes !== this.props.post.likes) {
      this.setState((prevState) => ({
        post: {
          ...prevState.post,
          likes: this.props.post.likes,
        },
      }));
    }

    if (post.likes !== undefined && post.likes.hasOwnProperty(getCurrentUser().uid)) {
      isLiked = true;
    }

    //on vérifie que le premier élément de comment a un attribut school défini

    if (post.comments && post.comments.length > 0 && !post.comments[0].hasOwnProperty("school")) {
        getEventComments(post.id)
      .then((comments) => {
        const promises = comments.map((comment) => {
          // On boucle sur les commentaires pour rajouter le nom d'utilisateur
          if (comment) {
            return getUserDataById(comment.user).then((user) => {
              comment.author = user.name + " " + user.surname;
              comment.profileImg = user.profileImg;
              comment.school = user.school;
              return comment;
            });
          } else {
            return null;
          }
        });
        return Promise.all(promises);
      })
      .then((updatedComments) => {
        this.setState((prevState) => ({
          commentCollected: true,
          post: {
            ...prevState.post,
            comments: updatedComments,
            commentCount: updatedComments.length,
          },
        }));
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des commentaires :", error);
      });
      return <Loader />;
    }

    const isMobile = window.innerWidth <= 768;
    const status = getEventStatus(post.start, post.end);

    return (
      <div className="post">
        <div className="post-header">
          <Link to={`/profile/${post.creator}`} className="post-username">
          <ProfileImage uid={post.creator} post={true} />
            <div>
              {post.username}
              <div className="post-date">{formatPostTimestamp(post.timestamp)}</div>
            </div>
          </Link>
          <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />
          <div className="post-status"><MdOutlineDateRange />{status}</div>
          <div className="post-menu">
          <ContextMenuTrigger
            id={post.id.toString()}
            ref={c => this.state.contextTrigger = c}
          >
            <FaEllipsisH className="post-options" onClick={(e) => this.handleContextMenu(e, post)} data-cy="postOptions"/>
          </ContextMenuTrigger>

          <ContextMenu id={post.id.toString()} className="context-menu">
          {(getCurrentUser().uid === post.creator || this.props.canModify) && (
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
              <h2 className="modal-title">Signaler l'évènement</h2>
              <form onSubmit={this.handleSubmitReport} className="modal-form">
                <label className="modal-label">
                  Raison du signalement :
                  <select value={this.state.reportReason} onChange={this.handleReportReasonChange} className="modal-select">
                    <option value="spam">Spam</option>
                    <option value="harassment">Harcèlement</option>
                    <option value="inappropriate">Contenu inapproprié</option>
                    <option value="vss">Violences sexuelles et sexistes</option>
                    <option value="other">Autre</option>
                  </select>
                </label>
                <label className="modal-label">
                  Détails supplémentaires (facultatif) :
                  <textarea value={this.state.reportDetails} onChange={this.handleReportDetailsChange} className="modal-textarea" />
                </label>
                <div className="modal-footer">
                  <button onClick={this.reportPost} className="modal-submit" >Signaler</button>
                  <button onClick={this.closeReportModal} className="modal-close-button">Close</button>
                </div>
              </form>
              </>
              }
            </Modal>
          </ContextMenu>
          </div>
        </div>
        {post.title && <Link to={`/group/${post.groupId}/event/${post.id}`} className="post-title"><h1>{post.title}</h1></Link>}
        <div className="post-status-mobile"><MdOutlineDateRange />{status}</div>
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.description }}></div>
        <div className="post-footer">
          <button className={`post-like-btn ${isLiked ? "liked" : ""}`} onClick={this.handleLikeClick}>
            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />} {likeCount} {likeCount > 1 ? fr.POSTS.LIKES : fr.POSTS.LIKE}
          </button>
          <button className="post-comment-btn" onClick={this.handleCommentClick}>
            <AiOutlineComment /> {post.commentCount} {post.commentCount > 1 ? fr.POSTS.COMMENTS : fr.POSTS.COMMENT}
          </button>
          <button className="post-share-btn" onClick={this.handleShareClick}>
            <FaShareAlt /> {fr.POSTS.SHARE}
          </button>
        </div>
        {showCommentInput && (
          <div className="comment-input">
            <input
              type="text"
              placeholder="Ajouter un commentaire"
              value={commentInputValue}
              onChange={this.handleCommentInputChange}
              className="comment-input-field"
            />
            <button className="comment-btn" onClick={this.handleCommentSubmit}>{fr.POSTS.PUBLISH}</button>
          </div>
        )}
        {comments.length > 0 && (
          <div className={`comments ${expandedComments ? "expanded" : ""}`}>
            <div className="comments-toggle" onClick={this.toggleCommentVisibility}>
              {expandedComments ? "" : "Voir les commentaires"}
              {expandedComments ? "" : <FaAngleDown className="icon" />}
            </div>
            {expandedComments && comments.map((comment, index) => (
              <Comment key={comment.id} comment={comment} commentKey={index} postId={post.id} event={true}/>
            ))}
            <div className="comments-toggle" onClick={this.toggleCommentVisibility}>
              {expandedComments ? "Réduire les commentaires" : ""}
              {expandedComments ? <FaAngleUp className="icon" /> : ""}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Event;