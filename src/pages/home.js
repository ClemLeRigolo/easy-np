import React from "react";
import { Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import { signOut } from "../utils/firebase";
import Loader from "../components/loader";

import "../styles/login.css";

function handleSignOut() {
  signOut()
    .then(() => {
      console.log("Signed Out");
    })
    .catch(e => {
      console.log("Error signing out", e);
    });
}

class Home extends React.Component {
  render() {
    const { authState, user, headerContent } = this.props;

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login"></Redirect>;
    }

    return (
      <div className="container">
        <header>
          <h1>Easy-NP</h1>
          <div className="logout">
          <button onClick={handleSignOut}> Se déconnecter </button>
        </div>
        </header>
        <div className="content">
        <h2>Bienvenue {user.email}!</h2>
        <img src={require("../images/maintenance.png")} alt="Maintenance" />
        </div>
      </div>
    );
  }
}

export default withAuth(Home);