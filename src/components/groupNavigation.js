import React from "react";
import "../styles/groupNavigation.css";
import { FaUserFriends, FaCalendarAlt, FaQuestionCircle} from "react-icons/fa";
import { RxGlobe } from "react-icons/rx";
import { Link } from "react-router-dom";
import fr from "../utils/i18n";

class GroupNavigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Définir l'état initial de la composante ici
    };
  }

  // Définir les méthodes de la classe ici

  render() {
    return (
      <div className="group-navigation">
        <div className="group-nav-item">
          <RxGlobe className="group-nav-icon" />
          <Link to="/general" className="group-nav-link">
            {fr.GROUPS.GENERAL}
          </Link>
        </div>
        <div className="group-nav-item">
          <FaUserFriends className="group-nav-icon" />
          <Link to="/members" className="group-nav-link">
            {fr.GROUPS.MEMBERS}
          </Link>
        </div>
        <div className="group-nav-item">
          <FaCalendarAlt className="group-nav-icon" />
          <Link to="/events" className="group-nav-link">
          {fr.GROUPS.EVENTS}
          </Link>
        </div>
        <div className="group-nav-item">
          <FaQuestionCircle className="group-nav-icon" />
          <Link to="/about" className="group-nav-link">
          {fr.GROUPS.ABOUT}
          </Link>
        </div>
      </div>
    );
  }
}

export default GroupNavigation;