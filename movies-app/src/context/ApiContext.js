import React, { createContext, useContext } from 'react';
import { fetchStudios, fetchMovies, transferMovieRights } from '../hooks/useApi.js';

const ApiContext = createContext();

export const useApi = () => useContext(ApiContext);

export const ApiProvider = ({ children }) => {
  const api = {
    fetchStudios,
    fetchMovies,
    transferMovieRights
  };

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};
