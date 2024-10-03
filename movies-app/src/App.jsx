import './App.css'
import React, { useState, useEffect, useCallback } from 'react'
import { Card, Grid, Typography } from '@material-ui/core'
import { AvatarWithFallback } from './components/AvatarWithFallback/AvatarWithFallback'
import { useApi, ApiProvider } from './context/ApiContext'
import MovieFilters from './components/MovieFilters/MovieFilters';
import MovieTransfer from './components/MovieTransfer/MovieTransfer';
import { DEFAULT_AVATAR, FETCH_MOVIE_DATA_ERROR_MESSAGE, MOVIE_TRANSFER_SUCCESS_MESSAGE, MOVIE_TRANSFER_ERROR_MESSAGE, NO_FILTER_RESULTS_MESSAGE } from './constants';

export const AppContent = () => {
  const { fetchStudios, fetchMovies, transferMovieRights } = useApi();
  const [ studios, setStudios ] = useState([]);
  const [ filteredMovies, setFilteredMovies ] = useState([]);
  const [ selectedMovie, setSelectedMovie ] = useState(null);
  const [ targetStudioId, setTargetStudioId ] = useState('');
  const [ genreFilter, setGenreFilter ] = useState('');
  const [ priceFilter, setPriceFilter ] = useState('');
  const [ titleFilter, setTitleFilter ] = useState('');

  useEffect(() => {
    // Fetch studios and movies on mount or when filters change
    const fetchData = async () => {
      try {
        const studiosData = await fetchStudios();
        setStudios(studiosData);

        const moviesData = await fetchMovies({ genre: genreFilter, title: titleFilter, price: priceFilter });
        setFilteredMovies(moviesData);
      } catch (error) {
        alert(FETCH_MOVIE_DATA_ERROR_MESSAGE, error);
      };
    };

    fetchData();
  }, [fetchStudios, fetchMovies, genreFilter, titleFilter, priceFilter]);

  const handleMovieSelect = (e) => {
    const movieId = e.target.value;
    const movie = filteredMovies.find(m => m.id === movieId);
    setSelectedMovie(movie); 
  };

  const handleStudioSelect = (e) => {
    setTargetStudioId(e.target.value);
  };

  const resetFilters = useCallback(() => {
    setGenreFilter('');
    setPriceFilter('');
    setTitleFilter('');
  }, []);

  const resetTransferSelections = useCallback(() => {
    setSelectedMovie(null);
    setTargetStudioId('');
  }, []);

  const handleTransfer = useCallback(() => {
    if (selectedMovie && targetStudioId) {
      transferMovieRights({ movieId: selectedMovie.id, targetStudioId })
        .then(response => {
          if (response.message) {
            alert(MOVIE_TRANSFER_SUCCESS_MESSAGE);
            fetchMovies().then(setFilteredMovies);
            resetFilters();
            resetTransferSelections(); 
          } else if (response.error) {
            alert(`Error: ${response.error}`);
          }
        })
        .catch(error => alert(MOVIE_TRANSFER_ERROR_MESSAGE, error));
    }
  }, [selectedMovie, targetStudioId, transferMovieRights, fetchMovies, setFilteredMovies, resetFilters, resetTransferSelections]);

  return (
    <div className="App">
      <div className="App-studios App-flex">
        <div className="filters-container">
          <MovieFilters 
            titleFilter={titleFilter}
            setTitleFilter={setTitleFilter}
            genreFilter={genreFilter}
            setGenreFilter={setGenreFilter}
            priceFilter={priceFilter}
            setPriceFilter={setPriceFilter}
          />

          <MovieTransfer 
            filteredMovies={filteredMovies} 
            selectedMovie={selectedMovie}
            targetStudioId={targetStudioId}
            handleMovieSelect={handleMovieSelect}
            handleStudioSelect={handleStudioSelect}
            handleTransfer={handleTransfer}
            hasEmptyResults={!filteredMovies.length}
          />
        </div>

        <h3>Images:</h3>
        <Grid container justifyContent="center" alignItems="center">
          {filteredMovies.map((movie) => (
            <Grid key={movie.name} item xs={12} sm={6} lg={4}>
              <Card className="card-container" data-cy="movie-item">
                <AvatarWithFallback
                  alt={movie.name}
                  src={movie.img ? movie.img : ''}
                  fallbackSrc={DEFAULT_AVATAR}
                  className={`movie-avatar`}
                />
                <div className="movie-details-container">
                  <Typography className="movie-name-container">
                    {movie.name + ' '}
                    <Typography className='movie-position'>
                      {movie.position}
                    </Typography>
                  </Typography>
                  <Typography>
                    {
                      studios.map((studio) => {
                        if (movie.studioId === studio.id) {
                          return studio.name;
                        }
                        return null;
                      })
                    }
                  </Typography>
                </div>
              </Card>
            </Grid>
          ))}
          {!filteredMovies.length && 
            <Typography variant="subtitle1">
              {NO_FILTER_RESULTS_MESSAGE}
            </Typography>
          }
        </Grid>
      </div>
    </div>
  );
};

const App = () => (
  <ApiProvider>
    <AppContent />
  </ApiProvider>
);

export default App;
