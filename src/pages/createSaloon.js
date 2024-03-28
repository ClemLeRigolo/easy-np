import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { addSaloon } from "../utils/firebase";
import fr from "../utils/i18n";
import "../styles/createEvent.css";
import moment from "moment";
import "moment/locale/fr";
import { withRouter } from "react-router-dom";
import { replaceLinksAndTags, containsHtml } from "../components/postInput";

class CreateSaloon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        saloonName: "",
        description: "",
        writePermission: "", // Nouvel état pour la permission d'écriture
        redirect: false,
      };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleWritePermissionChange = (event) => {
    const { value } = event.target;
    this.setState({ writePermission: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { saloonName, description, writePermission } = this.state;
    const gid = this.props.match.params.gid;

    const finalDescription = replaceLinksAndTags(description);

    if (containsHtml(finalDescription)) {
      this.setState({ hasHtmlError: true });
      return; // Arrêter le traitement si du HTML est détecté
    }
    
    addSaloon(saloonName, description, writePermission, gid)
        .then(() => {
            console.log("Saloon created successfully");
            this.setState({ redirect: true });
        })
        .catch((error) => {
            console.error("Error creating saloon:", error);
        });
    /*createEvent(title, startDatetime, endDatetime, description, theme, gid)
      .then(() => {
        console.log("Event created successfully");
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.error("Error creating event:", error);
      });*/
  };

  render() {
    moment.locale("fr");
    const { authState } = this.props;
    const { saloonName, description, writePermission, redirect } = this.state;

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
      return <Loader />;
    }

    if (redirect) {
      return <Redirect to={`/group/${this.props.match.params.gid}`} />;
    }

    return (
      <div className="interface">
        <div className="form-container">
          <h2>{fr.FORM_FIELDS.CREATE_SALOON}</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="event-title">{fr.FORM_FIELDS.SALOON_NAME}:</label>
              <input
                type="text"
                id="event-name"
                name="saloonName"
                value={saloonName}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="event-description">{fr.FORM_FIELDS.SALOON_DESCRIPTION}:</label>
              <textarea
                id="event-description"
                name="description"
                value={description}
                onChange={this.handleInputChange}
                required
                style={{ whiteSpace: "pre-wrap" }}
              ></textarea>
              {this.state.hasHtmlError && <p className="error-message">{fr.FORM_FIELDS.NO_HTML}</p>}
            </div>
            <div className="form-group">
            <label htmlFor="write-permission">{fr.FORM_FIELDS.WRITE_PERMISSION}:</label>
            <select
                id="write-permission"
                name="writePermission"
                value={writePermission}
                onChange={this.handleWritePermissionChange}
                required
            >
                <option value="">{fr.FORM_FIELDS.SELECT_WRITE_PERMISSION}</option>
                <option value="admin">{fr.FORM_FIELDS.ADMIN_ONLY}</option>
                <option value="everyone">{fr.FORM_FIELDS.EVERYONE}</option>
            </select>
            </div>
            <button type="submit">{fr.FORM_FIELDS.CREATE_SALOON}</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(withAuth(CreateSaloon));