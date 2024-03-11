import React, { useState, useEffect } from "react";
import "../styles/groupNavigation.css";
import { FaUserFriends, FaCalendarAlt, FaQuestionCircle } from "react-icons/fa";
import { RxGlobe } from "react-icons/rx";
import fr from "../utils/i18n";
import firebase from "firebase/app";
import { getGroupsByUser } from "../utils/firebase";
import { Link } from "react-router-dom";

const GroupNavigation = () => {
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      getGroupsByUser(user.uid)
        .then((groups) => {
          setUserGroups(groups);
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des groupes :", error);
        });
    }
  }, []);

  return (
    <div className="group-navigation">
      {userGroups.map((group) => (
        <Link to={`/group/${group.id}`} key={group.id}>
        <div key={group.id} className="group-nav-item">
          <FaUserFriends className="group-nav-icon" />
          <span className="group-nav-link">{group.name}</span>
        </div>
        </Link>
      ))}
      <div className="group-nav-item">
        <FaCalendarAlt className="group-nav-icon" />
        <span className="group-nav-link">{fr.GROUPS.EVENTS}</span>
      </div>
      <div className="group-nav-item">
        <FaQuestionCircle className="group-nav-icon" />
        <span className="group-nav-link">{fr.GROUPS.ABOUT}</span>
      </div>
    </div>
  );
};

export default GroupNavigation;