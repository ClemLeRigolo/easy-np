import React from "react";
import { Link } from "react-router-dom";

const ChannelNavigation = ({gid}) => {
  return (
    <div className="group-navigation">
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
      {/* Ajoutez d'autres boutons de navigation ici */}
    </div>
  );
};

export default ChannelNavigation;