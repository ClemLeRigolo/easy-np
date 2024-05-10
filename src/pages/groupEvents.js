import React from "react";
import "../styles/group.css"
import { authStates, withAuth } from "../components/auth";
import { likePost, getUserDataById, getGroupById, getEventsByGroup, deletePost, likeEvent } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import { withRouter } from 'react-router-dom';
import { changeColor } from "../components/schoolChoose";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Event from "../components/event";

class GroupEvent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        gid: null,
        posts: [],
        postContent: "",
        group: null,
        profileImg: null,
        dataCollected: false,
        canModify: false,
    };
  }

  handleLikeClick = (postIndex) => {
    const { posts } = this.state;
    const post = posts[postIndex];

    likeEvent(post.id)
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

  updatePosts = () => {
    getEventsByGroup(this.state.gid).then(
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

    if ((this.props.match.params.gid !== this.state.gid)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      //this.state.gid = this.props.match.params.gid;
      this.setState({ gid: this.props.match.params.gid })
      getEventsByGroup(this.props.match.params.gid).then(
        (querySnapshot) => {
          const posts = [];
          const promises = [];

          Object.values(querySnapshot).forEach((doc) => {
            const promise = getUserDataById(doc.creator).then((data) => {
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
              canModify: group.admins.includes(user.uid),
            });
            }
        );
      return <Loader />;
    }

    if (this.state.group === null) {
        return <Loader />;
    }

    return (
      <div className='interface'>
        <div className="home">
        <h1>{fr.GROUPS.EVENTS_OF} {this.state.group.name}</h1>
        <p>{this.state.group.description}</p>
        {this.state.canModify && (
          <Link to={`/group/${this.state.gid}/createEvent`} className="create-group-button" data-cy='createEventButton'>
            <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_EVENT}
          </Link>
        )}
          <div className="profile-post-list">
          
          {this.state.posts && this.state.posts.map((post, index) => (
                    <Event 
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

export default withRouter(withAuth(GroupEvent));