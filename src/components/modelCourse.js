import React from 'react';
import { useState } from 'react';
import { Modal, useMantineTheme } from '@mantine/core';
import "../styles/modelProfile.css";
import Loader from './loader';
import { replaceLinksAndTags, containsHtml, reverseLinksAndTags } from '../utils/helpers';

function ModelProfile({
  openEdit,
  setOpenEdit,
  handleModel,
  year,
  name,
  description,
  isMobile,
  program,
}) {
  const theme = useMantineTheme();
  const [nameModel, setName] = useState(name);
  const [yearModel, setYear] = useState(year);
  const [programModel, setProgram] = useState(program);
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
      description: replaceLinksAndTags(descriptionModel),
      year: yearModel
    });
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
            <label htmlFor="year">Année:</label>
            <select 
                name="year" 
                id="year" 
                value={yearModel} 
                onChange={(e) => setYear(e.target.value)} 
                required
                >
                <option value="">-- Sélectionner --</option>
                <option value={1}>1ère année</option>
                <option value={2}>2ème année</option>
                <option value={3}>3ème année</option>
            </select>
          </div>

          {yearModel !== 1 && (
            <div className="inputBox1">
              <label htmlFor="program">Programme:</label>
              <input
                type="text"
                name="program"
                id="program"
                placeholder='Enter Program'
                onChange={(e) => setProgram(e.target.value)}
                value={programModel}
                required
              />
            </div>
          )}

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
