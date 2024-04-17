import React from "react";
// import Left from '../../Components/LeftSide/Left'
import ProfileMiddle from '../components/profileMiddle'
// import Right from '../../Components/RightSide/Right'
import "../styles/profile.css"
import { authStates, withAuth } from "../components/auth";
import { getPostByUser, likePost, getUserDataById, deletePost } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import { withRouter } from 'react-router-dom';
import { changeColor } from "../components/schoolChoose";
import Info3 from "../images/banner.jpg"

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
      coverImg: null,
      modelDetails: {
        ModelName: "PlaceHolder",
        ModelUserName: "@PlaceHolder",
      },
      posts: [],
      isSubscribed: undefined,
      subscriptions: [],
      subscribers: [],
      subscribersData: [],
      subscriptionsData: [],
      subscribersSet: false,
      subscriptionsSet: false,
      nbPosts: null,
    };
  }

  setProfileData = (data) => {
    this.setState({
      name: data.name + " " + data.surname,
      userName: data.name + "_" + data.surname,
      modelDetails: {
        ModelName: data.name + " " + data.surname,
        ModelUserName: data.tag ? "@" + data.tag : "@" + data.name + "_" + data.surname,
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

  setCoverImg = (value) => {
    this.setState({ coverImg: value });
  }

  toggleSubscription = () => {
    // Effectuez les actions nécessaires pour s'abonner/désabonner ici
    // Par exemple, vous pouvez effectuer une requête à votre backend pour mettre à jour l'état de l'abonnement
  
    // Mettez à jour l'état avec le nouvel état de l'abonnement
    this.setState((prevState) => ({
      isSubscribed: !prevState.isSubscribed,
    }));
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

  handleDeletePost = (id) => {
    // Supprimez le post de la base de données Firebase
    deletePost(id)
      .then(() => {
        console.log("Post deleted");
        this.updatePosts();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }

  updatePosts = () => {
    getPostByUser(this.state.uid).then(
      (querySnapshot) => {
        const posts = [];
  
        Object.values(querySnapshot).forEach((doc) => {
          console.log("Doc:", doc);
          console.log(Object.values(doc)[0]);
          console.log(this.state.userData);
          doc.username = this.state.userData.name + " " + this.state.userData.surname;
          doc.school = this.state.userData.school;
          doc.profileImg = this.state.userData.profileImg;
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
        this.setState({ nbPosts: posts.length });
        this.render();
      });
  }

  render() {
    //const [user, setUser] = useState(getCurrentUser());

    //const [userData, setUserData] = useState(null);

    const { authState, user } = this.props;

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
      return <Loader />;
    }


    if ((authState === authStates.LOGGED_IN && !this.state.userData) || (this.props.match.params.uid !== this.state.uid)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
        //this.state.uid = uid;
        //this.setState({uid: this.props.match.params.uid});
        getUserDataById(this.props.match.params.uid)
        .then((userData) => {
          console.log("userData", userData);
          this.setState({
            userData: userData,
            uid: this.props.match.params.uid,
            subscribers: userData.followers ? userData.followers : [],
            subscribersData: [],
            subscriptions: userData.subscriptions ? userData.subscriptions : [],
            subscriptionsData: [],
            subscribersSet: false,
            subscriptionsSet: false,
          });
          if (userData.profileImg) {
            this.setProfileImg(userData.profileImg);
          } else {
            this.setProfileImg(require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`)); // Utilisez l'image par défaut s'il n'y a pas d'URL de profil personnalisée
          }
          if (userData.coverImg) {
            this.setCoverImg(userData.coverImg);
          } else {
            this.setCoverImg(Info3); // Utilisez l'image par défaut s'il n'y a pas d'URL de profil personnalisée
          }
          this.setProfileData(userData);
          getPostByUser(this.props.match.params.uid).then(
            (querySnapshot) => {
              const posts = [];
        
              Object.values(querySnapshot).forEach((doc) => {
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
              this.setState({ 
                posts : posts,
                nbPosts: posts.length,
              });
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
            //this.state.currentUserData.profileImg = require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`);
            this.setState({
              currentUserData: {
                ...this.state.currentUserData,
                profileImg: require(`../images/Profile-pictures/${userData.school}-default-profile-picture.png`),
              },
            });
          }
          //check if this.props.match.params.uid is in this.state.currentUserData.subscriptions
          console.log(userData.subscriptions);
          if (userData.subscriptions && userData.subscriptions.includes(this.props.match.params.uid)) {
            this.setState({ isSubscribed: true });
          } else {
            this.setState({ isSubscribed: false });
          }
          changeColor(userData.school);
        });
      return <Loader />;
    }
    
    if (this.state.subscribers.length > 0 && !this.state.subscribersSet) {
      this.state.subscribers.forEach((subscriber) => {
        getUserDataById(subscriber)
          .then((userData) => {
            userData.uid = subscriber;
            this.setState({
              subscribersData: [...this.state.subscribersData, userData],
            });
          });
      });
      this.setState({ subscribersSet: true });
    }

    if (this.state.subscriptions.length > 0 && !this.state.subscriptionsSet) {
      this.state.subscriptions.forEach((subscription) => {
        getUserDataById(subscription)
          .then((userData) => {
            userData.uid = subscription;
            this.setState({
              subscriptionsData: [...this.state.subscriptionsData, userData],
            });
          });
      });
      this.setState({ subscriptionsSet: true });
    }

    if (this.state.isSubscribed === undefined || this.state.nbPosts === null || this.state.posts === undefined || this.state.userData === null || this.state.currentUserData === null) {
      return <Loader />;
    }

    console.log("this.state", this.state.userData);
    console.log(this.state.subscriptions)
    console.log(this.state.subscriptionsData);

    return (
      <div className='interface'>
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
            canModify={this.state.uid === user.uid}
            uid={this.state.uid}
            isSubscribedProps={this.state.isSubscribed}
            subscribersData={this.state.subscribersData}
            subscriptionsData={this.state.subscriptionsData}
            nbPosts={this.state.nbPosts}
            coverImg={this.state.coverImg}
            setCoverImg={this.setCoverImg}
            userData={this.state.userData}
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
              handleDeletePost={() => this.handleDeletePost(post.id)}
              likeCount={post.likeCount} 
              commentCount={post.commentCount} 
            />
          ))} 

          </div>
        </div>
    )
      }
}

export default withRouter(withAuth(Profile));