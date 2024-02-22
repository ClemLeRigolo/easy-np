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
        this.setState({ postContent: "" }); // Réinitialisez le champ de texte du post
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement du post :", error);
      });
      this.componentDidMount();
  };

  handlePostContentChange = event => {
    this.setState({ postContent: event.target.value });
  };

  handleLikeClick = (postIndex) => {
    const { posts } = this.state;
    const post = posts[postIndex];

    console.log("posts", posts);
    console.log("post", post);

    likePost(post.id)
      .then(() => {
        console.log("Liked post");
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += 1;
      
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

  componentDidMount() {
    // Récupérez les posts depuis la base de données Firebase
    getPosts()
      .then((querySnapshot) => {
        const posts = [];
        Object.values(querySnapshot).forEach((doc) => {
          console.log("Doc:", doc);
          console.log(Object.values(doc)[0]);
          doc = Object.values(doc)[0];
          getUserDataById(doc.user).then(data => {
            console.log(data);
            doc.username = data.name + " " + data.surname;
            doc.school = data.school;
            posts.push(doc);
          });
        });
        //inverse la liste pour avoir les derniers posts en premier
        posts.reverse();
        this.setState({ posts });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des posts :", error);
      });
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

    return (
      <div className="container">
        <HeaderBar 
          search={""}
          setSearch={""}
          showMenu={false}
          setShowMenu={false}
        />
        <div className="post-list">
        <h2>Bienvenue {this.state.firstName} {this.state.lastName} !</h2>
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
        <img src={require("../images/maintenance.png")} alt="Maintenance" />
        </div>
      </div>
    );
  }
}

export default withAuth(Home);