import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createGroup, getUserData } from "../utils/firebase";
import { changeColor } from "../components/schoolChoose";

import fr from "../utils/i18n";
import "../styles/createGroup.css";
import { replaceLinksAndTags, containsHtml } from "../utils/helpers";

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      description: "",
      visibility: "public",
      school: "",
      userSchool: "",
      redirect: false,
      hasHTMLerror: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { groupName, visibility, school, description } = this.state;
    // Logique de création du groupe
    const finalDescription = replaceLinksAndTags(description);

    if (containsHtml(description)) {
      this.setState({ hasHtmlError: true });
      return; // Arrêter le traitement si du HTML est détecté
    }

    createGroup(groupName, visibility, school, finalDescription)
      .then(() => {
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

  render() {
    const { authState, user } = this.props;
    const { groupName, visibility, school, redirect, description } = this.state;

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (redirect) {
      return <Redirect to="/groups" />;
    }

    if (authState === authStates.LOGGED_IN && this.state.userSchool === "") {
      if(user.emailVerified === false){
        return <Redirect to="/verify"></Redirect>;
      }
        getUserData(user.email).then(data => {
          this.setState({
            userSchool: data.school,
          });
          changeColor(data.school);
        }
        );
      return <Loader />;
    }

    return (
      <div className="interface">
        <div className="form-container">
          <h2>{fr.FORM_FIELDS.CREATE_GROUP}</h2>
          <form onSubmit={this.handleSubmit} data-cy="createGroupForm">
            <div className="form-group">
              <label htmlFor="group-name">{fr.FORM_FIELDS.GROUP_NAME}:</label>
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
              <label className="label-description" htmlFor="description">{fr.FORM_FIELDS.GROUP_DESCRIPTION}:</label>
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={this.handleInputChange}
                required
                className="description-input"
                style={{ whiteSpace: "pre-wrap" }}
              ></textarea>
              {this.state.hasHtmlError && <p className="error-message">{fr.FORM_FIELDS.NO_HTML}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="visibility">{fr.FORM_FIELDS.VISIBILITY}:</label>
              <select id="visibility" name="visibility" value={visibility} onChange={this.handleInputChange}>
                <option value="public">{fr.FORM_FIELDS.PUBLIC}</option>
                <option value="private">{fr.FORM_FIELDS.PRIVATE}</option>
              </select>
            </div>
              <div className="form-group">
                <label htmlFor="school">{fr.FORM_FIELDS.SCHOOL}:</label>
                <select id="school" name="school" value={school} onChange={this.handleInputChange} required>
                  <option value="">{fr.FORM_FIELDS.SELECT_SCHOOL}</option>
                  <option value="all">Toutes les écoles</option>
                  <option value={this.state.userSchool} >{this.state.userSchool}</option>
                </select>
              </div>
            <button type="submit">{fr.FORM_FIELDS.CREATE_GROUP}</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withAuth(CreateGroup);
