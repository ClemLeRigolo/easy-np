import React from "react";
import { Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import { getUserData, signOut, deleteUser, newPost, getPosts, getUserDataById, likePost } from "../utils/firebase";
import Loader from "../components/loader";
import { changeColor } from "../components/schoolChoose";
import HeaderBar from "../components/headerBar";
import PostInput from "../components/postInput";
import Post from "../components/post";

import "../styles/home.css";

function handleSignOut() {
  signOut()
    .then(() => {
      console.log("Signed Out");
    })
    .catch(e => {
      console.log("Error signing out", e);
    });
}

function handleDelete() {
  deleteUser()
    .then(() => {
      console.log("User deleted");
    })
    .catch(e => {
      console.log("Error deleting user", e);
    });
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      school: "",
      likeCount: 0,
      commentCount: 0,
      postContent: "",
      posts: [],
    };
  }

  handlePostSubmit = () => {
    const { postContent } = this.state;

    console.log("postContent", this.state.postContent);
  
    // Enregistrez le post dans la base de données Firebase
    newPost(postContent)
      .then(() => {
        this.setState({ postContent: "" });
        this.handlePostContentChange(); // Réinitialisez le champ de texte du post
        this.updatePosts();
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement du post :", error);
      });
  };

  handlePostContentChange = event => {
    if (event === undefined) {
      this.setState({ postContent: "" });
      return;
    }
    this.setState({ postContent: event.target.value });
  };

  handleLikeClick = (postIndex) => {
    const { posts } = this.state;
    const post = posts[postIndex];

    console.log("posts", posts);
    console.log("post", post);

    likePost(post.id)
      .then((value) => {
        console.log("Liked post");
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += value;
      
        // Mettez à jour l'état avec le post modifié
        this.setState({
          posts: [...posts.slice(0, postIndex), post, ...posts.slice(postIndex + 1)]
        });
      })
      .catch((error) => {
        console.error("Erreur lors du like du post :", error);
      });
  };

  handleCommentClick = (postIndex) => {
    const { posts } = this.state;
    const post = posts[postIndex];

    // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le commentCount
    post.commentCount += 1;
  
    // Mettez à jour l'état avec le post modifié
    this.setState({
      posts: [...posts.slice(0, postIndex), post, ...posts.slice(postIndex + 1)]
    });
  };

  updatePosts = () => {
    getPosts()
      .then((querySnapshot) => {
        const posts = [];
        const promises = []; // Tableau pour stocker les promesses des requêtes getUserDataById
  
        Object.values(querySnapshot).forEach((doc) => {
          console.log("Doc:", doc);
          console.log(Object.values(doc)[0]);
          doc = Object.values(doc)[0];
          const promise = getUserDataById(doc.user).then((data) => {
            console.log(data);
            doc.username = data.name + " " + data.surname;
            doc.school = data.school;
            posts.push(doc);
          });
          promises.push(promise);
        });
  
        // Utilisation de Promise.all pour attendre la résolution de toutes les promesses
        Promise.all(promises).then(() => {
          // Inverser la liste pour avoir les derniers posts en premier
          console.log("posts", posts);
          console.log("querySnapshot.size", querySnapshot);
          // Trie les posts selon leur ordre d'arrivée
          posts.sort((a, b) => a.timestamp - b.timestamp);
          console.log("posts", posts);
          this.setState({ posts });
          this.render();
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des posts :", error);
      });
  }

  componentDidMount() {
    // Récupérez les posts depuis la base de données Firebase
    this.updatePosts();
  }

  render() {
    const { authState, user } = this.props;

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login"></Redirect>;
    }

    if (authState === authStates.LOGGED_IN && !this.state.firstName) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      console.log("dedans");
        getUserData(user.email).then(data => {
          this.setState({
            firstName: data.name,
            lastName: data.surname,
            school: data.school,
          });
          console.log(data.name, data.surname, data.school);
          changeColor(data.school);
        }
        );
    }

    console.log("posts", this.state.posts);

    return (
      <div className="container">
        <HeaderBar 
          search={""}
          setSearch={""}
          showMenu={false}
          setShowMenu={false}
        />
        <div className="post-list">
        <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent}/>
        {this.state.posts && this.state.posts.map((post, index) => (
          <Post 
            key={index} 
            post={post} 
            handleLikeClick={() => this.handleLikeClick(index)}
            handleCommentClick={() => this.handleCommentClick(index)} 
            likeCount={post.likeCount} 
            commentCount={post.commentCount} 
          />
        ))}
        </div>
      </div>
    );
  }
}

export default withAuth(Home);