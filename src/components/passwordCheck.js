import React from "react";

import "../styles/passwordCheck.css";

export default function PasswordCheck(length, uppercase, lowercase, specialChar) {
  return <div className="passwordChecker">
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
  </div>;
}
