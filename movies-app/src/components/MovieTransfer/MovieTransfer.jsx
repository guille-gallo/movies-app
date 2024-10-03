import React from 'react';
import { Select, MenuItem, Button, InputLabel, Typography } from '@material-ui/core';
import './MovieTransfer.css';

const MovieTransfer = ({ filteredMovies, selectedMovie, targetStudioId, handleMovieSelect, handleStudioSelect, handleTransfer, hasEmptyResults }) => {
    const isTransferDisabled = !selectedMovie || !targetStudioId || hasEmptyResults;

    return (
        <div className="movie-transfer" data-testid="movie-transfer">
            <h3>Movie Transfer</h3>

            <InputLabel>Select Movie</InputLabel>
            <Select
                aria-label="Select Movie"
                label="Select Movie"
                value={selectedMovie ? selectedMovie.id : ""}  // Ensure value is either the movie ID or empty string
                onChange={handleMovieSelect}  // Existing handleMovieSelect function
                className='movie-select-filter'
                data-cy="movie-select"
            >
                {filteredMovies.map(movie => (
                    <MenuItem key={movie.id} value={movie.id}>
                        {movie.name}
                    </MenuItem>
                ))}
            </Select>

            <InputLabel className="select-target-label">Select Target Studio</InputLabel>
            <Select
                aria-label="Select Target Studio"
                label="Select Studio"
                value={targetStudioId || ""}
                onChange={handleStudioSelect}
                className='studio-select-filter'
                data-cy="studio-select"
            >
                <MenuItem value="1">Disney</MenuItem>
                <MenuItem value="2">Warner Bros</MenuItem>
                <MenuItem value="3">Sony Pictures</MenuItem>
            </Select>

            {isTransferDisabled && (
                <Typography variant="body2" color="error" className="required-message">
                    *Movie and target studio are required.
                </Typography>
            )}
            <div className='transfer-button'>
                <Button 
                    onClick={handleTransfer} 
                    variant="contained" 
                    color="primary"
                    disabled={isTransferDisabled}
                    data-cy="transfer-button"
                >
                    Transfer Rights
                </Button>
            </div>
        </div>
  );
};

export default MovieTransfer;
