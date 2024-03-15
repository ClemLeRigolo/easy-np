import React from "react";
// import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../components/profileMiddle'
// import Right from '../../Components/RightSide/Right'
import HeaderBar from '../components/headerBar'
import "../styles/profile.css"
import ProfileImg from "../images/avatar.png"
import { authStates, withAuth } from "../components/auth";
import { getPostByUser, likePost, getUserDataById } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import GroupNavigation from "../components/groupNavigation";
import { withRouter } from 'react-router-dom';
import { changeColor } from "../components/schoolChoose";

class Profile extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      uid: null,
      userData: null,
      currentUserData: null,
      following: 3,
      search: "",
      showMenu: false,
      images: null,
      name: "",
      userName: "",
      profileImg: null,
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
    this.setState({ profileImg: value });
  }

  setModelDetails = (value) => {
    this.setState({ modelDetails: value });
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


    if ((authState === authStates.LOGGED_IN && !this.state.userData) || (this.props.match.params.uid !== this.state.uid)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
        const { uid } = this.props.match.params;
        this.state.uid = uid;
        getUserDataById(uid)
        .then((userData) => {
          console.log("userData", userData);
          this.setState({
            userData: userData,
          });
          if (userData.profileImg) {
            this.setProfileImg(userData.profileImg);
          } else {
            this.setProfileImg(require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`)); // Utilisez l'image par défaut s'il n'y a pas d'URL de profil personnalisée
          }
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
                doc.profileImg = userData.profileImg;
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

    if (authState === authStates.LOGGED_IN && !this.state.currentUserData) {
      console.log(user);
      getUserDataById(user.uid)
        .then((userData) => {
          this.setState({
            currentUserData: userData,
          });
          if (!this.state.currentUserData.profileImg) {
            this.state.currentUserData.profileImg = require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`);
          }
          changeColor(userData.school);
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
          profileImg={this.state.currentUserData.profileImg}
          uid={user.uid}
          />
        <div className="main-container">
        <GroupNavigation />
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


  {this.state.posts && this.state.posts.map((post, index) => (
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
        </div>
      </div>
    )
      }
}

export default withRouter(withAuth(Profile));