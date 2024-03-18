import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createEvent, getEvents } from "../utils/firebase"; // Importez la fonction pour créer un événement

import fr from "../utils/i18n";
import "../styles/createEvent.css";
import HeaderBar from "../components/headerBar";

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      date: "",
      theme: "",
      redirect: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { title, description, date, theme } = this.state;
    // Logique de création de l'événement
    createEvent(title, description, date, theme)
      .then(() => {
        console.log("Event created successfully");
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.error("Error creating event:", error);
      });
  };

  render() {
    const { authState, user } = this.props;
    const { title, description, date, theme, redirect } = this.state;

    if (authState === authStates.INITIAL_VALUE) {
      console.log("initial value");
      return <Loader />;
    }

    if (redirect) {
      return <Redirect to="/events" />;
    }

    return (
      <div className="interface">
        <HeaderBar search={""} setSearch={""} showMenu={false} setShowMenu={false} uid={user.uid} />
        <div className="form-container">
          <h2>{fr.FORM_FIELDS.CREATE_EVENT}</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="event-title">{fr.FORM_FIELDS.EVENT_TITLE}:</label>
              <input
                type="text"
                id="event-title"
                name="title"
                value={title}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="event-description">{fr.FORM_FIELDS.EVENT_DESCRIPTION}:</label>
              <textarea
                id="event-description"
                name="description"
                value={description}
                onChange={this.handleInputChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="event-date">{fr.FORM_FIELDS.EVENT_DATE}:</label>
              <input
                type="date"
                id="event-date"
                name="date"
                value={date}
                onChange={this.handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="event-theme">{fr.FORM_FIELDS.EVENT_THEME}:</label>
              <select id="event-theme" name="theme" value={theme} onChange={this.handleInputChange} required>
                <option value="">{fr.FORM_FIELDS.SELECT_THEME}</option>
                <option value="MINP">MINP</option>
                <option value="Kfet">Kfet</option>
                <option value="Soirée">Soirée</option>
              </select>
            </div>
            <button type="submit">{fr.FORM_FIELDS.CREATE_EVENT}</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withAuth(CreateEvent);