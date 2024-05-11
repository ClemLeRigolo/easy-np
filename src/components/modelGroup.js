import React from 'react';
import { useState } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import "../styles/modelProfile.css";
import Loader from './loader';
import { replaceLinksAndTags, containsHtml, reverseLinksAndTags } from '../utils/helpers';
import { Button } from '@mantine/core';

function ModelProfile({
  openEdit,
  setOpenEdit,
  handleModel,
  isPublic,
  name,
  school,
  description,
  isMobile,
  userSchool,
  deleteGroupHandler
}) {
  const theme = useMantineTheme();
  const [nameModel, setName] = useState(name);
  const [schoolModel, setSchool] = useState(school);
  const [is, setIs] = useState(isPublic);
  const [descriptionModel, setDescription] = useState(reverseLinksAndTags(description));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleExit = () => {
    setOpenEdit(false);
    setLoading(true);
    //delay to show the loader
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (containsHtml(descriptionModel)) {
      setError(true);
      return;
    }
    handleModel({
      name: nameModel,
      school: schoolModel,
      description: replaceLinksAndTags(descriptionModel),
      isPublic: is
    });
    setLoading(true);
    //delay to show the loader
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    deleteGroupHandler();
    setLoading(true);
    //delay to show the loader
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

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

          <div className='inputBox2'>
            <label htmlFor="bio">Description:</label>
            <textarea
              name="bio"
              id="bio"
              placeholder='Enter Bio'
              onChange={(e) => setDescription(e.target.value)}
              value={descriptionModel}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          <div className="inputBox1">
            <label htmlFor="school">Ecole:</label>
            <select 
                name="school" 
                id="school" 
                value={schoolModel} 
                onChange={(e) => setSchool(e.target.value)} 
                required
                >
                <option value="">-- Sélectionner --</option>
                <option value={userSchool}>{userSchool}</option>
                <option value="all">Toutes les écoles</option>
            </select>
          </div>

          <div className="inputBox1">
            <label htmlFor="isPublic">Visibilité:</label>
            <select 
                name="isPublic" 
                id="isPublic" 
                value={is} 
                onChange={(e) => setIs(e.target.value)} 
                required
                >
                <option value="">-- Sélectionner --</option>
                <option value={true}>Publique</option>
                <option value={false}>Privée</option>
            </select>
          </div>

          {error && <div className="error">Les balises HTML ne sont pas autorisés dans la description</div>}

          <div className='btn-container'>
          <Button className='modelBtn' onClick={handleUpdate} data-cy='apply'>Modifier</Button>
          <Button className='cancelBtn' onClick={handleExit} data-cy='cancel'>Annuler</Button>
          <Button color="red" onClick={handleDelete}>Delete Group</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ModelProfile;
