import React from "react";
import "../styles/group.css"
import { authStates, withAuth } from "../components/auth";
import { likePost, getUserDataById, getRessource } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import { withRouter } from 'react-router-dom';
import { changeColor } from "../components/schoolChoose";
import Ressource from "../components/ressource";

class RessourcePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        pid: null,
        profileImg: null,
        dataCollected: false,
    };
  }

  render() {
    const { authState, user } = this.props;

    console.log(this.props.match.params);

    const type = this.props.match.params['0'];
    const cid = this.props.match.params.cid;
    const rid = this.props.match.params.rid;

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

    if ((this.props.match.params.pid !== this.state.pid)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      //this.setState({ gid: this.props.match.params.gid });
      //this.state.pid = this.props.match.params.pid;
      this.setState({ pid: this.props.match.params.pid });
      getRessource(type, cid, rid).then((post) => {
        console.log(post);
          getUserDataById(post.creator).then((userData) => {
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
        <div className="group-content">
            <Ressource 
                ressource={this.state.post} 
            />
          </div>
        </div>
    )
      }
}

export default withRouter(withAuth(RessourcePage));