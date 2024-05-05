import React from 'react';
import { withAuth, authStates } from '../components/auth';
import { getUserData, getUserDataById, searchPost, searchEvent, searchGroup, searchCourse, searchUser } from '../utils/firebase';
import { changeColor } from '../components/schoolChoose';
import { Redirect } from 'react-router-dom';
import Loader from '../components/loader';
import fr from '../utils/i18n';
import Post from '../components/post';
import SuggestionUser from '../components/suggestionUser';
import Event from '../components/event';
import GroupMembership from '../components/groupMembership';
import { Link } from 'react-router-dom';

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

  hasToLoad = () => {
    return (this.window === "posts" && !this.state.postSetted) || (this.window === "events" && !this.state.eventsSetted) || (this.window === "users" && !this.state.usersSetted) || (this.window === "groups" && !this.state.groupsSetted) || (this.window === "courses" && !this.state.coursesSetted);
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
        console.log(doc);
        const promise = getUserDataById(doc.user).then((data) => {
          doc.username = data.name + ' ' + data.surname;
          doc.school = data.school;
          doc.profileImg = data.profileImg;
          posts.push(doc);
        });
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        console.log(posts);
        this.setState({ posts });
        this.setState({ isLoading: false, postSetted: true });
      });
    });
  }

  handleWindow = (window) => {
    this.setState({ window });
    this.loadRessourceAsked(window);
  }

  render() {
    const { search, isLoading } = this.state;
    const { authState, user } = this.props;

    if (authState === authStates.INITIAL_VALUE || this.hasToLoad() || isLoading) {
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
          <h1>{fr.SEARCH.RESULTS_FOR} : {this.state.search}</h1>
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
                    this.state.posts.map((post) => (
                      <Post key={post.id} post={post} />
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
                    this.state.events.map((event) => (
                      <Event key={event.id} post={event} />
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
                      console.log(user),
                      <div className='user-searched'>
                        <Link to={`/profile/${user.id}`}>
                          <h3>{user.name} {user.surname}</h3>
                          <p>{user.school}</p>
                        </Link>
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