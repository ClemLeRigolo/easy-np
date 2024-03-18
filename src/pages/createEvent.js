import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createEvent, getEvents } from "../utils/firebase";
import fr from "../utils/i18n";
import "../styles/createEvent.css";
import HeaderBar from "../components/headerBar";
import moment from "moment";
import "moment/locale/fr";
import { withRouter } from "react-router-dom";

class CreateEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      description: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      theme: "",
      redirect: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      // Mettre à jour formattedStartTime après avoir mis à jour startTime dans l'état
      const { startTime } = this.state;
      this.setState({ formattedStartTime: moment(startTime, "HH:mm").format("HH:mm") });
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { title, description, startDate, startTime, endDate, endTime, theme } = this.state;
    const startDatetime = new Date(`${startDate}T${startTime}`);
    const endDatetime = new Date(`${endDate}T${endTime}`);
    const gid = this.props.match.params.gid;
    createEvent(title, startDatetime, endDatetime, description, theme, gid)
      .then(() => {
        console.log("Event created successfully");
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.error("Error creating event:", error);
      });
  };

  render() {
    moment.locale("fr");
    const { authState, user } = this.props;
    const { title, description, startDate, endDate, theme, redirect, formattedStartTime, formattedEndTime } = this.state;

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
              <label htmlFor="event-start-date">{fr.FORM_FIELDS.EVENT_START_DATE}:</label>
              <div className="datetime-picker-container">
                <input
                  type="date"
                  id="event-start-date"
                  name="startDate"
                  value={startDate}
                  onChange={this.handleInputChange}
                  required
                />
                <input
                  type="time"
                  id="event-start-time"
                  name="startTime"
                  value={formattedStartTime}
                  onChange={this.handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="event-end-date">{fr.FORM_FIELDS.EVENT_END_DATE}:</label>
              <div className="datetime-picker-container">
                <input
                  type="date"
                  id="event-end-date"
                  name="endDate"
                  value={endDate}
                  onChange={this.handleInputChange}
                  required
                />
                <input
                  type="time"
                  id="event-end-time"
                  name="endTime"
                  value={formattedEndTime}
                  onChange={this.handleInputChange}
                  required
                  className="fr"
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="event-theme">{fr.FORM_FIELDS.EVENT_THEME}:</label>
              <select id="event-theme" name="theme" value={theme} onChange={this.handleInputChange} required>
                <option value="">{fr.FORM_FIELDS.SELECT_THEME}</option>
                <option value="MINP">MINP</option>
                <option value="Kfet">Kfet</option>
                <option value="Soirée">Soirée</option>
                <option value="Hackaton">Hackaton</option>
              </select>
            </div>
            <button type="submit">{fr.FORM_FIELDS.CREATE_EVENT}</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(withAuth(CreateEvent));