import React from "react";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import { AiOutlinePlusCircle  } from "react-icons/ai";
import { MdKeyboardArrowRight, MdKeyboardArrowDown } from "react-icons/md";
import { slide as Menu } from "react-burger-menu";
import { getSaloonByGroup, getGroupsByUser } from "../utils/firebase";
import firebase from "firebase/app";
import Loader from "./loader";
// import "../styles/test.css";

class ChannelNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      saloons: [],
      saloonsCollected: false,
      activeGroup: null,
    };
  }

  handleGroupClick = (groupId) => {
    this.setState((prevState) => ({
      activeGroup: prevState.activeGroup === groupId ? null : groupId,
    }));
  };

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
  }

  render() {
    const { gid } = this.props;
    const { groups } = this.state;

    if (!this.state.saloonsCollected) {
      return <Loader />;
    }

    return (
      <div className="group-navigation">
        <Menu >
        {this.state.groups &&
          groups.map((group) => (
            <div key={group.id} className="group-header">
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
                  {this.props.canModify && (
                  <Link to={`/group/${group.id}/createSaloon`} activeClassName="active">
                    <div className="group-nav-item">
                      <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_SALOON}
                    </div>
                  </Link>
                )}

                  <Link to={`/group/${group.id}`} activeClassName="active">
                    <div className="group-nav-item">Général</div>
                  </Link>

                  <Link to={`/group/${group.id}/events`} activeClassName="active">
                    <div className="group-nav-item">Événements</div>
                  </Link>

                  {group.saloons && Object.values(group.saloons).length > 0 &&
                    Object.values(group.saloons).map((saloon) => (
                      <Link
                        to={`/group/${group.id}/saloon/${saloon.id}`}
                        key={saloon.id}
                        activeClassName="active"
                      >
                        <div className="group-nav-item">{saloon.name}</div>
                      </Link>
                    ))}
                </>
              )}
            </div>
          ))}
        </Menu>
      </div>
    );
  }
}

export default ChannelNavigation;