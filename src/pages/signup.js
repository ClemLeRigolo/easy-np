import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import { createNewUser } from "../utils/firebase";
import { validateEmailPassword } from "../utils/helpers";
import Loader from "../components/loader";
import PasswordCheck from "../components/passwordCheck";

import "../styles/login.css";
import SchoolChoose from '../components/schoolChoose';

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
      showPasswords: false,
      passwordRules: {
        length: false,
        uppercase: false,
        lowercase: false,
        specialChar: false
      }
    };
    document.documentElement.style.setProperty('--selected-color', this.state.selectedColor)
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleShowPasswords = this.handleShowPasswords.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      error: "",
    });

    // Vérifiez que les champs de mot de passe correspondent
    if (target.name === "retype" || target.name === "password") {
      this.setState(function(state) {
        if (state.password !== state.retype) {
          return {
            error: "Les mots de passe ne correspondent pas",
          };
        }
      });
    }

    // Valider les règles de mot de passe
    if (target.name === "password") {
      const passwordRules = {
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        specialChar: /[!@#$%^&*()]/.test(value)
      };
      this.setState({ passwordRules });
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
      this.state.password
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

  handleImageChange(event) {
    const selectedImage = event.target.value;
    let selectedColor = "";

    switch (selectedImage) {
      case "ensimag":
        selectedColor = "#008437";
        break;
      case "phelma":
        selectedColor = "#bc1d1d";
        break;
      case "ense3":
        selectedColor = "#2c519f";
        break;
      case "gi":
        selectedColor = "#249fda";
        break;
      case "pagora":
        selectedColor = "#eb6608";
        break;
      case "esisar":
        selectedColor = "#862c86";
        break;
      default:
        selectedColor = ""; // Couleur par défaut en cas de correspondance non trouvée
    }
    this.setState({
      selectedImage: selectedImage,
      selectedColor: selectedColor,
    });

    document.documentElement.style.setProperty('--selected-color', selectedColor);
  }

  handleShowPasswords(event) {
    console.log(this.state);
    this.setState({
      showPasswords: event.target.checked
    });
    console.log(this.state);
  }

  render() {
    if (this.props.authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (this.props.authState === authStates.LOGGED_IN) {
      return <Redirect to="/" />;
    }

    const errorMsg = this.state.error;
    const { length, uppercase, lowercase, specialChar } = this.state.passwordRules;
    const typeShowPassword = (this.state.showPasswords) ? "text" : "password";

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <div className="content">
            <div className="login">
              <h2>Inscription</h2>

              <input
                type="text"
                placeholder="Nom"
                name="surname"
                onChange={this.handleInputChange}
                required
                className='name'
              />

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
                placeholder="Email"
                name="email"
                onChange={this.handleInputChange}
                required
              />

              <input
                type={typeShowPassword}
                placeholder="Mot de passe"
                name="password"
                onChange={this.handleInputChange}
                required
              />

              <input
                type={typeShowPassword}
                placeholder="Confirmer le mot de passe"
                name="retype"
                onChange={this.handleInputChange}
                required
              />

              <label  htmlFor="togglePassword">Show password</label>
              <input id="togglePassword" type="checkbox" onClick={this.handleShowPasswords}/>

              <PasswordCheck length={length} uppercase={uppercase} lowercase={lowercase} specialChar={specialChar} />
              
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
