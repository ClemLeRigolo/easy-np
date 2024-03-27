import React from "react";
import "../styles/group.css"
import { authStates, withAuth } from "../components/auth";
import { likePost, getUserDataById, getPostById } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import GroupNavigation from "../components/groupNavigation";
import { withRouter } from 'react-router-dom';
import { changeColor } from "../components/schoolChoose";

class Publication extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        pid: null,
        profileImg: null,
        dataCollected: false,
    };
  }

  handleLikeClick = () => {
    const { post } = this.state;

    console.log("post", post);

    likePost(post.id)
      .then((data) => {
        console.log("Liked post");
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += data.status;
        post.likes = data.likes;
      
        // Mettez à jour l'état avec le post modifié
        this.setState({
          post: post
        });
      })
      .catch((error) => {
        console.error("Erreur lors du like du post :", error);
      });
  };

  handleCommentClick = () => {
    const { post } = this.state;

    // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le commentCount
    post.commentCount += 1;
  
    // Mettez à jour l'état avec le post modifié
    this.setState({
      post: post
    });
  };

  render() {
    const { authState, user } = this.props;

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
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
        console.log("userData", userData);
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

    if ((this.props.match.params.pid !== this.state.pid)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      //this.setState({ gid: this.props.match.params.gid });
      //this.state.pid = this.props.match.params.pid;
      this.setState({ pid: this.props.match.params.pid });
      getPostById(this.props.match.params.pid).then((post) => {
        console.log("post", post);
        post = Object.values(post)[0];
          getUserDataById(post.user).then((userData) => {
            post.username = userData.name + " " + userData.surname;
            post.school = userData.school;
            post.profileImg = userData.profileImg;
            this.setState({ post });
          });
        });
      return <Loader />;
    }

    if (!this.state.post) {
        return <Loader />;
        }

    return (
      <div className='interface'>
        <div className="main-container">
        <div className="nav-container">
            <GroupNavigation />
        </div>
        <div className="group-content">
            <Post 
                post={this.state.post} 
                handleLikeClick={() => this.handleLikeClick()}
                handleCommentClick={() => this.handleCommentClick()} 
                likeCount={this.state.post.likeCount} 
                commentCount={this.state.post.commentCount} 
            />
          </div>
        </div>
      </div>
    )
      }
}

export default withRouter(withAuth(Publication));