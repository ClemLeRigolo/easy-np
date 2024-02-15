import React from "react";
import { Redirect } from "react-router-dom";

import { authStates, withAuth } from "../components/auth";
import { getUserData, signOut, deleteUser } from "../utils/firebase";
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

function handleDelete() {
  deleteUser()
    .then(() => {
      console.log("User deleted");
    })
    .catch(e => {
      console.log("Error deleting user", e);
    });
}

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
    };
  }
  render() {
    const { authState, user, headerContent } = this.props;
    const { firstName, lastName } = this.state;

    console.log("user", user);

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (authState === authStates.LOGGED_OUT) {
      return <Redirect to="/login"></Redirect>;
    }

    if (authState === authStates.LOGGED_IN && !this.state.firstName) {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
      console.log("dedans");
        getUserData(user.email).then(data => {
          this.setState({
            firstName: data.name,
            lastName: data.surname,
          });
        }
        );
        console.log(this.state.firstName, this.state.lastName);
    }

    console.log("user", user);

    return (
      <div className="container">
        <header>
          <h1>Easy-NP</h1>
          <div className="logout">
          <button onClick={handleSignOut}> Se déconnecter </button>
          <button onClick={handleDelete}> Supprimer le compte </button>
        </div>
        </header>
        <div className="content">
        <h2>Bienvenue {this.state.firstName} {this.state.lastName} !</h2>
        <img src={require("../images/maintenance.png")} alt="Maintenance" />
        </div>
      </div>
    );
  }
}

export default withAuth(Home);