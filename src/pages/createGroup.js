import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createGroup } from "../utils/firebase";

import fr from "../utils/i18n";
import "../styles/createGroup.css";
import HeaderBar from "../components/headerBar";
import { replaceLinksAndTags, containsHtml } from "../components/postInput";

class CreateGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      description: "",
      visibility: "public",
      school: "",
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
    console.log("finalDescription", finalDescription);

    if (containsHtml(finalDescription)) {
      this.setState({ hasHtmlError: true });
      return; // Arrêter le traitement si du HTML est détecté
    }

    createGroup(groupName, visibility, school, description)
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
    const { groupName, visibility, school, redirect, description } = this.state;

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
      return <Loader />;
    }

    if (redirect) {
      return <Redirect to="/groups" />;
    }

    return (
      <div className="interface">
        <HeaderBar search={""} setSearch={""} showMenu={false} setShowMenu={false} uid={user.uid} />
        <div className="form-container">
          <h2>{fr.FORM_FIELDS.CREATE_GROUP}</h2>
          <form onSubmit={this.handleSubmit}>
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
                  <option value="Ensim">Toutes les écoles</option>
                  <option value="Ensimag">Ensimag</option>
                  <option value="Phelma">Phelma</option>
                  <option value="Ense3">Ense3</option>
                  <option value="Gi">Gi</option>
                  <option value="Pagora">Pagora</option>
                  <option value="Esisar">Esisar</option>
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