import React, { useState, useEffect } from "react";
import "../styles/groupNavigation.css";
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
        <div key={group.id} className="group-header">
          <h1 className="group-nav-link"> {group.name}</h1>
        </div>
        </Link>
      ))}
      
    </div>
  );
};

export default GroupNavigation;