import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import { createNewUser } from "../utils/firebase";
import { validateEmailPassword } from "../utils/helpers";
import Loader from "../components/loader";
import PasswordCheck from "../components/passwordCheck";
import {handleImageChange} from "../components/schoolChoose";

import "../styles/login.css";
import SchoolChoose from '../components/schoolChoose';
import Password from '../components/password';

class SignUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      surname: "",
      name: "",
      email: "",
      password: "",
      retype: "",
      error: "",
      selectedImage: "ensimag", // Par défaut, sélectionnez la première image
      selectedColor: "#008437", // Par défaut, sélectionnez la première couleur
      passwordRules: {
        length: false,
        uppercase: false,
        lowercase: false,
        specialChar: false,
      },
      samePasswords: false,
    };
    document.documentElement.style.setProperty('--selected-color', this.state.selectedColor)
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = handleImageChange.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      error: "",
    });
  }

  handlePassword(password) {
    if (password) {
      const passwordRules = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        specialChar: /[!@#$%^&*()]/.test(password)
      };
      this.setState({
        password: password,
        passwordRules: passwordRules
      });
      this.samePasswords(password, this.state.retype);
    }
  }


  handleRetype(retype) {
    if (retype) {
      this.setState({retype});
      this.samePasswords(this.state.password, retype);
    }
  }

  samePasswords(password, retype) {
    if (password !== retype) {
      this.setState({samePasswords : false});
      this.setState({
        error : "Les mots de passe ne correspondent pas"
      });
    }
    else {
      this.setState({samePasswords : true});
      this.setState({
        error : ""
      });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    if (this.state.error) {
      return;
    }

    // Valider l'email et le mot de passe
    const errorMsg = validateEmailPassword(
      this.state.email,
      this.state.password,
      false
    );

    if (errorMsg) {
      this.setState({
        error: errorMsg,
      });
      return;
    }

    createNewUser(this.state.email, this.state.password, this.state.surname, this.state.name, this.state.selectedImage)
      .then(() => {
        console.log("Signed Up!");
        //sendVerificationEmail();
      })
      .catch(e => {
        console.log("Error signing up", e);
        if (e.code === "auth/email-already-in-use") {
          this.setState({
            error: "Adresse e-mail déjà utilisée",
          });
        }
      });
  }


  render() {
    if (this.props.authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (this.props.authState === authStates.LOGGED_IN) {
      return <Redirect to="/" />;
    }

    const errorMsg = this.state.error;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="content">
            <div className="login">
              <h2>Inscription</h2>

              <input
                type="text"
                placeholder="Prénom"
                name="name"
                onChange={this.handleInputChange}
                required
                className='name'
              />

              <input
                type="text"
                placeholder="Nom"
                name="surnamename"
                onChange={this.handleInputChange}
                required
                className='name'
              />

              <input
                type="text"
                placeholder="Email"
                name="email"
                onChange={this.handleInputChange}
                required
              />

              <Password onPasswordTextChanged={(password) => this.handlePassword(password)} placeholder="Mot de passe" required={true} name="password"/>
              <Password onPasswordTextChanged={(retype) => this.handleRetype(retype)} placeholder="Confirmer le mot de passe" required={true} name="retype"/>

              <PasswordCheck props={this.state.passwordRules}/>
              <SchoolChoose selectedImage={this.state.selectedImage} handleImageChange={this.handleImageChange} />

              {errorMsg && <p className="error">Erreur: {errorMsg}</p>}
              <button type="submit" className="log-button">S'inscrire</button>

              <p>Vous avez déjà un compte ?</p>
              <Link to="/login">Se connecter</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default withAuth(SignUp);
