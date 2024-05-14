import React from "react";
import "../styles/group.css"
import { authStates, withAuth } from "../components/auth";
import { likePost, getUserDataById, getPostByGroup, newPost, getGroupById, getEventById, newPostWithImages, newPostWithPool, newPostWithGif, deletePost } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import { withRouter } from 'react-router-dom';
import PostInput from "../components/postInput";
import { changeColor } from "../components/schoolChoose";

class Event extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        gid: null,
        eid: null,
        posts: [],
        postContent: "",
        group: null,
        event: null,
        profileImg: null,
        dataCollected: false,
        canModify: false,
    };
  }

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

  handlePostContentChange = event => {
    if (event === undefined) {
      this.setState({ postContent: "" });
      return;
    }
    this.setState({ postContent: event.target.value });
  };

  handlePostSubmit = (postContent, postImages, pool, gif) => {

    // Si l'utilisateur a téléchargé des images, enregistrez le post avec les images
    if (postImages.length > 0) {
      newPostWithImages(postContent, this.state.gid + this.state.eid, postImages)
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
      newPostWithPool(postContent, this.state.gid + this.state.eid, pool)
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
      newPostWithGif(postContent, this.state.gid + this.state.eid, gif)
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
      newPost(postContent, this.state.gid + this.state.eid)
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

  updatePosts = () => {
    getPostByGroup(this.state.gid + this.state.eid).then(
      (querySnapshot) => {
        const posts = [];
        const promises = [];

        Object.values(querySnapshot).forEach((doc) => {
          const promise = getUserDataById(doc.user).then((data) => {
            doc.username = data.name + " " + data.surname;
            doc.school = data.school;
            doc.profileImg = data.profileImg;
            posts.push(doc);
          });
          promises.push(promise);
        });

        // Utilisation de Promise.all pour attendre la résolution de toutes les promesses
        Promise.all(promises).then(() => {
            // Inverser la liste pour avoir les derniers posts en premier
            // Trie les posts selon leur ordre d'arrivée
            posts.sort((a, b) => a.timestamp - b.timestamp);
            posts.reverse();
            this.setState({ posts });
          });
      });
  }

  componentDidMount() {
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

    if (authState === authStates.LOGGED_IN && user.emailVerified === false) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      return <Loader />;
    }

    if (authState === authStates.LOGGED_IN && !this.state.dataCollected) {
      getUserDataById(user.uid).then((userData) => {
        this.setState({
          profileImg: userData.profileImg,
          dataCollected: true,
        });
        if (!this.state.profileImg) {
          this.setState({ profileImg: require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`) });
        }
        changeColor(userData.school);
      }
      );
      return <Loader />;
    }

    if ((this.props.match.params.gid !== this.state.gid) || (this.props.match.params.eid !== this.state.eid)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      this.setState({ gid: this.props.match.params.gid });
      //this.state.gid = this.props.match.params.gid;
      this.setState({ eid: this.props.match.params.eid });
      //this.state.eid = this.props.match.params.eid;
      getPostByGroup(this.props.match.params.gid + this.props.match.params.eid).then(
        (querySnapshot) => {
          const posts = [];
          const promises = [];

          Object.values(querySnapshot).forEach((doc) => {
            const promise = getUserDataById(doc.user).then((data) => {
                doc.username = data.name + " " + data.surname;
                doc.school = data.school;
                doc.profileImg = data.profileImg;
                posts.push(doc);
            });
            promises.push(promise);
          });

          // Utilisation de Promise.all pour attendre la résolution de toutes les promesses
            Promise.all(promises).then(() => {
                // Inverser la liste pour avoir les derniers posts en premier
                // Trie les posts selon leur ordre d'arrivée
                posts.sort((a, b) => a.timestamp - b.timestamp);
                posts.reverse();
                this.setState({ posts });
            });
        });
        getGroupById(this.props.match.params.gid).then((group) => {
            this.setState({ 
              group: Object.values(group)[0],
              canModify: group.admins.includes(user.uid)
            });
            }
        );
        getEventById(this.props.match.params.eid).then((event) => {
            this.setState({ event: Object.values(event)[0] });
            }
        );
      return <Loader />;
    }

    if (this.state.group === null || this.state.event === null) {
        return <Loader />;
    }

    return (
      <div className='interface'>
        <div className="group-content">
        <h1>{this.state.event.title}</h1>
        <p dangerouslySetInnerHTML={{ __html: this.state.event.description }}></p>
        <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent} posts={this.state.posts} />
          <div className="home">


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
        </div>

          </div>
        </div>
    )
      }
}

export default withRouter(withAuth(Event));