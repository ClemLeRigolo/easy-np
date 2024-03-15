import React from "react";
import HeaderBar from '../components/headerBar'
import "../styles/group.css"
import { authStates, withAuth } from "../components/auth";
import { likePost, getUserDataById, getPostByGroup, newPost, getGroupById } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import GroupNavigation from "../components/groupNavigation";
import { withRouter } from 'react-router-dom';
import PostInput from "../components/postInput";
import { changeColor } from "../components/schoolChoose";

class Group extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        gid: null,
        posts: [],
        postContent: "",
        group: null,
        profileImg: null,
        dataCollected: false,
    };
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

  handlePostContentChange = event => {
    if (event === undefined) {
      this.setState({ postContent: "" });
      return;
    }
    this.setState({ postContent: event.target.value });
  };

  handlePostSubmit = (postContent) => {

    console.log("postContent", postContent);
    // Enregistrez le post dans la base de données Firebase
    newPost(postContent,this.state.gid)
      .then(() => {
        this.setState({ postContent: "" });
        this.handlePostContentChange(); // Réinitialisez le champ de texte du post
        this.updatePosts();
      })
      .catch((error) => {
        console.error("Erreur lors de l'enregistrement du post :", error);
      });
  };

  updatePosts = () => {
    getPostByGroup(this.state.gid).then(
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
            console.log("posts", posts);
            console.log("querySnapshot.size", querySnapshot);
            // Trie les posts selon leur ordre d'arrivée
            posts.sort((a, b) => a.timestamp - b.timestamp);
            posts.reverse();
            console.log("posts", posts);
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

    if ((this.props.match.params.gid !== this.state.gid)) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      //this.setState({ gid: this.props.match.params.gid });
      this.state.gid = this.props.match.params.gid;
      getPostByGroup(this.state.gid).then(
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
                console.log("posts", posts);
                console.log("querySnapshot.size", querySnapshot);
                // Trie les posts selon leur ordre d'arrivée
                posts.sort((a, b) => a.timestamp - b.timestamp);
                posts.reverse();
                console.log("posts", posts);
                this.setState({ posts });
            });
        });
        getGroupById(this.state.gid).then((group) => {
            this.setState({ group: Object.values(group)[0] });
            }
        );
      return <Loader />;
    }

    if (this.state.group === null) {
        return <Loader />;
    }

    console.log(this.state.group);

    return (
      <div className='interface'>
          <HeaderBar
          search={this.state.search}
          setSearch={this.setSearch}
          showMenu={this.state.showMenu}
          setShowMenu={this.setShowMenu}
          profileImg={this.state.profileImg}
          uid={user.uid}
          />
        <div className="main-container">
        <GroupNavigation />
        <div className="group-content">
        <h1>{this.state.group.name}</h1>
        <p>{this.state.group.description}</p>
        <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent}/>
          <div className="home">


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
      </div>
    )
      }
}

export default withRouter(withAuth(Group));