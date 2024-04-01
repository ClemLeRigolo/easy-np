import React from "react";
import { Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import { getUserData, newPost, newPostWithImages, newPostWithPool, newPostWithGif, listenForPostChanges, getUserDataById, likePost, likeEvent, getCurrentUser, deletePost, getForUserPosts, getEvents } from "../utils/firebase";
import Loader from "../components/loader";
import { changeColor } from "../components/schoolChoose";
import GroupNavigation from "../components/groupNavigation";
import PostInput from "../components/postInput";
import Post from "../components/post";
import { IoMdRefresh } from 'react-icons/io';
import Event from "../components/event";


import "../styles/home.css";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      profileImg: null,
      school: "",
      likeCount: 0,
      commentCount: 0,
      postContent: "",
      posts: [],
      showRefreshButton: false,
      firstLoad: true,
      gid: 1710178386585,
      window: "posts",
      events: [],
    };
  }

  handlePostSubmit = (postContent, postImages, pool, gif) => {

    console.log("postImages", postImages);
    console.log("postContent", postContent);
    console.log("pool", pool);

    // Si l'utilisateur a téléchargé des images, enregistrez le post avec les images
    if (postImages.length > 0) {
      newPostWithImages(postContent, "général", postImages)
        .then((finito) => {
          if (finito) {
            console.log("Post enregistré avec succès");
          }
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else if (pool.length > 0) {
      // Enregistrez le post dans la base de données Firebase
      newPostWithPool(postContent,"général", pool)
        .then(() => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else if (gif) {
      // Enregistrez le post dans la base de données Firebase
      newPostWithGif(postContent,"général", gif)
        .then(() => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else {
      // Enregistrez le post dans la base de données Firebase
      newPost(postContent,"général")
        .then(() => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    }
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

  handleEventLikeClick = (postIndex) => {
    const { events } = this.state;
    const post = events[postIndex];

    console.log("post", post);

    likeEvent(post.id)
      .then((data) => {
        console.log("Liked post");
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += data.status;
        post.likes = data.likes;

        console.log("post.likeCount", post.likeCount);
        console.log("post.likes", post.likes);
      
        // Mettez à jour l'état avec le post modifié
        this.setState({
          events: [...events.slice(0, postIndex), post, ...events.slice(postIndex + 1)]
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

  handleDeletePost = (id) => {
    // Supprimez le post de la base de données Firebase
    deletePost(id)
      .then(() => {
        console.log("Post deleted");
        this.updatePosts();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }

  updatePosts = () => {
    getForUserPosts()
      .then((querySnapshot) => {
        console.log("querySnapshot", querySnapshot);
        if (!querySnapshot) {
          return;
        }
        const posts = [];
        const promises = []; // Tableau pour stocker les promesses des requêtes getUserDataById
        querySnapshot.forEach((doc) => {
          //console.log("doc", doc);
          //doc = Object.values(doc)[0];
          if (doc !== undefined) {
            const promise = getUserDataById(doc.user).then((data) => {
              doc.username = data.name + " " + data.surname;
              doc.school = data.school;
              doc.profileImg = data.profileImg;
              posts.push(doc);
            });
            promises.push(promise);
          }
        });
  
        // Utilisation de Promise.all pour attendre la résolution de toutes les promesses
        Promise.all(promises).then(() => {
          // Inverser la liste pour avoir les derniers posts en premier
          // Trie les posts selon leur ordre d'arrivée
          //posts.sort((a, b) => a.timestamp - b.timestamp);
          //posts.reverse();
          posts.sort((a, b) => a.points - b.points);
          posts.reverse();
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

  handleWindowChange = (window) => {
    this.setState({ window });
  }

  componentDidMount() {
    // rafraichit les posts quand la base de données change
    this.updatePosts();
    console.log("mounted ");
    console.log(this.state.showRefreshButton);
    listenForPostChanges((posts) => {
      //on récupère l'id du dernier post
      if (!posts) {
        return;
      }
      const post = Object.values(Object.values(posts)[Object.values(posts).length-1])[0];
      if (post.user !== getCurrentUser().W.X && !this.state.firstLoad) {
        this.setState({showRefreshButton: true});
      }
      if (this.state.firstLoad) {
        this.setState({firstLoad: false});
      }
      console.log(this.state.showRefreshButton);
    });
    getEvents().then((events) => {
      console.log("events", events);
      if (!events) {
        return;
      }
      const events2 = [];
      Object.values(events).forEach((event) => {
        getUserDataById(Object.values(event)[0].creator).then((data) => {
          Object.values(event)[0].username = data.name + " " + data.surname;
          Object.values(event)[0].school = data.school;
          Object.values(event)[0].profileImg = data.profileImg;
          events2.push(Object.values(event)[0]);
        });
      });
      this.setState({ events: events2 });
    }
    );
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
            profileImg: data.profileImg,
          });
          if (!this.state.profileImg) {
            this.setState({ profileImg: require(`../images/Profile-pictures/${data.school}-default-profile-picture.png`) });
          }
          changeColor(data.school);
        }
        );
      return <Loader />;
    }

    console.log(this.state.window);
    console.log(this.state.events);

    return (
      <div className="interface">
        {this.state.showRefreshButton && (
        <button className="refresh-button" onClick={this.handleRefreshClick}>
          <IoMdRefresh />
        </button>
      )}
        <div className="main-container">
          <div className="nav-container">
            <div><GroupNavigation /></div>
          </div>
          <div className="post-list">
          <div className="post-list-header">
            <button className={this.state.window === 'posts' ? 'active' : ''} onClick={() => this.handleWindowChange("posts")}>Posts</button>
            <button className={this.state.window === 'events' ? 'active' : ''} onClick={() => this.handleWindowChange("events")}>Événements</button>
          </div>
          {this.state.window === 'posts' ? (
            <>
          <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent}/>
          {this.state.posts && this.state.posts.map((post, index) => (
            <Post 
              key={index} 
              post={post} 
              handleLikeClick={() => this.handleLikeClick(index)}
              handleCommentClick={() => this.handleCommentClick(index)} 
              handleDeletePost={() => this.handleDeletePost(post.id)}
              likeCount={post.likeCount} 
              commentCount={post.commentCount} 
            />
          ))}
          </>) : (
            <>
            {this.state.events && this.state.events.map((event, index) => (
              <Event 
                      key={index} 
                      post={event} 
                      handleLikeClick={() => this.handleEventLikeClick(index)}
                      handleCommentClick={() => this.handleCommentClick(index)} 
                      handleDeletePost={() => this.handleDeletePost(event.id)}
                      likeCount={event.likeCount} 
                      commentCount={event.commentCount} 
                    />
            ))}
            </>
          )}
          </div>
        </div>
      </div>
    );
  }
}

export default withAuth(Home);