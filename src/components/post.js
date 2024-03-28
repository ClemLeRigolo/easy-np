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
      this.setState({ post: this.props.post });
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
      post.voters.forEach((voter, index) => {
        if (voter.includes(getCurrentUser().uid)) {
          //this.setState({ vote: post.pool[index] });
          console.log("vote", post.pool[index]);
          this.state.vote = post.pool[index];
        }
      }
      );
    }

    return (
      <div className="post">
        <div className="post-header">
          <Link to={`/profile/${post.user}`} className="post-username">
          <ProfileImage uid={post.user} post={true} />
            <div>
              {post.username}
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
                <img src={image} alt="Post" />
              </div>
            ))}
          </div>
        )}
        {post.pool && (
          <div className="post-pool">
            {/*loop on post.pool*/}
            {this.state.vote ? 
              <Poll answers={this.state.pollAnswers} onVote={this.handleVote} noStorage={true} vote={this.state.vote}/>
              : <Poll answers={this.state.pollAnswers} onVote={this.handleVote} noStorage={true} />}
          </div>
        )}
        <div className="post-footer">
          <button className={`post-like-btn ${isLiked ? "liked" : ""}`} onClick={this.handleLikeClick}>
            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />} {likeCount} {likeCount > 1 ? fr.POSTS.LIKES : fr.POSTS.LIKE}
          </button>
          <button className="post-comment-btn" onClick={this.handleCommentClick}>
            <AiOutlineComment /> {post.commentCount} {post.commentCount > 1 ? fr.POSTS.COMMENTS : fr.POSTS.COMMENT}
          </button>
          <button className="post-share-btn" onClick={this.handleShareClick}>
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
              <Comment key={comment.id} comment={comment} commentKey={index} postId={post.id}/>
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

export default Post;