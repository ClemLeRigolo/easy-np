import React, { useState, useContext } from 'react';
import '../styles/gif.css'

import {
  Grid,
  SearchBar,
  SearchContext,
  SearchContextManager,
  SuggestionBar,
  Gif,
} from '@giphy/react-components';

export const SearchExperience = ({setSelectedGif}) => (
  <SearchContextManager apiKey="nocVG7gI7fo1MptoavLUPO9VCmhQyink">
    <Components setSelectedGif={setSelectedGif} />
  </SearchContextManager>
);

const Components = ({setSelectedGif}) => {
  const { fetchGifs, searchKey } = useContext(SearchContext);

  const handleGifClick = (gif) => {
    setSelectedGif(gif);
    // Faites quelque chose avec le GIF sélectionné
  };

  return (
    <>
      <div className="search-bar-container">
        <SearchBar />
      </div>

      <div className="suggestion-bar-container">
        <SuggestionBar />
      </div>

      <div className="grid-container">
        <Grid
          key={searchKey}
          columns={3}
          width={800}
          fetchGifs={fetchGifs}
          GifComponent={Gif} // Utilisez le composant Gif à la place de la redirection par défaut
          onGifClick={handleGifClick} // Gérez le clic sur le GIF
          noLink={true} // Désactivez le lien vers la page de détails du GIF
        />
      </div>
    </>
  );
};