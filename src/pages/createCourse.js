import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createCourse, getUserDataById } from "../utils/firebase";

import fr from "../utils/i18n";
import "../styles/createCourse.css";

class CreateCourse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      courseTitle: "",
      courseDescription: "",
      courseYear: "",
      program: "",
      school: "",
      redirect: false,
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { courseTitle, courseDescription, courseYear, program } = this.state;

    createCourse(courseTitle, courseDescription, courseYear, this.state.school, program)
        .then(() => {
            this.setState({ redirect: true });
        })
        .catch((error) => {
            console.error("Error creating course:", error);
        });
  };

  render() {
    const { authState, user } = this.props;
    const { courseTitle, courseDescription, courseYear, program, redirect } = this.state;

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (redirect) {
      return <Redirect to="/courses" />;
    }

    if (this.state.school === "") {
        getUserDataById(user.uid).then((userData) => {
            this.setState({ school: userData.school });
        });
        return <Loader />;
    }


    return (
      <div className="interface">
        <div className="form-container">
          <h2>{fr.FORM_FIELDS.CREATE_COURSE}</h2>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="course-title">{fr.FORM_FIELDS.COURSE_NAME}:</label>
              <input
                type="text"
                id="course-title"
                name="courseTitle"
                value={courseTitle}
                onChange={this.handleInputChange}
                className="course-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="course-description">{fr.FORM_FIELDS.EVENT_DESCRIPTION}:</label>
              <textarea
                id="course-description"
                name="courseDescription"
                value={courseDescription}
                onChange={this.handleInputChange}
                className="course-input"
                required
                style={{ whiteSpace: "pre-wrap" }}
              ></textarea>
              {this.state.hasHtmlError && <div className="error-message">{fr.FORM_FIELDS.NO_HTML}</div>}
            </div>
            <div className="form-group">
              <label htmlFor="course-year">{fr.FORM_FIELDS.COURSE_YEAR}:</label>
              <select id="course-year" name="courseYear" value={courseYear} onChange={this.handleInputChange} required>
                <option value="">{fr.FORM_FIELDS.SELECT_YEAR}</option>
                <option value="1">{fr.FORM_FIELDS.FIRST_YEAR}</option>
                <option value="2">{fr.FORM_FIELDS.SECOND_YEAR}</option>
                <option value="3">{fr.FORM_FIELDS.THIRD_YEAR}</option>
              </select>
            </div>
            {(courseYear === "2" || courseYear === "3") && (
              <div className="form-group">
                <label htmlFor="course-program">{fr.FORM_FIELDS.CHOOSE_PROGRAM}:</label>
                <select
                  id="course-program"
                  name="program"
                  value={program}
                  onChange={this.handleInputChange}
                  required
                >
                  <option value="">{fr.FORM_FIELDS.SELECT_PROGRAM}</option>
                  <option value="Common">{fr.FORM_FIELDS.ALL_PROGRAMS}</option>
                  <option value="ISI">ISI</option>
                  <option value="IF">IF</option>
                  <option value="MMIS">MMIS</option>
                </select>
              </div>
            )}
            <button type="submit">{fr.FORM_FIELDS.CREATE_COURSE}</button>
          </form>
        </div>
      </div>
    );
  }
}

export default withAuth(CreateCourse);