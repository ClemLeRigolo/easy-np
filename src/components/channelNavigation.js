import React from "react";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { getSaloonByGroup, getGroupsByUser } from "../utils/firebase";
import firebase from "firebase/app";
import Loader from "./loader";


class ChannelNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      saloons: [],
      saloonsCollected: false,
    };
  }

  render() {
    const { gid } = this.props;
    const { saloons, groups } = this.state;
    const user = firebase.auth().currentUser;
    if (!this.state.saloonsCollected) {
      getSaloonByGroup(gid).then((saloons) => {
        this.setState({ saloons, saloonsCollected: true });
      });
      getGroupsByUser(user.uid).then((groups) => {
        console.log("groups", groups);
        this.setState({ groups });
      });
      return <Loader />;
    }

    return (
      <div className="group-navigation">
        {groups &&
          groups.map((group) => (
            <div key={group.id} className="group-header">
              <Link to={`/group/${group.id}`}>
                <h1 className="group-nav-link">{group.name}</h1>
              </Link>
    
              <Link to={`/group/${group.id}/createSaloon`} activeClassName="active">
                <div className="group-nav-item">
                  <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_SALOON}
                </div>
              </Link>
    
              <Link to={`/group/${group.id}`} activeClassName="active">
                <div className="group-nav-item">Général</div>
              </Link>
    
              <Link to={`/group/${group.id}/events`} activeClassName="active">
                <div className="group-nav-item">Événements</div>
              </Link>
    
              {saloons &&
                saloons.map((saloon) => (
                  <Link
                    to={`/group/${group.id}/saloon/${saloon.id}`}
                    key={saloon.id}
                    activeClassName="active"
                  >
                    <div className="group-nav-item">{saloon.name}</div>
                  </Link>
                ))}
            </div>
          ))}
      </div>
    );
};
}
export default ChannelNavigation;