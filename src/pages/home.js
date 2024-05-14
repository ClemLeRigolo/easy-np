import React from "react";
import { Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import { getUserData, newPost, newPostWithImages, newPostWithPool, newPostWithGif, listenForPostChanges, getUserDataById, likePost, likeEvent, getCurrentUser, deletePost, deleteEvent, getForUserPosts, getEvents } from "../utils/firebase";
import Loader from "../components/loader";
import { changeColor } from "../components/schoolChoose";
import PostInput from "../components/postInput";
import Post from "../components/post";
import { IoMdRefresh } from 'react-icons/io';
import Event from "../components/event";
import HomeNotification from "../components/homeNotification";
import SuggestionUser from "../components/suggestionUser";


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
      completeProfile: false,
      currentUser: {},
      newPostsAvailable: false
    };
  }

  handlePostSubmit = (postContent, postImages, pool, gif) => {

    // Si l'utilisateur a téléchargé des images, enregistrez le post avec les images
    if (postImages.length > 0) {
      newPostWithImages(postContent, "1709162579034", postImages)
        .then((finito) => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else if (pool.length > 0) {
      // Enregistrez le post dans la base de données Firebase
      newPostWithPool(postContent,"1709162579034", pool)
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
      newPostWithGif(postContent,"1709162579034", gif)
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
      newPost(postContent,"1709162579034")
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

    likePost(post.id)
      .then((data) => {
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += data.status;
        post.likes = data.likes;
      
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

    likeEvent(post.id)
      .then((data) => {
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += data.status;
        post.likes = data.likes;
      
        // Mettez à jour l'état avec le post modifié
        this.setState({
          events: [...events.slice(0, postIndex), post, ...events.slice(postIndex + 1)]
        });
      })
      .catch((error) => {
        console.error("Erreur lors du like du post :", error);
      });
  };

  handleDeletePost = (id) => {
    // Supprimez le post de la base de données Firebase
    deletePost(id)
      .then(() => {
        this.updatePosts();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }

  handleDeleteEvent = (id) => {
    // Supprimez le post de la base de données Firebase
    deleteEvent(id)
      .then(() => {
        this.updateEvents();
      })
      .catch((error) => {
        console.error("Error deleting event:", error);
      });
  }

  updatePosts = () => {
    getForUserPosts()
      .then((querySnapshot) => {
        if (!querySnapshot) {
          return;
        }
        const posts = [];
        const promises = []; // Tableau pour stocker les promesses des requêtes getUserDataById
        querySnapshot.forEach((doc) => {
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

  updateEvents = () => {
    getEvents().then((events) => {
      if (!events) {
        return;
      }
  
      const promises = Object.values(events).map((event) => {
        return getUserDataById(Object.values(event)[0].creator).then((data) => {
          Object.values(event)[0].username = data.name + " " + data.surname;
          Object.values(event)[0].school = data.school;
          Object.values(event)[0].profileImg = data.profileImg;
          return Object.values(event)[0];
        });
      });
  
      Promise.all(promises).then((events2) => {
        events2.sort((a, b) => a.timestamp - b.timestamp);
        events2.reverse();
        this.setState({ events: events2 });
      });
    });
  }

  handleRefreshClick = () => {
    this.setState({ showRefreshButton: false });
    this.updatePosts();
    window.scrollTo(0, 0);
  };

  handleWindowChange = (window) => {
    this.setState({ window });
  }

  startRefreshTimer = () => {
    this.refreshTimeout = setTimeout(() => {
      if (this.state.newPostsAvailable) {
        this.setState({ 
          showRefreshButton: true,
          newPostsAvailable: false
        });
        this.startRefreshTimer();
      } else {
        this.startRefreshTimer();
      }
    }, 60000);
  };

  componentDidMount() {
    // rafraichit les posts quand la base de données change
    this.updatePosts();
    listenForPostChanges((posts) => {
      //on récupère l'id du dernier post
      if (!posts) {
        return;
      }
      const post = Object.values(posts)[0];
      if (post.user !== getCurrentUser().W.X && !this.state.firstLoad) {
        this.setState({ newPostsAvailable: true });
      }
      if (this.state.firstLoad) {
        this.setState({firstLoad: false});
      }
    });

    this.startRefreshTimer();

    this.updateEvents();
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
            currentUser: data
          });
          if (!this.state.profileImg) {
            this.setState({ profileImg: require(`../images/Profile-pictures/${data.school}-default-profile-picture.png`) });
          }
          changeColor(data.school);
          if (!data.name || !data.surname || !data.school || !data.bio || !data.year) {
            this.setState({ completeProfile: true });
          }
        }
        );
      return <Loader />;
    }

    return (
      <div className="interface">
        <div className="home-content">
        {this.state.showRefreshButton && (
        <button className="refresh-button" onClick={this.handleRefreshClick}>
          <IoMdRefresh /> Voir les nouveaux posts
        </button>
      )}
          <div className="post-list">
            {this.state.completeProfile && (
          <HomeNotification message={"Veuillez finaliser la création de votre profil !"} url={"/profile/" + user.uid} arrow={true} canClosed={true} />
        )}
          <div className="post-list-header">
            <button className={this.state.window === 'posts' ? 'active' : ''} onClick={() => this.handleWindowChange("posts")}>Posts</button>
            <button className={this.state.window === 'events' ? 'active' : ''} onClick={() => this.handleWindowChange("events")}>Événements</button>
          </div>
          {this.state.window === 'posts' ? (
            <>
          <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent} posts={this.state.posts} />
          {this.state.posts && this.state.posts.map((post, index) => (
            <Post 
              key={index} 
              post={post} 
              handleLikeClick={() => this.handleLikeClick(index)}
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
                      handleDeletePost={() => this.handleDeleteEvent(event.id)}
                      likeCount={event.likeCount} 
                      commentCount={event.commentCount} 
                    />
            ))}
            </>
          )}
          </div>
          <div className="right-column-ghost"/>
          <div className="right-column">
            <SuggestionUser userData={this.state.currentUser} />
          </div>
          </div>
        </div>
    );
  }
}

export default withAuth(Home);