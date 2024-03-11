import React from "react";
import { Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import { getUserData, newPost, listenForPostChanges, getPosts, getUserDataById, likePost, getCurrentUser } from "../utils/firebase";
import Loader from "../components/loader";
import { changeColor } from "../components/schoolChoose";
import HeaderBar from "../components/headerBar";
import GroupNavigation from "../components/groupNavigation";
import PostInput from "../components/postInput";
import Post from "../components/post";
import { IoMdRefresh } from 'react-icons/io';

import "../styles/home.css";

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
      showRefreshButton: false,
      firstLoad: true,
    };
  }

  handlePostSubmit = () => {
    const { postContent } = this.state;

    console.log("postContent", this.state.postContent);
    // Enregistrez le post dans la base de données Firebase
    newPost(postContent,1709162579034)
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
      .then((data) => {
        console.log("Liked post");
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += data.status;
        post.likes = data.likes;
        console.log(post);
      
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

        console.log("querySnapshot", querySnapshot);
  
        Object.values(querySnapshot).forEach((doc) => {
          doc = Object.values(doc)[0];
          const promise = getUserDataById(doc.user).then((data) => {
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
          posts.reverse();
          console.log("posts", posts);
          this.setState({ posts });
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des posts :", error);
      });
  }

  handleRefreshClick = () => {
    this.setState({ showRefreshButton: false });
    this.updatePosts();
  };

  componentDidMount() {
    // rafraichit les posts quand la base de données change
    this.updatePosts();
    listenForPostChanges((posts) => {
      //on récupère l'id du dernier post
      console.log(Object.values(posts)[Object.values(posts).length-1]);
      const post = Object.values(Object.values(posts)[Object.values(posts).length-1])[0];
      console.log(getCurrentUser().W.X);
      console.log(post);
      if (post.user != getCurrentUser().W.X && !this.state.firstLoad) {
        this.setState({showRefreshButton: true});
      }
      if (this.state.firstLoad) {
        this.setState({firstLoad: false});
      }
    });
  }

  render() {
    const { authState, user } = this.props;

    if (authState === authStates.INITIAL_VALUE || this.state.loading) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login"></Redirect>;
    }

    if (authState === authStates.LOGGED_IN && !this.state.firstName) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
        getUserData(user.email).then(data => {
          this.setState({
            firstName: data.name,
            lastName: data.surname,
            school: data.school,
          });
          changeColor(data.school);
        }
        );
      return <Loader />;
    }

    console.log("posts", this.state.posts);

    return (
      <div className="interface">
        <HeaderBar 
          search={""}
          setSearch={""}
          showMenu={false}
          setShowMenu={false}
          uid={user.uid}
        />
        {this.state.showRefreshButton && (
        <button className="refresh-button" onClick={this.handleRefreshClick}>
          <IoMdRefresh />
        </button>
      )}
        <div className="main-container">
          <GroupNavigation />
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
      </div>
    );
  }
}

export default withAuth(Home);