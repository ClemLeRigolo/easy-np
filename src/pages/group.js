import React from "react";
import "../styles/group.css"
import { authStates, withAuth } from "../components/auth";
import { likePost, getUserDataById, getPostByGroup, newPost, getGroupById, deletePost } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import ChannelNavigation from "../components/channelNavigation";
import { withRouter } from 'react-router-dom';
import PostInput from "../components/postInput";
import { changeColor } from "../components/schoolChoose";
import GroupMiddle from "../components/groupMiddle";
import Info3 from "../images/banner.jpg"
import Info2 from "../images/group-profile-default.jpg"

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
        groupImg: Info2,
        groupBanner: Info3,
        membres: [],
        admins: [],
        waitingList: [],
        membersData: [],
        waitingListData: [],
        membersSetted: false,
        waitingListSetted: false,
        canModify: false,
        showManage: false,
        firstMemberSet: true,
        firstWaitingSet: true
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
      this.setState({ gid: this.props.match.params.gid });
      //this.state.gid = this.props.match.params.gid;
      getPostByGroup(this.props.match.params.gid).then(
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
        getGroupById(this.props.match.params.gid).then((group) => {
            this.setState({ group: Object.values(group)[0] });
            if (group.coverImg) {
              this.setState({ groupBanner: group.coverImg });
            } else {
              this.setState({ groupBanner: Info3 });
            }
            if (group.groupImg) {
              this.setState({ groupImg: group.groupImg });
            } else {
              this.setState({ groupImg: Info2 })
            }
            if (group.members) this.setState({ membres: group.members });
            if (group.admins) this.setState({ admins: group.admins });
            if (group.waitingList) this.setState({ waitingList: group.waitingList });
            if (group.admins) this.setState({ canModify: group.admins.includes(user.uid) })
            }
        );
      return <Loader />;
    }

    if (this.state.group === null) {
        return <Loader />;
    }

    console.log(this.state.group);

    const modelDetails = {
      ModelName: this.state.group.name,
      ModelUserName: "@" + this.state.group.name,
    };

    if (this.state.membersData.length !== this.state.membres.length && !this.state.membersSetted) {
      const promises = [];
      let membersData = [];
      this.state.membres.forEach(member => {
        promises.push(getUserDataById(member).then((userData) => {
          membersData.push(userData);
        }));
      });
      Promise.all(promises).then(() => {
        //revert the list to have the last members first
        if (this.state.firstMemberSet) {
          membersData.reverse();
          this.setState({ firstMemberSet: false })
        }
        this.setState({ membersData});
        this.setState({ membersSetted: true });
      });
      return <Loader />;
    }

    if (this.state.waitingListData.length !== this.state.waitingList.length && !this.state.waitingListSetted) {
      const promises = [];
      let waitingListData = [];
      this.state.waitingList.forEach(waiter => {
        promises.push(getUserDataById(waiter).then((userData) => {
          waitingListData.push(userData);
        }));
      });
      Promise.all(promises).then(() => {
        this.setState({ waitingListData});
        this.setState({ waitingListSetted: true });
      });
      return <Loader />;
    }

    return (
      <div className='interface'>
        <div className="main-container">
          <div className="nav-container">
            <ChannelNavigation gid={this.state.gid} canModify={this.state.canModify} />
          </div>
        <div className="post-list">
        <GroupMiddle 
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
            isSubscribedProps={this.state.isSubscribed}
            nbSubscribers={this.state.nbSubscribers}
            nbSubscriptions={this.state.nbSubscriptions}
            nbPosts={this.state.posts.length}
            nbMembers={this.state.membres.length}
            coverImg={this.state.groupBanner}
            setCoverImg={this.setCoverImg}
            groupId={this.state.gid}
            members={this.state.membres}
            admins={this.state.admins}
            membersData={this.state.membersData}
            addAdmin={this.addAdmin}
            removeAdmin={this.removeAdmin}
            removeMbr={this.removeMbr}
            group={this.state.group}
            waitingList={this.state.waitingList}
            waitingListData={this.state.waitingListData}
            acceptMember={this.acceptMember}
            refuseMember={this.refuseMember}
            showManage={this.state.showManage}
            />
        {/*<h1>{this.state.group.name}</h1>*/}
        <p dangerouslySetInnerHTML={{ __html: this.state.group.description }}></p>
        {this.state.membres.includes(user.uid) && (
          <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent}/>
        )}

        {this.state.membres.includes(user.uid) && this.state.posts && this.state.posts.map((post, index) => (
                    <Post 
                    key={index} 
                    post={post} 
                    handleLikeClick={() => this.handleLikeClick(index)}
                    handleCommentClick={() => this.handleCommentClick(index)} 
                    handleDeletePost={() => this.handleDeletePost(post.id)}
                    likeCount={post.likeCount} 
                    commentCount={post.commentCount} 
                    canModify={this.state.canModify}
                    />
        ))} 

          </div>
        </div>
      </div>
    )
      }
}

export default withRouter(withAuth(Group));