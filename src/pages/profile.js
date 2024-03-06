import React from "react";
import { useState } from 'react'
// import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../components/profileMiddle'
// import Right from '../../Components/RightSide/Right'
import HeaderBar from '../components/headerBar'
import "../styles/profile.css"
import ProfileImg from "../images/avatar.png"
import { authStates, withAuth } from "../components/auth";
import { getCurrentUser, getUserData, getPostByUser, getUserUID, likePost, getUserDataById } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import { withRouter } from 'react-router-dom';

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
      posts: [],
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
    this.state.search = value;
  }

  setShowMenu = (value) => {
    this.state.showMenu = value;
  }

  setImages = (value) => {
    this.state.images = value;
  }

  setName = (value) => {
    this.state.name = value;
  }

  setUserName = (value) => {
    this.state.userName = value;
  }

  setProfileImg = (value) => {
    this.state.profileImg = value;
  }

  setModelDetails = (value) => {
    this.state.modelDetails = value;
  }

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

  render() {
    //const [user, setUser] = useState(getCurrentUser());

    //const [userData, setUserData] = useState(null);

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


    if (authState === authStates.LOGGED_IN && !this.state.userData) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      /*console.log("dedans");
        getUserData(user.email).then(data => {
          this.setState({
            userData: data,
          });
          this.setProfileData(data);
          getUserUID(data.email).then((uid) => {
            console.log(uid);
            getPostByUser(uid).then(
              (querySnapshot) => {
                const posts = [];
          
                Object.values(querySnapshot).forEach((doc) => {
                  console.log("Doc:", doc);
                  console.log(Object.values(doc)[0]);
                  console.log(data);
                  doc.username = data.name + " " + data.surname;
                  doc.school = data.school;
                  posts.push(doc);
                });

                // Inverser la liste pour avoir les derniers posts en premier
                console.log("posts", posts);
                console.log("querySnapshot.size", querySnapshot);
                // Trie les posts selon leur ordre d'arrivée
                posts.sort((a, b) => a.timestamp - b.timestamp);
                posts.reverse();
                console.log("posts", posts);
                this.setState({ posts });
                this.render();
              });
          });
        }
        );*/
        const { uid } = this.props.match.params;
        getUserDataById(uid)
        .then((userData) => {
          console.log("userData", userData);
          this.setState({
            userData: userData,
          });
          this.setProfileData(userData);
          getPostByUser(uid).then(
            (querySnapshot) => {
              const posts = [];
        
              Object.values(querySnapshot).forEach((doc) => {
                console.log("Doc:", doc);
                console.log(Object.values(doc)[0]);
                console.log(userData);
                doc.username = userData.name + " " + userData.surname;
                doc.school = userData.school;
                posts.push(doc);
              });

              // Inverser la liste pour avoir les derniers posts en premier
              console.log("posts", posts);
              console.log("querySnapshot.size", querySnapshot);
              // Trie les posts selon leur ordre d'arrivée
              posts.sort((a, b) => a.timestamp - b.timestamp);
              posts.reverse();
              console.log("posts", posts);
              this.setState({ posts });
              this.render();
            });
        });
      return <Loader />;
    }

    return (
      <div className='interface'>
          <HeaderBar
          search={this.state.search}
          setSearch={this.setSearch}
          showMenu={this.state.showMenu}
          setShowMenu={this.setShowMenu}
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
          setImages={this.setImages}
          name={this.state.name}
          setName={this.setName}
          userName={this.state.userName}
          setUserName={this.setUserName}
          profileImg={this.state.profileImg}
          setProfileImg={this.setProfileImg}
          modelDetails={this.state.modelDetails}
          setModelDetails={this.setModelDetails}
          />
          
          {/* <Right 
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          following={following}
          setFollowing={setFollowing}
          /> */}
        </div>
        {this.state.posts && this.state.posts.map((post, index) => (
          console.log(post),
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
    )
      }
}

export default withRouter(withAuth(Profile));