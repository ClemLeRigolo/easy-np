import React from "react";
import "../styles/saloon.css"
import { authStates, withAuth } from "../components/auth";
import { likePost, getUserDataById, getPostBySaloon, newPost, getSaloonById, getGroupById, deletePost, newPostWithImages, newPostWithPool, newPostWithGif } from "../utils/firebase";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import { withRouter } from 'react-router-dom';
import PostInput from "../components/postInput";
import { changeColor } from "../components/schoolChoose";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";

class Saloon extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        gid: null,
        posts: [],
        postContent: "",
        group: null,
        saloon: null,
        profileImg: null,
        dataCollected: false,
        canWrite: false,
        school: null,
        members: []
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
      newPostWithImages(postContent, this.state.gid + this.state.sid, postImages)
        .then((finito) => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else if (pool.length > 0) {
      newPostWithPool(postContent, this.state.gid + this.state.sid, pool)
        .then((finito) => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else if (gif) {
      newPostWithGif(postContent, this.state.gid + this.state.sid, gif)
        .then((finito) => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else {
      // Enregistrez le post dans la base de données Firebase
      newPost(postContent, this.state.gid + this.state.sid)
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
    getPostBySaloon(this.state.gid + this.state.sid).then(
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
          school: userData.school
        });
        if (!this.state.profileImg) {
          this.setState({ profileImg: require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`) });
        }
        changeColor(userData.school);
      }
      );
      return <Loader />;
    }

    if ((this.props.match.params.gid !== this.state.gid && this.state.gid !== null) || (this.props.match.params.sid !== this.state.sid && this.state.sid !== null)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      this.setState({ gid: this.props.match.params.gid });
      //this.state.gid = this.props.match.params.gid;
      this.setState({ sid: this.props.match.params.sid });
      //this.state.sid = this.props.match.params.sid;
      getPostBySaloon(this.props.match.params.gid + this.props.match.params.sid).then(
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
        getSaloonById(this.props.match.params.sid).then((saloon) => {
            this.setState({ saloon: Object.values(saloon)[0] });
            }
        );
        getGroupById(this.props.match.params.gid).then((group) => {
            this.setState({ 
              group: Object.values(group)[0],
              canWrite: group.admins.includes(user.uid),
              members: group.members
            });
            }
        );
      return <Loader />;
    }

    if (this.state.group === null || this.state.saloon === null) {
        return <Loader />;
    }

    if ((this.state.group.school !== "all" && this.state.group.school !== this.state.school) || (!this.state.group.isPublic && !this.state.members.includes(user.uid))) {
      return (
        <div className='interface'>
        <div className="home">
          <div className="events-header">
            <h1>{fr.GROUPS.DONT_ACCESS} {this.state.group.name}</h1>
            <Link to={`/group/${this.state.gid}`} className="create-group-button" data-cy='goToGroup'>
              {fr.GROUPS.SEE_GROUP}
            </Link>
          </div>
        </div>
        </div>
      )
    }

    return (
      <div className='interface'>
        <div className="saloon-content">
          <div className="saloon-header">
            <h1>{this.state.saloon.name}</h1>
            <p dangerouslySetInnerHTML={{ __html: this.state.saloon.description }}></p>
          </div>
        {this.state.canWrite && (
          <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent} posts={this.state.posts} />
        )}
          <div className="post-list-saloon">


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
        </div>

          </div>
        </div>
    )
      }
}

export default withRouter(withAuth(Saloon));