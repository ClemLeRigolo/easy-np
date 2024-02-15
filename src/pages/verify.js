import React from "react";
import { Link } from "react-router-dom";

import fr from "../utils/i18n";
import "../styles/login.css";

class Verify extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="content">
          <div className="login">
            <h2>{fr.GREETINGS.VERIFY}</h2>

            <p>{fr.VERIFY_EMAIL_TEXT}</p>

            <Link to="/login">{fr.FORM_FIELDS.BACK_TO_LOGIN}</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Verify;