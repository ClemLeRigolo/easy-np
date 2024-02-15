import React from 'react';
import { Link, Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import { createNewUser } from "../utils/firebase";
import { validateEmailPassword } from "../utils/helpers";
import Loader from "../components/loader";

import "../styles/login.css";

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
        specialChar: false
      }
    };
    document.documentElement.style.setProperty('--selected-color', this.state.selectedColor)
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
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
    if (target.type === "password") {
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

  render() {
    if (this.props.authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (this.props.authState === authStates.LOGGED_IN) {
      return <Redirect to="/" />;
    }

    const selectedImage = this.state.selectedImage;
    const errorMsg = this.state.error;
    const { length, uppercase, lowercase, specialChar } = this.state.passwordRules;

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
                type="password"
                placeholder="Mot de passe"
                name="password"
                onChange={this.handleInputChange}
                required
              />

              <input
                type="password"
                placeholder="Confirmer le mot de passe"
                name="retype"
                onChange={this.handleInputChange}
                required
              />

              <div className="password-rules">
                {length ? (
                  <span className="valid">
                    <img src={require("../images/validate.png")} alt="Valid" className="icon" />
                  </span>
                ) : (
                  <span className="invalid">
                    <img src={require("../images/error.png")} alt="Invalid" className="icon" />
                  </span>
                )}
                <p className='password-rule'>Longueur minimale de 8 caractères</p>
              </div>

              <div className="password-rules">
                {uppercase ? (
                  <span className="valid">
                    <img src={require("../images/validate.png")} alt="Valid" className="icon" />
                  </span>
                ) : (
                  <span className="invalid">
                    <img src={require("../images/error.png")} alt="Invalid" className="icon" />
                  </span>
                )}
                <p className='password-rule'>Au moins une lettre majuscule</p>
              </div>

              <div className="password-rules">
                {lowercase ? (
                  <span className="valid">
                    <img src={require("../images/validate.png")} alt="Valid" className="icon" />
                  </span>
                ) : (
                  <span className="invalid">
                    <img src={require("../images/error.png")} alt="Invalid" className="icon" />
                  </span>
                )}
                <p className='password-rule'>Au moins une lettre minuscule</p>
              </div>

              <div className="password-rules">
                {specialChar ? (
                  <span className="valid">
                    <img src={require("../images/validate.png")} alt="Valid" className="icon" />
                  </span>
                ) : (
                  <span className="invalid">
                    <img src={require("../images/error.png")} alt="Invalid" className="icon" />
                  </span>
                )}
                <p className='password-rule'>Au moins un caractère spécial (!@#$%^&amp;*())</p>
              </div>

              <div>
              <label className={`image-button-label ${selectedImage === "ensimag" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="ensimag"
                    checked={selectedImage === "ensimag"}
                    onChange={this.handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/ensimag.png")} alt="Image 1" />
                </label>
                <label className={`image-button-label ${selectedImage === "phelma" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="phelma"
                    checked={selectedImage === "phelma"}
                    onChange={this.handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/phelma.png")} alt="Image 2" />
                </label>
                <label className={`image-button-label ${selectedImage === "ense3" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="ense3"
                    checked={selectedImage === "ense3"}
                    onChange={this.handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/ense3.jpeg")} alt="Image 3" />
                </label>
                <label className={`image-button-label ${selectedImage === "gi" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="gi"
                    checked={selectedImage === "gi"}
                    onChange={this.handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/gi.jpeg")} alt="Image 4" />
                </label>
                <label className={`image-button-label ${selectedImage === "pagora" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="pagora"
                    checked={selectedImage === "pagora"}
                    onChange={this.handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/pagora.png")} alt="Image 5" />
                </label>
                <label className={`image-button-label ${selectedImage === "esisar" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="image"
                    value="esisar"
                    checked={selectedImage === "esisar"}
                    onChange={this.handleImageChange}
                    className="image-button"
                  />
                  <img src={require("../images/écoles/esisar.jpeg")} alt="Image 6" />
                </label>
              </div>

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