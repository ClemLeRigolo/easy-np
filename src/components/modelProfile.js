import React from 'react';
import { useState } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import SchoolChoose from './schoolChoose';
import {changeColor} from "../components/schoolChoose";
import "../styles/modelProfile.css";
import Loader from './loader';
import { replaceLinksAndTags, containsHtml, reverseLinksAndTags } from '../utils/helpers';

function ModelProfile({
  openEdit,
  setOpenEdit,
  handleModel,
  name,
  surname,
  userName,
  school,
  year,
  major,
  bio,
  isMobile
}) {
  const theme = useMantineTheme();
  const [nameModel, setName] = useState(name);
  const [surnameModel, setSurname] = useState(surname);
  const [usernameModel, setUsername] = useState(userName);
  const [schoolModel, setSchool] = useState(school);
  const [yearModel, setYear] = useState(year);
  const [majorModel, setMajor] = useState(major);
  const [bioModel, setBio] = useState(reverseLinksAndTags(bio));
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState(false);

  const handleImageChange = (event) => {
    const selectedImage = event.target.value;
    if (selectedImage !== school) {
      setWarning(true);
    } else {
      setWarning(false);
    }
    changeColor(selectedImage);
    setSchool(selectedImage);
  };

  const handleExit = () => {
    changeColor(school);
    setOpenEdit(false);
    setLoading(true);
    //delay to show the loader
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (containsHtml(bioModel)) {
      setError(true);
      return;
    }
    handleModel({
      name: nameModel,
      surname: surnameModel,
      username: usernameModel,
      school: schoolModel,
      year: yearModel,
      major: majorModel,
      bio: replaceLinksAndTags(bioModel),
    });
    changeColor(school);
    setLoading(true);
    //delay to show the loader
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <Modal
        radius="8px"
        zIndex="1001"
        size="lg"
        opened={openEdit}
        withCloseButton={false}
        onClose={() => setOpenEdit(false)}
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
        }}
        fullScreen={isMobile}
        centered
      >
        <Loader />
      </Modal>
    );
  }

  return (
    <>
      <Modal
        radius="8px"
        zIndex="1001"
        size="lg"
        opened={openEdit}
        withCloseButton={false}
        onClose={() => setOpenEdit(false)}
        overlayProps={{
          color: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[10],
        }}
        fullScreen={isMobile}
      >
        <h1 className='modelTitle'>Modifier le profil</h1>
        <form className='modelForm' onSubmit={handleModel} data-cy='profil'>
          <div className="inputBox1">
          <label htmlFor="name">Prénom:</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder='Enter Name'
              onChange={(e) => setName(e.target.value)}
              value={nameModel}
              required
            />
          </div>

          <div className="inputBox1">
            <label htmlFor="sunname">Nom:</label>
            <input
              type="text"
              name="surname"
              id="surname"
              placeholder='Enter Name'
              onChange={(e) => setSurname(e.target.value)}
              value={surnameModel}
              required
            />
          </div>

          <div className="inputBox1">
            <label htmlFor="username">Nom d'utilisateur:</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder='Enter Username'
              onChange={(e) => setUsername(e.target.value)}
              value={usernameModel}
              required
            />
          </div>

          <div className='inputBox2'>
            <label htmlFor="bio">Biographie:</label>
            <textarea
              name="bio"
              id="bio"
              placeholder='Enter Bio'
              onChange={(e) => setBio(e.target.value)}
              value={bioModel}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          <div className="inputBox2">
            <label htmlFor="school">Ecole:</label>
            <SchoolChoose selectedImage={schoolModel} handleImageChange={handleImageChange}/>
            {warning && <div className="warning">Le changement d'école prendra effet lorsqu'un administrateur l'aura validé. Des pièces justificatives vous seront demandées par mail</div>}
          </div>

          <div className="inputBox1">
            <label htmlFor="year">Année d'étude:</label>
            <select
              name="year"
              id="year"
              value={yearModel}
              onChange={(e) => setYear(e.target.value)}
              required
            >
              <option value="">-- Sélectionner --</option>
              <option value="1A">1A</option>
              <option value="2A">2A</option>
              <option value="3A">3A</option>
              <option value="diplômé">Diplômé</option>
            </select>
          </div>

          <div className="inputBox1">
            <label htmlFor="major">Filière:</label>
            <input
              type="text"
              name="major"
              id="major"
              placeholder='Enter Major (optionnel)'
              onChange={(e) => setMajor(e.target.value)}
              value={majorModel}
            />
          </div>

          {error && <div className="error">Les balises HTML ne sont pas autorisés dans la description</div>}

          <div className='btn-container'>
          <button className='modelBtn' onClick={handleUpdate} data-cy='apply'>Modifier</button>
          <button className='cancelBtn' onClick={handleExit} data-cy='cancel'>Annuler</button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ModelProfile;
