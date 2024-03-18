import React from "react";
import "../styles/post.css";
import { getCurrentUser, addComment, getComments, getUserDataById } from "../utils/firebase";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Comment from "./comment";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import DOMPurify from "dompurify";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false,
      commentInputValue: "",
      expandedComments: false, // État pour gérer l'affichage des commentaires
      post: this.props.post,
    };
  }

  handleLikeClick = () => {
    // Logique de gestion du clic sur le bouton Like
    const { handleLikeClick } = this.props;
    handleLikeClick(this.state.post.id);
  };

  handleCommentClick = () => {
    // Logique de gestion du clic sur le bouton Comment
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
              return comment;
            });
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

  componentDidMount() {
    const { post } = this.props;
  
    // Récupérer les commentaires à partir de la source de données (par exemple, Firebase)
    getComments(post.id)
      .then((comments) => {
        const promises = comments.map((comment) => {
          // On boucle sur les commentaires pour rajouter le nom d'utilisateur
          if (comment) {
            return getUserDataById(comment.user).then((user) => {
              comment.author = user.name + " " + user.surname;
              comment.profileImg = user.profileImg;
              return comment;
            });
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
      console.log("dedans", this.props.post);
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

    return (
      <div className="post">
        <div className="post-header">
          <Link to={`/profile/${post.user}`} className="post-username">
          {post.profileImg ? (
              <img src={post.profileImg} alt="Profile" className="post-avatar"/>
            ) : (
              <img src={require(`../images/Profile-pictures/${post.school}-default-profile-picture.png`)} alt="Profile" className="post-avatar" />
            )}
            <div>
              {post.username}
            </div>
          </Link>
          <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />
        </div>
        {post.title && <div className="post-title"><h1>{post.title}</h1></div>}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: post.content }}></div>
        <div className="post-footer">
          <button className={`post-like-btn ${isLiked ? "liked" : ""}`} onClick={this.handleLikeClick}>
            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />} {likeCount} {likeCount > 1 ? fr.POSTS.LIKES : fr.POSTS.LIKE}
          </button>
          <button className="post-comment-btn" onClick={this.handleCommentClick}>
            <AiOutlineComment /> {post.commentCount} {post.commentCount > 1 ? fr.POSTS.COMMENTS : fr.POSTS.COMMENT}
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
              {expandedComments ? "Réduire les commentaires" : "Voir les commentaires"}
              {expandedComments ? <FaAngleUp className="icon" /> : <FaAngleDown className="icon" />}
            </div>
            {expandedComments && comments.map((comment, index) => (
              <Comment key={comment.id} comment={comment} commentKey={index} postId={post.id}/>
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Post;