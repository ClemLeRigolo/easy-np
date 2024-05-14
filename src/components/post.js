import React from "react";
import "../styles/post.css";
import { getCurrentUser, addComment, getComments, getImagesFromPost, getUserDataById, voteFor, reportPost } from "../utils/firebase";
import { formatPostTimestamp } from "../utils/helpers";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FaShareSquare } from "react-icons/fa";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Comment from "./comment";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import Loader from "./loader";
import ProfileImage from "./profileImage";
import { FaEllipsisH } from "react-icons/fa";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Poll from 'react-polls';
import { MdDelete } from "react-icons/md";
import { FaShareAlt } from "react-icons/fa";
import { FaFlag } from "react-icons/fa";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import PinchZoomPan from 'react-responsive-pinch-zoom-pan';
import { AiOutlineCamera, AiOutlineBarChart, AiOutlineGif, AiOutlineVideoCamera, AiOutlineCloseCircle } from "react-icons/ai";
import { SearchExperience } from "./gif";
import { compressImage } from "../utils/helpers";
import { Modal } from '@mantine/core';
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false,
      commentInputValue: "",
      expandedComments: false, // État pour gérer l'affichage des commentaires
      post: this.props.post,
      commentCollected: false,
      pollAnswers: [],
      pollSetted: false,
      vote: null,
      expandedImage: null,
      expandedImages: [],
      imageIndex: 0,
      contextTrigger: null,
      photos: [],
      selectedGif: null,
      showGifSearch: false,
      validationError: false,
      selectedOption: null,
      isReportModalOpen: false,
      modalLoading: false,
      reportReason: "spam",
      reportDetails: "",
    };
  }

  reportPost = () => {
    this.setState({ modalLoading: true })
    reportPost(this.state.post.id, this.state.reportReason, this.state.reportDetails)
      .then(() => {
        NotificationManager.success("Post signalé avec succès !");
        this.setState({ isReportModalOpen: false, modalLoading: false });
      })
      .catch((error) => {
        NotificationManager.error("Erreur lors du signalement du post.");
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

  handleShareClick = () => {
    const { post } = this.state;
    const postUrl = `/post/${post.id}`; // Remplacez par l'URL réelle vers le post
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
        NotificationManager.error("Erreur lors de la copie de l'URL.");
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

  handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleCommentSubmit();
    }
  }

  handleCommentSubmit = () => {
    // Logique de soumission du commentaire
    const { post } = this.props;
    const { commentInputValue, photos, selectedGif } = this.state;

    const compressedImagesPromises = photos.map((photo) => compressImage(photo.file));
        
    Promise.all(compressedImagesPromises).then((compressedImagesPromises) => {    
      addComment(post.id, commentInputValue, compressedImagesPromises, selectedGif ? selectedGif.images.original.url : null)
        .then(() => {
          // Réinitialiser la zone de texte des commentaires
          this.setState({
            showCommentInput: false,
            commentInputValue: "",
          });
    
          // Attendre un court délai avant de récupérer les commentaires
          const delay = 2000; // Délai en millisecondes
          return new Promise((resolve) => setTimeout(resolve, delay));
        })
        .then(() => {
          // Actualiser les commentaires après un court délai
          return getComments(post.id);
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
    }
    );
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

  handleImageClick = (images, index) => {
    const image = images ? images[index] : null;
    this.setState({ 
      expandedImage: image,
      expandedImages: images,
      imageIndex: index,
    });
    if (image !== null) {
      //bloquer le scroll
      // Get the current page scroll position
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop;
      let scrollLeft =
        window.pageXOffset ||
        document.documentElement.scrollLeft;

        // if any scroll is attempted,
        // set this to the previous value
        window.onscroll = function () {
            window.scrollTo(scrollLeft, scrollTop);
        };
    } else {
      //débloquer le scroll
      window.onscroll = function () { };
    }
  }

  navigateToImage = (index) => {
    this.setState({ 
      expandedImage: this.state.expandedImages[index],
      imageIndex: index,
    });
  }

  componentDidMount() {
    const { post } = this.state;
  
    // Récupérer les commentaires à partir de la source de données (par exemple, Firebase)
    getComments(post.id)
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
      this.setState({ 
        post: this.props.post,
        pollSetted: false,
        pollAnswers: [],
        vote: null,
      });
      getImagesFromPost(this.props.post.id)
      .then((images) => {
        this.setState((prevState) => ({
          post: {
            ...prevState.post,
            images: images || undefined,
          },
        }));
      })
    }
  }

  handleVote = (answer) => {
    const { pollAnswers } = this.state;
    const newPollAnswers = pollAnswers.map((pollAnswer,index) => {
      if (pollAnswer.option === answer) {
        pollAnswer.votes += 1;
        voteFor(this.state.post.id, index);
      }
      return pollAnswer;
    });
  }

  handleContextMenu = (e) => {
    if(this.state.contextTrigger) {
      this.state.contextTrigger.handleContextClick(e);
    }
  };

  handleCameraIconClick = () => {
    this.setState({ 
      selectedOption: "images",
      showGifSearch: false,
      selectedGif: null,
    });
    document.getElementById("photo-input-" + this.props.post.id).click();
  }

  handleDeletePhoto = (index) => {
    const { photos } = this.state;
    photos.splice(index, 1);
    this.setState({ photos });
  }

  handlePhotoImport = (e) => {
    const { photos } = this.state;
    const files = e.target.files;
    const promises = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const promise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({ dataURL: e.target.result, name: file.name, file: file});
        };
        reader.readAsDataURL(file);
      });
      promises.push(promise);
    }
    Promise.all(promises)
      .then((photos) => {
        this.setState({ photos });
      });
  }

  toggleGifSearch = () => {
    this.setState((prevState) => ({
      showGifSearch: !prevState.showGifSearch,
      selectedOption: "gif",
      photos: [],
    }));
  }

  setSelectedGif = (gif) => {
    this.setState({ selectedGif: gif });
  }

  handleDeleteGif = () => {
    this.setState({ selectedGif: null });
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
      getComments(post.id)
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
      /*getImagesFromPost(post.id)
      .then((images) => {
        this.setState((prevState) => ({
          post: {
            ...prevState.post,
            images: images || undefined,
          },
        }));
      })*/
      return <Loader />;
    }

    if (post.pool && !this.state.pollSetted) {
      for (let i = 0; i < post.pool.length; i++) {
        this.state.pollAnswers.push({ option: post.pool[i], votes: post.poolObj[i] });
      }
      this.setState({ pollSetted: true });
    }

    if (post.voters) {
      for (let i = 0; i < post.pool.length; i++) {
        if (post.voters[i] && post.voters[i].includes(getCurrentUser().uid)) {
          //this.setState({ vote: post.pool[i] });
          this.state.vote = post.pool[i];
        }
      }
    }

    const pollStyles1 = {
      align: 'center',
      theme: 'blue'
    }

    const isMobile = window.innerWidth <= 768;

    return (
      <div className="post" data-cy="post">
          <div 
          className={`overlay ${this.state.expandedImage ? 'visible' : ''}`}
          onClick={() => this.handleImageClick(null)}
          >
            <div className="expanded-image-header">
            <Link to={`/profile/${post.user}`} className="expanded-username">
              <ProfileImage uid={post.user} post={true} />
              <div>
                <p>{post.username}</p>
              </div>
            </Link>
            <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />
            </div>
            <div className={`expanded-image-content ${this.state.expandedImage ? 'visible' : ''}`}>
            <PinchZoomPan position={'center'} initialScale={'auto'} maxScale={4} >
              <img 
                src={this.state.expandedImage}
                className={`expanded-image ${this.state.expandedImage ? 'visible' : ''}`}
                alt="Expanded"
              />
          </PinchZoomPan>
          </div>
          <div 
              className="back-arrow"
              onClick={(e) => {
                e.stopPropagation();
                this.handleImageClick(null);
              }}
              data-cy="return"
            >
            <IoMdArrowBack />
          </div>
          {this.state.expandedImages && this.state.expandedImages.length > 1 && this.state.imageIndex !== 0 && (
          <div 
            className="previous-arrow"
            onClick={(e) => {
              e.stopPropagation();
              this.navigateToImage(this.state.imageIndex - 1);
            }}
            data-cy="return"
          >
            <IoMdArrowBack />
          </div>
          )}
          {this.state.expandedImages && this.state.expandedImages.length > 1 && this.state.imageIndex !== this.state.expandedImages.length - 1 && (
          <div 
            className="next-arrow"
            onClick={(e) => {
              e.stopPropagation();
              this.navigateToImage(this.state.imageIndex + 1);
            }}
            data-cy="return"
          >
            <IoMdArrowForward />
          </div>
          )}
        </div>
        <div className="post-header">
          <Link to={`/profile/${post.user}`} className="post-username" data-cy='postHeader'>
          <ProfileImage uid={post.user} post={true} />
            <div>
              <p>{post.username}</p>
              <div className="post-date">{formatPostTimestamp(post.timestamp)}</div>
            </div>
          </Link>
          <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />
          
          <div className="post-menu">
          <ContextMenuTrigger
            id={post.id.toString()}
            ref={c => this.state.contextTrigger = c}
          >
            <FaEllipsisH className="post-options" onClick={(e) => this.handleContextMenu(e, post)} data-cy="postOptions"/>
          </ContextMenuTrigger>

          <ContextMenu id={post.id.toString()} className="context-menu">
          {(getCurrentUser().uid === post.user || this.props.canModify) && (
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
              <h2 className="modal-title">Signaler le post</h2>
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
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        {post.images && (
          <div className="post-photos" data-cy='photo'>
            {Object.values(post.images).map((image, index) => (
              <div key={index} className="post-photo">
                <img src={image} alt="Post" onClick={() => this.handleImageClick(Object.values(post.images),index)} />
              </div>
            ))}
          </div>
        )}
        {post.gif && (
          <div className="post-gif">
            <img src={post.gif} alt="GIF" />
          </div>
        )}
        {post.pool && (
          <div className="post-pool">
            {/*loop on post.pool*/}
            {this.state.vote !== null ? 
              <Poll answers={this.state.pollAnswers} onVote={this.handleVote} noStorage={true} vote={this.state.vote} customStyles={pollStyles1} question={''} data-cy='pollVote'/>
              : <Poll answers={this.state.pollAnswers} onVote={this.handleVote} noStorage={true} customStyles={pollStyles1} question={''} data-cy='pollResult'/>}
          </div>
        )}
        <div className="post-footer">
          <button className={`post-like-btn ${isLiked ? "liked" : ""}`} data-cy="like" onClick={this.handleLikeClick} likes={likeCount}>
            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />} {likeCount} {likeCount > 1 ? fr.POSTS.LIKES : fr.POSTS.LIKE}
          </button>
          <button className="post-comment-btn" data-cy="comment" onClick={this.handleCommentClick}>
            <AiOutlineComment /> {post.commentCount} {post.commentCount > 1 ? fr.POSTS.COMMENTS : fr.POSTS.COMMENT}
          </button>
          <button className="post-share-btn" data-cy="share" onClick={this.handleShareClick}>
            <FaShareAlt /> {fr.POSTS.SHARE}
          </button>
        </div>
        {showCommentInput && (
          <>
          <div className="comment-input">
            <input
              type="text"
              placeholder="Ajouter un commentaire"
              value={commentInputValue}
              onChange={this.handleCommentInputChange}
              className="comment-input-field"
              onKeyDown={this.handleKeyDown}
            />
            <button className="comment-btn" onClick={this.handleCommentSubmit}>{fr.POSTS.PUBLISH}</button>
          </div>
          <div className="comment-input-icons">
            <div className="post-input-icon" onClick={this.handleCameraIconClick}>
              <AiOutlineCamera />
            </div>
            <div className="post-input-icon" onClick={this.toggleGifSearch}>
              <AiOutlineGif />
            </div>
          </div>
          <div className="photos-preview">
            {this.state.photos.map((photo, index) => (
              <div key={index} style={{ marginBottom: '10px', position: 'relative' }}>
                <img
                  src={photo.dataURL}
                  alt={photo.name}
                  style={{ maxWidth: '100%', maxHeight: '10vh', borderRadius: '5px', objectFit: 'cover'}}
                />
                <div
                  className="delete-icon"
                  onClick={() => this.handleDeletePhoto(index)}
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
          {this.state.selectedGif && (
            <div className="selected-gif-container">
              <div style={{ marginBottom: '10px', position: 'relative' }}>
              <img src={this.state.selectedGif.images.original.url} alt="Selected GIF" />
              <div
                className="delete-icon"
                onClick={() => this.handleDeleteGif()}
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
            </div>
          )}
          {this.state.showGifSearch && !this.state.selectedGif && (<div className="gif-search">
            <SearchExperience setSelectedGif={this.setSelectedGif} />
          </div>)}
          {this.state.validationError && <div className="error-message">{this.state.validationError}</div>}
          <input type="file" id={`photo-input-${this.props.post.id}`} multiple accept="image/*" onChange={this.handlePhotoImport} style={{ display: "none" }} />
          </>
        )}
        {comments.length > 0 && (
          <div className={`comments`} data-cy="comments">
            <div className="comments-toggle" data-cy="openComments" onClick={this.toggleCommentVisibility}>
              {expandedComments ? "" : "Voir les commentaires"}
              {expandedComments ? "" : <FaAngleDown className="icon" />}
            </div>
            {expandedComments && comments.map((comment, index) => (
              <Comment key={comment.id} comment={comment} commentKey={index} postId={post.id} handleImageClick={this.handleImageClick}/>
            ))}
            <div className="comments-toggle" onClick={this.toggleCommentVisibility} data-cy="closeComments">
              {expandedComments ? "Réduire les commentaires" : ""}
              {expandedComments ? <FaAngleUp className="icon" /> : ""}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Post;
