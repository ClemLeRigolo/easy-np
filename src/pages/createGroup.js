import React, { useState } from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createGroup, getGroups } from "../utils/firebase"; // Importez la fonction pour créer un groupe

import fr from "../utils/i18n";
import "../styles/createGroup.css";
import HeaderBar from "../components/headerBar";

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      groupName: "",
      visibility: "public",
      school: "",
      redirect: false,
    };
  }

  componentDidMount() {
    getGroups().then((groups) => {
      console.log("groups", groups);
      this.setState({ groups });
    });
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { groupName, visibility, school } = this.state;
    // Logique de création du groupe
    createGroup(groupName, visibility, school)
      .then(() => {
        console.log("Group created successfully");
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

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

    if (redirect) {
      return <Redirect to="/groups" />;
    }

    return (
      <div className="interface">
        <HeaderBar search={""} setSearch={""} showMenu={false} setShowMenu={false} uid={user.uid} />
        <div className="form-container">
          <h2>Create a Group</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="group-name">Group Name:</label>
              <input
                type="text"
                id="group-name"
                name="groupName"
                value={groupName}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="visibility">Visibility:</label>
              <select id="visibility" name="visibility" value={visibility} onChange={this.handleInputChange}>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            {visibility === "private" && (
              <div className="form-group">
                <label htmlFor="school">School:</label>
                <select id="school" name="school" value={school} onChange={this.handleInputChange} required>
                  <option value="">Select a school</option>
                  <option value="Ensimag">Ensimag</option>
                  <option value="Phelma">Phelma</option>
                  <option value="Ense3">Ense3</option>
                  <option value="Gi">Gi</option>
                  <option value="Pagora">Pagora</option>
                  <option value="Esisar">Esisar</option>
                </select>
              </div>
            )}
            <button type="submit">Create Group</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withAuth(CreateGroup);