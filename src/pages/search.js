import React from 'react';
import { withAuth, authStates } from '../components/auth';
import { getUserData, getUserDataById, searchPost, searchEvent, searchGroup, searchCourse, searchUser, likeEvent, likePost, deletePost, deleteEvent, subscribeToUser, unsubscribeFromUser } from '../utils/firebase';
import { changeColor } from '../components/schoolChoose';
import { Redirect } from 'react-router-dom';
import Loader from '../components/loader';
import fr from '../utils/i18n';
import Post from '../components/post';
import SuggestionUser from '../components/suggestionUser';
import Event from '../components/event';
import GroupMembership from '../components/groupMembership';
import { Link } from 'react-router-dom';
import ProfileImage from '../components/profileImage';
import '../styles/search.css';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      currentUser: null,
      authState: null,
      firstName: null,
      lastName: null,
      school: null,
      search: '',
      isLoading: true,
      window: "posts",
      posts: [],
      postSetted: false,
      events: [],
      eventsSetted: false,
      users: [],
      usersSetted: false,
      groups: [],
      groupsSetted: false,
      courses: [],
      coursesSetted: false,
    };
  }

  handleLikeClick = (postIndex) => {
    const { posts } = this.state;
    const post = posts[postIndex];

    likePost(post.id)
      .then((data) => {
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

  handleEventLikeClick = (postIndex) => {
    const { events } = this.state;
    const post = events[postIndex];

    likeEvent(post.id)
      .then((data) => {
        // Effectuez les actions nécessaires sur le post ici, par exemple, augmentez le likeCount
        post.likeCount += data.status;
        post.likes = data.likes;
      
        // Mettez à jour l'état avec le post modifié
        this.setState({
          events: [...events.slice(0, postIndex), post, ...events.slice(postIndex + 1)]
        });
      })
      .catch((error) => {
        console.error("Erreur lors du like du post :", error);
      });
  };

  handleDeletePost = (id) => {
    // Supprimez le post de la base de données Firebase
    deletePost(id)
      .then(() => {
        this.updatePosts();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }

  handleSubscriptionToUser = (userId) => {
    if (this.state.currentUser.subscriptions.includes(userId)) {
      unsubscribeFromUser(userId)
        .then(() => {
          this.setState({ currentUser: { ...this.state.currentUser, subscriptions: this.state.currentUser.subscriptions.filter((sub) => sub !== userId) } });
        });
    } else {
      subscribeToUser(userId)
        .then(() => {
          this.setState({ currentUser: { ...this.state.currentUser, subscriptions: [...this.state.currentUser.subscriptions, userId] } });
        });
    }
  }

  loadRessourceAsked = (window) => {
    if (window === "events" && !this.state.eventsSetted) {
      searchEvent(this.state.search).then((querySnapshot) => {
        const events = [];
        const promises = [];

        Object.values(querySnapshot).forEach((doc) => {
          console.log(doc);
          const promise = getUserDataById(doc.creator).then((data) => {
            doc.username = data.name + ' ' + data.surname;
            doc.school = data.school;
            doc.profileImg = data.profileImg;
            events.push(doc);
          });
          promises.push(promise);
        });

        Promise.all(promises).then(() => {
          console.log(events);
          this.setState({ events });
          this.setState({ isLoading: false, eventsSetted: true });
        });
      });
    } else if (window === "users" && !this.state.usersSetted) {
      searchUser(this.state.search).then((querySnapshot) => {
        this.setState({ 
          isLoading: false, 
          usersSetted: true,
          users: querySnapshot,
        });
      });
    } else if (window === "groups" && !this.state.groupsSetted) {
      searchGroup(this.state.search).then((querySnapshot) => {
        this.setState({ 
          isLoading: false, 
          groupsSetted: true,
          groups: querySnapshot,
        });
      });
    } else if (window === "courses" && !this.state.coursesSetted) {
      searchCourse(this.state.search).then((querySnapshot) => {
        this.setState({ 
          isLoading: false, 
          coursesSetted: true,
          courses: querySnapshot,
        });
      });
    }
  }

  loadPosts = () => {
    const searchQuery = new URLSearchParams(this.props.location.search).get('s');
    searchPost(searchQuery).then((querySnapshot) => {
      const posts = [];
      const promises = [];

      Object.values(querySnapshot).forEach((doc) => {
        const promise = getUserDataById(doc.user).then((data) => {
          doc.username = data.name + ' ' + data.surname;
          doc.school = data.school;
          doc.profileImg = data.profileImg;
          posts.push(doc);
        });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        posts.sort((a, b) => a.points - b.points);
        this.setState({ posts });
        this.setState({ isLoading: false, postSetted: true });
      });
    });
  }

  componentDidMount() {
    const { user, authState } = this.props;

    this.setState({
      user: user,
      authState: authState,
    });

    const searchQuery = new URLSearchParams(this.props.location.search).get('s');
    if (searchQuery) {
      this.setState({
        search: searchQuery,
      });
    } else {
      return <Redirect to="/" />;
    }

    searchPost(searchQuery).then((querySnapshot) => {
      const posts = [];
      const promises = [];

      Object.values(querySnapshot).forEach((doc) => {
        const promise = getUserDataById(doc.user).then((data) => {
          doc.username = data.name + ' ' + data.surname;
          doc.school = data.school;
          doc.profileImg = data.profileImg;
          posts.push(doc);
        });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        posts.sort((a, b) => a.points - b.points);
        posts.reverse();
        this.setState({ posts });
        this.setState({ isLoading: false, postSetted: true });
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      const searchQuery = new URLSearchParams(this.props.location.search).get('s');
      if (searchQuery) {
        this.setState({
          search: searchQuery,
          window: "posts",
          postSetted: false,
          eventsSetted: false,
          usersSetted: false,
          groupsSetted: false,
          coursesSetted: false,
          posts: [],
          events: [],
          users: [],
          groups: [],
          courses: [],
        });
      }

      this.loadPosts();
    }
  }

  handleWindow = (window) => {
    this.setState({ window });
    this.loadRessourceAsked(window);
  }

  render() {
    const { search, isLoading } = this.state;
    const { authState, user } = this.props;

    if (authState === authStates.INITIAL_VALUE || isLoading) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_IN && !this.state.currentUser) {
      getUserData(user.email)
        .then((data) => {
          console.log(data);
          this.setState({
            firstName: data.name, 
            lastName: data.surname,
            school: data.school,
            currentUser: data,
          });
          changeColor(data.school);
        })
        .finally(() => {
          this.setState({ isLoading: false }); // Set isLoading to false
        });
      return <Loader />;
    }

    if (authState === authStates.LOGGED_IN && (!search || search !== new URLSearchParams(this.props.location.search).get('s'))) {
      const searchQuery = new URLSearchParams(this.props.location.search).get('s');
      if (searchQuery) {
        this.setState({
          search: searchQuery,
        });
      } else {
        return <Redirect to="/" />;
      }
    }

    return (
        <div className="home-content">
          <div className="post-list">
          <h1>{fr.SEARCH.RESULTS_FOR} : "{this.state.search}"</h1>
          <div className="course-navigation">
            <button className={this.state.window === 'posts' ? 'active' : ""} onClick={() => this.handleWindow('posts')}>Posts</button>
            <button className={this.state.window === 'events' ? 'active' : ""} onClick={() => this.handleWindow('events')}>Evenements</button>
            <button className={this.state.window === 'groups' ? 'active' : ""} onClick={() => this.handleWindow('groups')}>Groupes</button>
            <button className={this.state.window === 'courses' ? 'active' : ""} onClick={() => this.handleWindow('courses')}>Cours</button>
            <button className={this.state.window === 'users' ? 'active' : ""} onClick={() => this.handleWindow('users')}>Personnes</button>
          </div>
            {this.state.window === 'posts' && (
              <>
                {this.state.postSetted ? (
                  <>
                    {this.state.posts.length > 0 ? (
                    this.state.posts.map((post,index) => (
                      <Post 
                        key={post.id} 
                        post={post} 
                        handleLikeClick={() => this.handleLikeClick(index)}
                        handleCommentClick={() => this.handleCommentClick(index)} 
                        handleDeletePost={() => this.handleDeletePost(post.id)}
                        likeCount={post.likeCount} 
                        commentCount={post.commentCount} 
                      />
                    ))
                  ) : (
                    <p>{fr.SEARCH.NO_RESULTS}</p>
                  )}
                  </>
                  ) : (
                    <Loader />
                  )}
              </>
            )}
            {this.state.window === 'events' && (
              <>
                {this.state.eventsSetted ? (
                  <>
                    {this.state.events.length > 0 ? (
                    this.state.events.map((event,index) => (
                      <Event 
                        key={event.id} 
                        post={event} 
                        handleLikeClick={() => this.handleEventLikeClick(index)}
                        handleCommentClick={() => this.handleCommentClick(index)} 
                        handleDeletePost={() => this.handleDeletePost(event.id)}
                        likeCount={event.likeCount} 
                        commentCount={event.commentCount}
                      />
                    ))
                  ) : (
                    <p>{fr.SEARCH.NO_RESULTS}</p>
                  )}
                  </>
                  ) : (
                    <Loader />
                  )}
              </>
            )}
            {this.state.window === 'groups' && (
              <>
                {this.state.groupsSetted ? (
                  <>
                    {this.state.groups.length > 0 ? (
                    this.state.groups.map((group) => (
                      <div className="group" key={group.id}>
                      <Link to={`/group/${group.id}`} >
                      <h3>
                        {group.name}{" "}
                        {group.school !== "all" ? (
                          <img
                            src={require(`../images/écoles/${group.school.toLowerCase()}.png`)}
                            alt={group.school}
                          />
                        ) : null}
                      </h3>
                      <p>{group.description}</p>
                      </Link>
                      <GroupMembership group={group} userSchool={null} fromGroup={false} />
                    </div>
                    ))
                  ) : (
                    <p>{fr.SEARCH.NO_RESULTS}</p>
                  )}
                  </>
                  ) : (
                    <Loader />
                  )}
              </>
            )}
            {this.state.window === 'courses' && (
              <>
                {this.state.coursesSetted ? (
                  <>
                    {this.state.courses.length > 0 ? (
                    this.state.courses.map((course) => (
                      <Link to={`/course/${course.id}`} className="course" key={course.id}>
                        <h3>{course.name}</h3>
                        <p>{course.description}</p>
                      </Link>
                    ))
                  ) : (
                    <p>{fr.SEARCH.NO_RESULTS}</p>
                  )}
                  </>
                  ) : (
                    <Loader />
                  )}
              </>
            )}
            {this.state.window === 'users' && (
              <>
                {this.state.usersSetted ? (
                  <>
                    {this.state.users.length > 0 ? (
                    this.state.users.map((user) => (
                      <div className='user-searched'>
                        <div className='profile-header'>
                          <Link to={`/profile/${user.id}`} className="post-username">
                            <ProfileImage uid={user.id} />
                            <h3>{user.name} {user.surname}</h3>
                            <img src={require(`../images/écoles/${user.school}.png`)} alt="School" className="post-school" />
                          </Link>
                          {this.state.currentUser.subscriptions.includes(user.id) ? (
                            this.state.currentUser.id !== user.id ? <button className='unfollow-btn' onClick={()=> this.handleSubscriptionToUser(user.id)}>{fr.PROFILE.UNSUBSCRIBE}</button> : null
                          ) : (
                            <button className='follow-btn' onClick={()=> this.handleSubscriptionToUser(user.id)}>{fr.PROFILE.SUBSCRIBE}</button>
                          )}
                        </div>
                        {user.bio && <p className='user-bio' dangerouslySetInnerHTML={{ __html: user.bio }}></p>}
                      </div>
                    ))
                  ) : (
                    <p>{fr.SEARCH.NO_RESULTS}</p>
                  )}
                  </>
                  ) : (
                    <Loader />
                  )}
              </>
            )}
          </div>
          <div className="right-column-ghost"/>
          <div className="right-column">
            <SuggestionUser userData={this.state.currentUser} />
          </div>
        </div>
    );
  }
}

export default withAuth(Search);