import React from "react";
import { Redirect } from "react-router-dom";
import { signOut, resendMail } from "../utils/firebase";
import { authStates } from "../components/auth";

import fr from "../utils/i18n";
import "../styles/login.css";

class Verify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      return: false,
    };
  }

  handleResend(event) {
    event.preventDefault();
    resendMail()
      .then(() => {
        console.log("Mail resent");
      })
      .catch((e) => {
        console.log("Error resending mail", e);
      });
  }

  handleBackTo(event) {
    event.preventDefault();
    signOut()
      .then(() => {
        this.setState({ return: true });
      })
      .catch((e) => {
        console.log("Error signing out", e);
      });
  }

  render() {
    if (this.state.return) {
      console.log("return");
      return <Redirect to="/login"></Redirect>;
    }

    return (
      <div className="container">
        <div className="content">
          <div className="login">
            <h2>{fr.GREETINGS.VERIFY}</h2>

            <p>{fr.VERIFY_EMAIL_TEXT}</p>

            <button
              onClick={this.handleResend.bind(this)}
              className="log-button"
            >
              {fr.FORM_FIELDS.RESEND}
            </button>

            <a
              href="/login"
              onClick={this.handleBackTo.bind(this)}
            >
              {fr.FORM_FIELDS.BACK_TO_LOGIN}
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default Verify;