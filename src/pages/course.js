import React from "react";
import "../styles/course.css"
import { authStates, withAuth } from "../components/auth";
import { getUserDataById, getCourseById, getCoursePosts, likePost, newPost, newPostWithImages, newPostWithPool, newPostWithGif, deletePost, getRessourceByGroup } from "../utils/firebase";
//import { set } from "cypress/types/lodash";
import { Redirect } from "react-router-dom";
import Loader from "../components/loader";
import Post from "../components/post";
import { withRouter } from 'react-router-dom';
import PostInput from "../components/postInput";
import { changeColor } from "../components/schoolChoose";
import CourseMiddle from "../components/courseMiddle";
import Info3 from "../images/course-banner-default.jpg"
import Info2 from "../images/course-profile-default.png"
import { AiOutlinePlusCircle } from "react-icons/ai";
import fr from "../utils/i18n";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import Ressource from "../components/ressource";

class Course extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        cid: null,
        dataCollected: false,
        courseImg: Info2,
        courseCover: Info3,
        school: "",
        course: null,
        window: "discussion",
        posts: [],
        admin: false,
        tds: [],
        tps: [],
        exams: [],
        fiches: [],
        ressourcesSetted: false,
        ressourceStartSetted: false,
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
    this.setState({ courseImg: value });
  }

  setModelDetails = (value) => {
    this.setState({ modelDetails: value });
  }

  setCoverImg = (value) => {
    this.setState({ courseCover: value });
  }

  handleWindow = (value) => {
    this.setState({ window: value });
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


  handlePostContentChange = event => {
    if (event === undefined) {
      this.setState({ postContent: "" });
      return;
    }
    this.setState({ postContent: event.target.value });
  };

  handlePostSubmit = (postContent, postImages, pool, gif) => {

    console.log("postImages", postImages);
    console.log("postContent", postContent);

    // Si l'utilisateur a téléchargé des images, enregistrez le post avec les images
    if (postImages.length > 0) {
      newPostWithImages(postContent, this.state.cid + 1, postImages)
        .then((finito) => {
          if (finito) {
            console.log("Post enregistré avec succès");
          }
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else if (pool.length > 0) {
      newPostWithPool(postContent, this.state.cid + 1, pool)
        .then((finito) => {
          if (finito) {
            console.log("Post enregistré avec succès");
          }
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else if (gif) {
      newPostWithGif(postContent, this.state.cid + 1, gif)
        .then((finito) => {
          if (finito) {
            console.log("Post enregistré avec succès");
          }
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    } else {
      // Enregistrez le post dans la base de données Firebase
      newPost(postContent, this.state.cid + 1)
        .then(() => {
          this.setState({ postContent: "" });
          this.handlePostContentChange(); // Réinitialisez le champ de texte du post
          this.updatePosts();
        })
        .catch((error) => {
          console.error("Erreur lors de l'enregistrement du post :", error);
        });
    }
  };

  updatePosts = () => {
    getCoursePosts(this.state.cid + 1).then(
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

  updateResources = () => {
    getRessourceByGroup(this.state.cid, "td").then((ressources) => {
      console.log("ressources", ressources);
      ressources = Object.values(ressources);
      console.log("ressources", ressources);
      ressources.forEach((ressource) => {
        console.log("ressource", ressource);
        if (ressource.type === "td") {
          console.log("ressource", ressource);
          this.state.tds.push(ressource);
        } else if (ressource.type === "tp") {
          this.state.tps.push(ressource);
        } else if (ressource.type === "exam") {
          this.state.exams.push(ressource);
        } else if (ressource.type === "fiche") {
          this.state.fiches.push(ressource);
        } else {
          console.error("Unknown ressource type");
        }
      });
      this.setState({ ressourcesSetted: true });
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
          dataCollected: true,
          school: userData.school,
          admin: userData.admin ? userData.admin : false,
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
        this.setState({ 
          course: Object.values(course)[0],
          courseImg: course.courseImg ? course.courseImg : Info2,
          courseCover: course.coverImg ? course.coverImg : Info3,
          cid: this.props.match.params.cid
        });
        getCoursePosts(this.props.match.params.cid + 1).then(
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
      });
      return <Loader />;
    }

    if (!this.state.ressourcesSetted && !this.state.ressourceStartSetted) {
      this.setState({ ressourceStartSetted: true });
      this.updateResources();
      return <Loader />;
    }

    console.log("this.state.course", this.state.tds);

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
            profileImg={this.state.courseImg}
            setProfileImg={this.setProfileImg}
            modelDetails={modelDetails}
            setModelDetails={this.setModelDetails}
            canModify={this.state.admin}
            uid={user.uid}
            coverImg={this.state.courseCover}
            setCoverImg={this.setCoverImg}
            cid={this.state.cid}
            />
        <p dangerouslySetInnerHTML={{ __html: this.state.course.description }}></p>
        </div>
        <div className="course-navigation">
          <button className={this.state.window === 'discussion' ? 'active' : ""} onClick={() => this.handleWindow('discussion')}>Discussion</button>
          <button className={this.state.window === 'tds' ? 'active' : ""} onClick={() => this.handleWindow('tds')}>TDs</button>
          <button className={this.state.window === 'tps' ? 'active' : ""} onClick={() => this.handleWindow('tps')}>TPs</button>
          <button className={this.state.window === 'exams' ? 'active' : ""} onClick={() => this.handleWindow('exams')}>Exams</button>
          <button className={this.state.window === 'fiches' ? 'active' : ""} onClick={() => this.handleWindow('fiches')}>Fiches</button>
        </div>
        <div className="course-content">
        {this.state.window === 'discussion' && (
          <>
        <PostInput handlePostContentChange={this.handlePostContentChange} handlePostSubmit={this.handlePostSubmit} postContent={this.state.postContent}/>
          <div className="home">


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
        </div></>)}
        {this.state.window === 'tds' && (
          <div className="course-home">
            {this.state.admin && (
              <Link to={`/course/${this.state.cid}/createRessource/td`}><button className="add-button"><AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_TD}</button></Link>
            )}
            <div className="ressource-container">
            {this.state.tds && this.state.tds.map((ressource, index) => (
              <Ressource key={index} ressource={ressource} canModify={this.state.admin} />
            ))}
            </div>
          </div>
        )}
        {this.state.window === 'tps' && (
          <div className="course-home">
            {this.state.admin && (
              <Link to={`/course/${this.state.cid}/createRessource/tp`}><button className="add-button"><AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_TP}</button></Link>
            )}
          </div>
        )}
        {this.state.window === 'exams' && (
          <div className="course-home">
            {this.state.admin && (
              <Link to={`/course/${this.state.cid}/createRessource/exam`} className="add-button"><button><AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_EXAM}</button></Link>
            )}
          </div>
        )}
        {this.state.window === 'fiches' && (
          <div className="course-home">
            <Link to={`/course/${this.state.cid}/createRessource/fiche`}><button className="add-button"><AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_FICHE}</button></Link>
          </div>
        )}
        </div>
      </div>
    )
      }
}

export default withRouter(withAuth(Course));