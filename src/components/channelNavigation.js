import React from "react";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { getSaloonByGroup } from "../utils/firebase";
import Loader from "./loader";


class ChannelNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      saloons: [],
      saloonsCollected: false,
    };
  }

  render() {
    const { gid } = this.props;
    const { saloons } = this.state;

    if (!this.state.saloonsCollected) {
      getSaloonByGroup(gid).then((saloons) => {
        this.setState({ saloons, saloonsCollected: true });
      });
      return <Loader />;
    }

    return (
      <div className="group-navigation">
        <Link to={`/group/${gid}/createSaloon`} activeClassName="active">
        <div className="group-nav-item">
          <AiOutlinePlusCircle /> {fr.FORM_FIELDS.CREATE_SALOON}
          </div>
        </Link>
        <Link to={`/group/${gid}`} activeClassName="active">
          <div className="group-nav-item">
          Général
          </div>
        </Link>
        <Link to={`/group/${gid}/events`} activeClassName="active">
          <div className="group-nav-item">
          Événements
          </div>
        </Link>
        {saloons && saloons.map((saloon) => (
          console.log("saloon", saloon),
          <Link to={`/group/${gid}/${saloon.id}`} activeClassName="active">
            <div className="group-nav-item">
            {saloon.name}
            </div>
          </Link>
        ))}
      </div>
  );
};
}
export default ChannelNavigation;