import React from "react";
import "../styles/post.css";
import { getCurrentUser, addComment, getComments, getImagesFromPost, getUserDataById, voteFor } from "../utils/firebase";
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
    };
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
        console.log("URL copiée avec succès :", finalUrle);
        // Ajoutez ici une logique supplémentaire si nécessaire, par exemple, afficher un message de succès
      })
      .catch((error) => {
        console.error("Erreur lors de la copie de l'URL :", error);
        // Ajoutez ici une logique supplémentaire si nécessaire, par exemple, afficher un message d'erreur
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
  
    addComment(post.id, commentInputValue)
      .then(() => {
        console.log("Commentaire ajouté avec succès");
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
        console.log("updatedComments", updatedComments);
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
  }

  handleImageClick = (image) => {
    console.log("image", image)
    this.setState({
      expandedImage: image
    })
    if (image !== null) {
      //bloquer le scroll
      // Get the current page scroll position
      console.log("stop scroll")
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
      console.log("start scroll")
      window.onscroll = function () { };
    }
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
        console.log(images)
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
    console.log("answer", answer);
    const { pollAnswers } = this.state;
    const newPollAnswers = pollAnswers.map((pollAnswer,index) => {
      if (pollAnswer.option === answer) {
        pollAnswer.votes += 1;
        voteFor(this.state.post.id, index);
      }
      return pollAnswer;
    });
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
      console.log("voters", post.voters);
      for (let i = 0; i < post.pool.length; i++) {
        if (post.voters[i] && post.voters[i].includes(getCurrentUser().uid)) {
          //this.setState({ vote: post.pool[i] });
          console.log("vote", post.pool[i]);
          console.log("index", i);
          this.state.vote = post.pool[i];
        }
      }
    }

    const pollStyles1 = {
      align: 'center',
      theme: 'blue'
    }

    console.log("pollAnswers", this.state.pollAnswers);
    console.log("vote", this.state.vote);

    return (
      <div className="post" data-cy="post">
        {this.state.expandedImage && (
          <div 
          className="overlay"
          onClick={() => this.handleImageClick(null)}
          >
            <img 
            src={this.state.expandedImage}
            className="expanded-image"
            alt="Expanded"
          />
          </div>
        )}
        <div className="post-header">
          <Link to={`/profile/${post.user}`} className="post-username">
          <ProfileImage uid={post.user} post={true} />
            <div>
              <p>{post.username}</p>
              <div className="post-date">{formatPostTimestamp(post.timestamp)}</div>
            </div>
          </Link>
          <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />
          {(getCurrentUser().uid === post.user || this.props.canModify) && (
          <div className="post-menu">
          <ContextMenuTrigger id={post.id}>
            <FaEllipsisH className="post-options" />
          </ContextMenuTrigger>

          <ContextMenu id={post.id}>
            <MenuItem onClick={this.handleDeletePost}>{fr.POSTS.DELETE}</MenuItem>
          </ContextMenu>
          </div>)}
        </div>
        {post.title && <Link to={`/group/${post.groupId}/event/${post.id}`} className="post-title"><h1>{post.title}</h1></Link>}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        {post.images && (
          <div className="post-photos">
            {Object.values(post.images).map((image, index) => (
              <div key={index} className="post-photo">
                <img src={image} alt="Post" onClick={() => this.handleImageClick(image)} />
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
              <Poll answers={this.state.pollAnswers} onVote={this.handleVote} noStorage={true} vote={this.state.vote} customStyles={pollStyles1} />
              : <Poll answers={this.state.pollAnswers} onVote={this.handleVote} noStorage={true} customStyles={pollStyles1} />}
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
            <FaShareSquare /> {fr.POSTS.SHARE}
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
          <div className={`comments ${expandedComments ? "expanded" : ""}`} data-cy="comments">
            <div className="comments-toggle" data-cy="openComments" onClick={this.toggleCommentVisibility}>
              {expandedComments ? "" : "Voir les commentaires"}
              {expandedComments ? "" : <FaAngleDown className="icon" />}
            </div>
            {expandedComments && comments.map((comment, index) => (
              <Comment key={comment.id} comment={comment} commentKey={index} postId={post.id}/>
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
