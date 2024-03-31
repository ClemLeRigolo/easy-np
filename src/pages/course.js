import React from "react";
import "../styles/course.css"
import { authStates, withAuth } from "../components/auth";
import { getUserDataById, getCourseById } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import ChannelNavigation from "../components/channelNavigation";
import { withRouter } from 'react-router-dom';
import PostInput from "../components/postInput";
import { changeColor } from "../components/schoolChoose";
import CourseMiddle from "../components/courseMiddle";
import Info3 from "../images/course-banner-default.jpg"
import Info2 from "../images/course-profile-default.png"

class Course extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        cid: null,
        dataCollected: false,
        groupImg: Info2,
        groupBanner: Info3,
        school: "",
        course: null,
    };
  }

  setProfileData = (data) => {
    this.setState({
      name: data.name + " " + data.surname,
      userName: data.name + "_" + data.surname,
      modelDetails: {
        ModelName: data.name + " " + data.surname,
        ModelUserName: "@" + data.name + "_" + data.surname,
      },
    });
  }

  setSearch = (value) => {
    this.setState({ search: value });
  }

  setShowMenu = (value) => {
    this.setState({ showMenu: value });
  }

  setImages = (value) => {
    this.setState({ images: value });
  }

  setName = (value) => {
    this.setState({ name: value });
  }

  setUserName = (value) => {
    this.setState({ userName: value });
  }

  setProfileImg = (value) => {
    this.setState({ groupImg: value });
  }

  setModelDetails = (value) => {
    this.setState({ modelDetails: value });
  }

  setCoverImg = (value) => {
    this.setState({ groupBanner: value });
  }

  addAdmin = (value) => {
    this.setState({ admins: [...this.state.admins, value] });
  }

  removeAdmin = (value) => {
    this.setState({ admins: this.state.admins.filter((admin) => admin !== value) });
  }

  removeMbr = (value) => {
    this.setState({ membres: this.state.membres.filter((mbr) => mbr !== value) });
    this.setState({ membersSetted: false });
    this.setState({ showManage: true })
  }

  acceptMember = (value) => {
    this.setState({ waitingList: this.state.waitingList.filter((mbr) => mbr !== value) });
    this.setState({ waitingListSetted: false });
    this.setState({ membres: [...this.state.membres, value] });
    this.setState({ membersSetted: false });
    this.setState({ showManage: true })
  }

  refuseMember = (value) => {
    this.setState({ waitingList: this.state.waitingList.filter((mbr) => mbr !== value) });
    this.setState({ waitingListSetted: false });
    this.setState({ showManage: true })
  }

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
          dataCollected: true,
          school: userData.school,
        });
        changeColor(userData.school);
      }
      );
      return <Loader />;
    }

    if ((this.props.match.params.cid !== this.state.cid)) {
        console.log("this.props.match.params.cid", this.props.match.params.cid)
      //this.setState({ cid: this.props.match.params.cid });
      this.state.cid = this.props.match.params.cid;
      getCourseById(this.props.match.params.cid).then((course) => {
        this.setState({ course: Object.values(course)[0] });
      });
      return <Loader />;
    }

    if (this.state.course === null) {
        return <Loader />;
    }

    console.log(this.state.course);

    const modelDetails = {
      ModelName: this.state.course.name,
      ModelUserName: "@" + this.state.course.name,
    };

    return (
      <div className='interface'>
        <div className="course-container">
        <CourseMiddle 
            following={this.state.following}
            search={this.state.search}
            images={this.state.images}
            setImages={this.setImages}
            name={this.state.name}
            setName={this.setName}
            userName={this.state.userName}
            setUserName={this.setUserName}
            profileImg={this.state.groupImg}
            setProfileImg={this.setProfileImg}
            modelDetails={modelDetails}
            setModelDetails={this.setModelDetails}
            canModify={this.state.canModify}
            uid={user.uid}
            coverImg={this.state.groupBanner}
            setCoverImg={this.setCoverImg}
            />
        <p dangerouslySetInnerHTML={{ __html: this.state.course.description }}></p>
        </div>
      </div>
    )
      }
}

export default withRouter(withAuth(Course));