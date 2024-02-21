import React from "react";
import { Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import { getUserData, signOut, deleteUser, newPost, getPosts, getUserDataById } from "../utils/firebase";
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

  handleLikeClick = () => {
    this.setState(prevState => ({
      likeCount: prevState.likeCount + 1
    }));
  };

  handleCommentClick = () => {
    this.setState(prevState => ({
      commentCount: prevState.commentCount + 1
    }));
  };

  componentDidMount() {
    // Récupérez les posts depuis la base de données Firebase
    getPosts()
      .then((querySnapshot) => {
        const posts = [];
        Object.values(querySnapshot).forEach((doc) => {
          console.log("Doc:", doc);
          console.log(doc.user)
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
        <div className="">
        <h2>Bienvenue {this.state.firstName} {this.state.lastName} !</h2>
        <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent}/>
        {this.state.posts && this.state.posts.map((post, index) => (
          <Post key={index} post={post} handleLikeClick={this.handleLikeClick} handleCommentClick={this.handleCommentClick} likeCount={this.state.likeCount} commentCount={this.state.commentCount} />
        ))}
        <img src={require("../images/maintenance.png")} alt="Maintenance" />
        </div>
      </div>
    );
  }
}

export default withAuth(Home);