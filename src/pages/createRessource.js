import React from "react";
import { Redirect } from "react-router-dom";
import { authStates, withAuth } from "../components/auth";
import Loader from "../components/loader";
import { createRessource, getUserDataById } from "../utils/firebase";
import Dropzone from 'react-dropzone';
import { FaFileArchive, FaFileCode, FaFilePdf, FaFileImage } from "react-icons/fa";
import { MdFileUpload } from "react-icons/md";

import fr from "../utils/i18n";
import "../styles/createRessource.css";
import { changeColor } from "../components/schoolChoose";

class CreateRessource extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ressourceName: "",
      ressourceDescription: "",
      files: [],
      redirect: false,
      type: "",
      admin: false,
      cid: "",
      school: "",
      errorMessage: "",
      preview: [],
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleFileInputChange = (files) => {
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        this.setState({ errorMessage: fr.FORM_FIELDS.FILE_TOO_BIG });
        return;
      }
    }
  
    this.setState({ 
      files: files,
      preview: files.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { ressourceName, ressourceDescription, files } = this.state;

    createRessource(ressourceName, ressourceDescription, files, this.state.type, this.state.cid)
      .then(() => {
        this.setState({ redirect: true });
      })
      .catch((error) => {
        console.error("Error creating ressource:", error);
      });
  };

  render() {
    const { authState, user } = this.props;
    const { ressourceName, ressourceDescription, redirect } = this.state;

    if (authState === authStates.INITIAL_VALUE) {
      return <Loader />;
    }

    if (redirect) {
      return <Redirect to="/courses" />;
    }

    if (this.state.school === "") {
        getUserDataById(user.uid).then((userData) => {
            this.setState({ 
                school: userData.school,
                admin: userData.admin ? true : false,
            });
            changeColor(userData.school);
        });
        return <Loader />;
    }

    if (this.state.type === "") {
        //on récupère depuis l'url le type de ressource
        const url = window.location.href;
        const type = url.split("/").pop();
        this.setState({ 
            type: type,
            cid: this.props.match.params.cid,
        });
        return <Loader />;
    }

    //si le type n'est ni td ni tp ni fiche ni exam, on redirige vers la page des cours
    if (this.state.type !== "td" && this.state.type !== "tp" && this.state.type !== "exam" && this.state.type !== "fiche") {
        return <Redirect to="/courses/" />;
    }

    if (this.state.type !== "fiche" && !this.state.admin) {
        return <Redirect to="/courses/" />;
    }

    return (
      <div className="interface">
        <div className="form-container">
          {this.state.type === "td" && <h2>{fr.FORM_FIELDS.CREATE_TD}</h2>}
            {this.state.type === "tp" && <h2>{fr.FORM_FIELDS.CREATE_TP}</h2>}
            {this.state.type === "fiche" && <h2>{fr.FORM_FIELDS.CREATE_FICHE}</h2>}
            {this.state.type === "exam" && <h2>{fr.FORM_FIELDS.CREATE_EXAM}</h2>}
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
                {this.state.type === "td" && <label htmlFor="ressource-name">{fr.FORM_FIELDS.TD_NAME}:</label>}
                {this.state.type === "tp" && <label htmlFor="ressource-name">{fr.FORM_FIELDS.TP_NAME}:</label>}
                {this.state.type === "fiche" && <label htmlFor="ressource-name">{fr.FORM_FIELDS.FICHE_NAME}:</label>}
                {this.state.type === "exam" && <label htmlFor="ressource-name">{fr.FORM_FIELDS.EXAM_NAME}:</label>}
              <input
                type="text"
                id="ressource-name"
                name="ressourceName"
                value={ressourceName}
                onChange={this.handleInputChange}
                className="ressource-input"
                required
              />
            </div>
            <div className="form-group">
                {this.state.type === "td" && <label htmlFor="ressource-description">{fr.FORM_FIELDS.TD_DESCRIPTION}:</label>}
                {this.state.type === "tp" && <label htmlFor="ressource-description">{fr.FORM_FIELDS.TP_DESCRIPTION}:</label>}
                {this.state.type === "fiche" && <label htmlFor="ressource-description">{fr.FORM_FIELDS.FICHE_DESCRIPTION}:</label>}
                {this.state.type === "exam" && <label htmlFor="ressource-description">{fr.FORM_FIELDS.EXAM_DESCRIPTION}:</label>}
              <textarea
                id="ressource-description"
                name="ressourceDescription"
                value={ressourceDescription}
                onChange={this.handleInputChange}
                required
                style={{ whiteSpace: "pre-wrap" }}
                className="ressource-input"
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="ressource-files">{fr.FORM_FIELDS.RESSOURCE_FILES}:</label>
              <Dropzone onDrop={this.handleFileInputChange}>
                {({ getRootProps, getInputProps }) => (
                  <section className="dropzone-section">
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {this.state.preview.length === 0 && (
                        <>
                        <MdFileUpload />
                        <p>Glissez et déposez des fichiers ici, ou cliquez pour sélectionner des fichiers</p>
                        </>
                      )}
                      <div className="ressource-list">
                        {this.state.preview.map((file, index) => {
                          let fileName = file.name;
                          let fileExtension = fileName.split('.').pop();
                          let truncatedName = fileName.substring(0, 10);

                          if (fileName.length > 10) {
                            truncatedName = `${truncatedName}...${fileExtension}`;
                          }

                          let fileUrl = file.preview;
                          return (
                            <a href={fileUrl} key={index} className="ressource" target="_blank" rel="noopener noreferrer">
                              {fileName.includes(".pdf") ? <FaFilePdf /> : fileName.includes(".zip") || fileName.includes(".tar") || fileName.includes(".gz") ? <FaFileArchive /> : fileName.includes(".jpg") || fileName.includes(".png") || fileName.includes(".jpeg") ? <FaFileImage /> : <FaFileCode />}
                              <p className="ressource-name">{truncatedName}</p>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </section>
                )}
              </Dropzone>
            </div>
            {this.state.errorMessage && <p className="error-message">{this.state.errorMessage}</p>}
            {this.state.type === "td" && <button type="submit">{fr.FORM_FIELDS.CREATE_TD}</button>}
            {this.state.type === "tp" && <button type="submit">{fr.FORM_FIELDS.CREATE_TP}</button>}
            {this.state.type === "fiche" && <button type="submit">{fr.FORM_FIELDS.CREATE_FICHE}</button>}
            {this.state.type === "exam" && <button type="submit">{fr.FORM_FIELDS.CREATE_EXAM}</button>}
          </form>
        </div>
      </div>
    );
  }
}

export default withAuth(CreateRessource);