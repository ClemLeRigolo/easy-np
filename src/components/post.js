import React from "react";
import "../styles/post.css";
import { getCurrentUser, addComment, getComments, getUserDataById } from "../utils/firebase";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import Comment from "./comment";
import { Link } from "react-router-dom";

class Post extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showCommentInput: false,
      commentInputValue: "",
      comments: [],
      expandedComments: false, // État pour gérer l'affichage des commentaires
    };
  }

  handleLikeClick = () => {
    // Logique de gestion du clic sur le bouton Like
    const { post, handleLikeClick } = this.props;
    handleLikeClick(post.index);
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
        })
        .catch((error) => {
            console.error("Erreur lors de l'ajout du commentaire :", error);
        });

    // Réinitialiser la zone de texte des commentaires
    this.setState({
      showCommentInput: false,
      commentInputValue: "",
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
    const promises = [];
  
    // Récupérer les commentaires à partir de la source de données (par exemple, Firebase)
    getComments(post.id)
      .then((comments) => {
        //On boucle sur les commentaires pour rajouter le nom d'utilisateur
        comments.forEach(comment => {
          if (comment) {
            console.log(comment.user);
            const promise = getUserDataById(comment.user).then((user) => {
              comment.author = user.name + " " + user.surname;
          });
          promises.push(promise);
          }
        });
        Promise.all(promises).then(() => {
          this.setState({ comments });
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des commentaires :", error);
      });
  }

  render() {
    const { post, likeCount, commentCount } = this.props;
    const { showCommentInput, commentInputValue, comments, expandedComments } = this.state;
    var isLiked = false;
    console.log(comments)

    if (post.likes != undefined && post.likes.hasOwnProperty(getCurrentUser().uid)) {
      isLiked = true;
    }

    console.log(post);

    return (
      <div className="post">
        <div className="post-header">
          <Link to={`/profile/${post.user}`}>           
            <img src={require("../images/avatar.png")} alt="Avatar" className="post-avatar" />
            <div className="post-username">
              {post.username}
            </div>
          </Link>
          <img src={require(`../images/écoles/${post.school}.png`)} alt="School" className="post-school" />
        </div>
        <div className="post-body">{post.content}</div>
        <div className="post-footer">
          <button className={`post-like-btn ${isLiked ? "liked" : ""}`} onClick={this.handleLikeClick}>
            {isLiked ? <AiFillHeart /> : <AiOutlineHeart />} {likeCount}
          </button>
          <button className="post-comment-btn" onClick={this.handleCommentClick}>
            <AiOutlineComment /> {commentCount}
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
            <button className="comment-btn" onClick={this.handleCommentSubmit}>Publier</button>
          </div>
        )}
        {comments.length > 0 && (
          <div className={`comments ${expandedComments ? "expanded" : ""}`}>
            <div className="comments-toggle" onClick={this.toggleCommentVisibility}>
              {expandedComments ? "Réduire les commentaires" : "Voir les commentaires"}
              {expandedComments ? <FaAngleUp className="icon" /> : <FaAngleDown className="icon" />}
            </div>
            {expandedComments && comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Post;