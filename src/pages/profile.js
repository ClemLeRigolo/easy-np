import React from "react";
import { useState } from 'react'
// import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../components/profileMiddle'
// import Right from '../../Components/RightSide/Right'
import HeaderBar from '../components/headerBar'
import "../styles/profile.css"
import ProfileImg from "../images/avatar.png"
import { authStates, withAuth } from "../components/auth";
import { getCurrentUser, getUserData } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      userData: null,
      following: 3,
      search: "",
      showMenu: false,
      images: null,
      name: "",
      userName: "",
      profileImg: ProfileImg,
      modelDetails: {
        ModelName: "PlaceHolder",
        ModelUserName: "@PlaceHolder",
      },
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

  render() {
    //const [user, setUser] = useState(getCurrentUser());

    //const [userData, setUserData] = useState(null);

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
      return <Loader />;
    }

    console.log(user);
    //console.log(userData);

    /*const [following,setFollowing] =useState(3)
    const [search,setSearch] =useState("")

    const [showMenu,setShowMenu] =useState(false)

    const [images,setImages] =  useState(null)

    const [name,setName]= useState("")
    const [userName,setUserName]= useState("")
    const [profileImg,setProfileImg] =useState(ProfileImg)

    const [modelDetails,setModelDetails] = useState(
      {
        ModelName:"PlaceHolder",
        ModelUserName:"@PlaceHolder",
      }
    )*/

    const setSearch = (value) => {
      this.state.search = value;
    }

    const setShowMenu = (value) => {
      this.state.showMenu = value;
    }

    const setImages = (value) => {
      this.state.images = value;
    }

    const setName = (value) => {
      this.state.name = value;
    }

    const setUserName = (value) => {
      this.state.userName = value;
    }

    const setProfileImg = (value) => {
      this.state.profileImg = value;
    }

    const setModelDetails = (value) => {
      this.state.modelDetails = value;
    }

    if (authState === authStates.LOGGED_IN && !this.state.userData) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      console.log("dedans");
        getUserData(user.email).then(data => {
          this.setState({
            userData: data,
          });
          this.setProfileData(data);
        }
        );
      return <Loader />;
    }

    return (
      <div className='interface'>
          <HeaderBar
          search={this.state.search}
          setSearch={setSearch}
          showMenu={this.state.showMenu}
          setShowMenu={setShowMenu}
          profileImg={this.state.profileImg}
          />
        <div className="home">
          {/* <Left 
          following={following}
          setFollowing={setFollowing}
          profileImg={profileImg}
          modelDetails={modelDetails}
          
          /> */}

          <ProfileMiddle 
          following={this.state.following}
          search={this.state.search}
          images={this.state.images}
          setImages={setImages}
          name={this.state.name}
          setName={setName}
          userName={this.state.userName}
          setUserName={setUserName}
          profileImg={this.state.profileImg}
          setProfileImg={setProfileImg}
          modelDetails={this.state.modelDetails}
          setModelDetails={setModelDetails}
          />
          
          {/* <Right 
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          following={following}
          setFollowing={setFollowing}
          /> */}
        </div>
      </div>
    )
      }
}

export default withAuth(Profile)