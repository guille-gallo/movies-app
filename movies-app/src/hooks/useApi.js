import { API_DOMAIN } from '../constants';

export const fetchStudios = () => {
  return fetch(`${API_DOMAIN}/studios`).then(response => response.json());
};

export const fetchMovies = ({ genre, title, price } = {}) => {
  const queryParams = {};
  if (genre) queryParams.genre = genre;
  if (title) queryParams.title = title;
  if (price) queryParams.price = price;

  const queryString = new URLSearchParams(queryParams).toString();
  const url = `${API_DOMAIN}/movies${queryString ? `?${queryString}` : ''}`;

  return fetch(url).then(response => response.json());
};

export const transferMovieRights = ({ movieId, targetStudioId }) => {
  return fetch(`${API_DOMAIN}/transfer`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ movieId, targetStudioId }),
  }).then(response => response.json());
};
