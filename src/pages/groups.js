import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createGroup, getGroups } from "../utils/firebase"; // Importez la fonction pour créer un groupe

import fr from "../utils/i18n";
import "../styles/createGroup.css";
import HeaderBar from "../components/headerBar";

class Group extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
    };
  }

  componentDidMount() {
    getGroups().then((groups) => {
      console.log("groups", groups);
      this.setState({ groups });
    });
  }

  render() {
    const { authState, user } = this.props;
    const { groupName, visibility, school, redirect } = this.state;

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
      return <Loader />;
    }

    if (authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login"></Redirect>;
    }

    if (authState === authStates.LOGGED_IN && user.emailVerified === false) {
      if (user.emailVerified === false) {
        return <Redirect to="/verify"></Redirect>;
      }
      return <Loader />;
    }

    return (
      <div className="interface">
        
      </div>
    );
  }
}

export default withAuth(CreateGroup);