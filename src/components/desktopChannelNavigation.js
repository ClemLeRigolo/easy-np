import React from "react";
import { Link, withRouter } from 'react-router-dom';
import fr from "../utils/i18n";
import { AiOutlinePlusCircle  } from "react-icons/ai";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { getSaloonByGroup, getGroupsByUser, isUserAdminOfGroup } from "../utils/firebase";
import firebase from "firebase/app";
// import "../styles/test.css";

class ChannelNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      saloons: [],
      saloonsCollected: false,
      activeGroup: null,
      canModify: false,
      adminCollected: false,
      url: ''
    };
  }

  handleGroupClick = (groupId) => {
    this.setState((prevState) => ({
      activeGroup: prevState.activeGroup === groupId ? null : groupId,
    }));
  };

  handleSaloonClick = (saloonId) => {
    this.setState((prevState) => ({
      adminCollected: false,
    }));
  }

  componentDidMount() {
    const user = firebase.auth().currentUser;

    getGroupsByUser(user.uid)
      .then((groups) => {
        const saloonPromises = Object.values(groups).map((group) => {
          return getSaloonByGroup(group.id)
            .then((saloons) => {
              group.saloons = saloons;
              return group;
            });
        });
        return Promise.all(saloonPromises);
      })
      .then((groups) => {
        this.setState({ groups, saloonsCollected: true });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

      const { history } = this.props;
      this.updateUrl(history.location);
  
      this.unlisten = history.listen((location) => {
        this.updateUrl(location);
      });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  updateUrl(location) {
    const url = location.pathname.split('/')[1];
    this.setState({ url });
  }

  render() {
    const { open, gid } = this.props;
    const { groups, url } = this.state;
    const urlGroup = window.location.pathname.split("/")[2];

    if (url === 'login' || url === 'signup' || url === 'verify' || url === 'reset') {
      return null;
    }

    if (!this.state.saloonsCollected) {
      return <div />;
    }
    //if(!open) return null;

    //check if /group is in the url
    if (window.location.pathname.split("/")[1] === "group" && !this.state.adminCollected) {
      //get the group id from the url
      isUserAdminOfGroup(urlGroup, firebase.auth().currentUser.uid).then((isAdmin) => {
        console.log("isAdmin", isAdmin);
        this.setState({ 
          canModify: isAdmin,
          adminCollected: true,
        });
      }
      );
    }

    return (
      <>
      <div className={`group-navigation ${open ? 'open' : ''}`} data-cy="navGroup">
        {this.state.groups &&
          groups.map((group,index) => (
            <div key={group.id} className="group-header" style={{ animationDelay: `${(index+1)/10}s` }}>
              {/* <Link to={`/group/${group.id}`}> */}
                <h1
                  className={`group-nav-link ${group.id === gid ? 'active' : ''}`}
                  onClick={() => this.handleGroupClick(group.id)}
                >
                  {group.name}
                  {this.state.activeGroup === group.id ? (
                  <MdKeyboardArrowDown className="dropdown-icon" />
                ) : (
                  <MdKeyboardArrowRight className="dropdown-icon" />
                )}
                </h1>
              {/* </Link> */}

              {this.state.activeGroup === group.id && (
                <>
                  {this.state.canModify && this.state.activeGroup == urlGroup && (
                  <Link to={`/group/${group.id}/createSaloon`} activeClassName="active">
                    <div className="group-nav-item" >
                      <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_SALOON}
                    </div>
                  </Link>
                )}

                  <Link to={`/group/${group.id}`} activeClassName="active" onClick={() => this.handleSaloonClick("général")}>
                    <div className="group-nav-item">Général</div>
                  </Link>

                  <Link to={`/group/${group.id}/events`} activeClassName="active" onClick={() => this.handleSaloonClick("évènements")}>
                    <div className="group-nav-item">Événements</div>
                  </Link>

                  {group.saloons && Object.values(group.saloons).length > 0 &&
                    Object.values(group.saloons).map((saloon) => (
                      <Link
                        to={`/group/${group.id}/saloon/${saloon.id}`}
                        key={saloon.id}
                        activeClassName="active"
                        onClick={() => this.handleSaloonClick(saloon.id)}
                      >
                        <div className="group-nav-item">{saloon.name}</div>
                      </Link>
                    ))}
                </>
              )}
            </div>
          ))}
          <div className="bg">
            </div>
      </div>
      <div className="group-navigation-ghost" />
      </>
    );
  }
  
}

export default withRouter(ChannelNavigation);
