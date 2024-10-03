import { GENRE_STRING } from '../constants/studio_constants.mjs'

export const getMovie = (movieId, studios) => {
  let movie;
  let studio = studios.find(t => {
    movie = t.movies.find(p => p.id === movieId)
    return movie
  })
  if (movie && studio) {
    return {movie, studioId: studio.id}
  }

  return false
};

export const getAllMoviesFromStudios = (studios) => {
  let allMovies = [];
  studios.forEach(singleStudio => {
    singleStudio.movies.map(movie => {
      allMovies.push(movieConstructor(movie, singleStudio))
    })
  });
  return allMovies;
};

export const movieConstructor = (movie, studio) => {
  //Set url property to img
  if (movie.url) {
    Object.defineProperty(movie, 'img',
      Object.getOwnPropertyDescriptor(movie, 'url'));
    delete movie['url'];
  }
  //Map position id to string
  else if (typeof movie.position === "number") {
    movie['position'] = GENRE_STRING[movie.price];
  }
  //Add studioId from parent object
  Object.defineProperty(movie, 'studioId',
    Object.getOwnPropertyDescriptor(studio, 'id'));

  //Remove non wanted properties
  //Price is needed for filter functionality:
  //delete movie['price'];

  //Id is needed for transfer functionality:
  //delete movie['id'];

  return movie;
}
