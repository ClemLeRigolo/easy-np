import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { getGroups, joinGroup } from "../utils/firebase"; // Importez la fonction joinGroup
import { FaLock, FaUnlock } from "react-icons/fa";
import fr from "../utils/i18n";
import "../styles/groups.css";
import HeaderBar from "../components/headerBar";

class Groups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
    };
    this.handleJoinGroup = this.handleJoinGroup.bind(this); // Liez la méthode handleJoinGroup
  }

  componentDidMount() {
    getGroups().then((groups) => {
      const groups2 = [];
      Object.values(groups).forEach((group) => {
        groups2.push(Object.values(group)[0]);
      });
      this.setState({ groups: groups2 });
    });
  }

  handleJoinGroup(groupId) {
    // Implémentez la fonction pour rejoindre un groupe
    joinGroup(groupId)
      .then(() => {
        console.log("Vous avez rejoint le groupe avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la tentative de rejoindre le groupe :", error);
      });
  }

  render() {
    const { authState, user } = this.props;
    const { groups } = this.state;
    //const userSchool = user.school; // Récupérez l'école de l'utilisateur depuis les props ou l'objet user

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
      return <Loader />;
    }

    if (authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login" />;
    }

    if (authState === authStates.LOGGED_IN && user.emailVerified === false) {
      if (user.emailVerified === false) {
        return <Redirect to="/verify" />;
      }
      return <Loader />;
    }

    return (
      <div className="interface">
        <HeaderBar
          search={""}
          setSearch={""}
          showMenu={false}
          setShowMenu={false}
          uid={user.uid}
        />
        <div className="group-list">
          <Link to="/createGroup" className="create-group-button">
            Créer un groupe
          </Link>
          {groups.map((group) => (
            <div className="group" key={group.id}>
              <h3>
                {group.name}{" "}
                {!group.isPublic && (
                  <img
                    src={require(`../images/écoles/${group.school.toLowerCase()}.png`)}
                    alt={group.school}
                  />
                )}
              </h3>
              <p>{group.description}</p>
              {group.isPublic ? (
                <button onClick={() => this.handleJoinGroup(group.id)}>
                  Rejoindre
                </button>
              ) : (
                <FaLock />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withAuth(Groups);