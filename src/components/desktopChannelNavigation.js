import React from "react";
import { Link, withRouter } from 'react-router-dom';
import fr from "../utils/i18n";
import { AiOutlinePlusCircle  } from "react-icons/ai";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { getSaloonByGroup, getGroupsByUser, isUserAdminOfGroup } from "../utils/firebase";
import firebase from "firebase/app";
// import "../styles/test.css";
import { FaUserGroup } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";

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
        <div className="group-header" style={{ animationDelay: `0.1s` }}>
          <h1 className="your-groups">
            <FaUserGroup /> {fr.GROUPS.YOUR_GROUPS} :
          </h1>
        </div>
        {this.state.groups &&
          groups.map((group,index) => (
            <div key={group.id} className="group-header" style={{ animationDelay: `${(index+1)/10}s` }}>
              {/* <Link to={`/group/${group.id}`}> */}
                <h1
                  className={`group-nav-link ${group.id === gid ? 'active' : ''}`}
                  onClick={() => this.handleGroupClick(group.id)}
                  data-cy="groupLink"
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
                  <Link to={`/group/${group.id}/createSaloon`} activeClassName="active" data-cy='createSaloon'>
                    <div className="group-nav-item">
                      <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_SALOON}
                    </div>
                  </Link>
                )}

                  <Link to={`/group/${group.id}`} activeClassName="active" onClick={() => this.handleSaloonClick("général")} data-cy='salonLink'>
                    <div className="group-nav-item">Général</div>
                  </Link>

                  <Link to={`/group/${group.id}/events`} activeClassName="active" onClick={() => this.handleSaloonClick("évènements")} data-cy='salonLink'>
                    <div className="group-nav-item">Événements</div>
                  </Link>

                  {group.saloons && Object.values(group.saloons).length > 0 &&
                    Object.values(group.saloons).map((saloon) => (
                      <Link
                        to={`/group/${group.id}/saloon/${saloon.id}`}
                        key={saloon.id}
                        activeClassName="active"
                        data-cy='salonLink'
                        onClick={() => this.handleSaloonClick(saloon.id)}
                      >
                        <div className="group-nav-item">{saloon.name}</div>
                      </Link>
                    ))}
                </>
              )}
            </div>
          ))}
          {(!this.state.groups || this.state.groups.length === 0) && (
            <div className="group-header" style={{ animationDelay: `0.3s` }}>
              <Link to="/groups" className='no-groups'>
              <h1 className="group-nav-link">
                {fr.GROUPS.NO_GROUPS}
              </h1>
              <FaArrowRight />
              </Link>
            </div>
          )}
          <div className="bg">
            </div>
      </div>
      <div className="group-navigation-ghost" />
      </>
    );
  }
  
}

export default withRouter(ChannelNavigation);
