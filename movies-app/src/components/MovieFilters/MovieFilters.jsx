import React from 'react';
import { TextField, Select, MenuItem, InputLabel } from '@material-ui/core';
import './MovieFilters.css';

const MovieFilters = ({ titleFilter, setTitleFilter, genreFilter, setGenreFilter, priceFilter, setPriceFilter }) => {
  return (
    <div className="movie-filters">
      <h3>Filter Movies</h3>
      <TextField 
        label="Title" 
        value={titleFilter} 
        onChange={e => setTitleFilter(e.target.value)} 
        className='movie-title-filter'
      />
      <InputLabel className="select-genre-label">Genre</InputLabel>
      <Select 
        label="Genre"
        value={genreFilter} 
        onChange={e => setGenreFilter(e.target.value)}
        className='movie-genre-filter'
        data-cy="genre-filter"
      >
        <MenuItem value=""><em>All</em></MenuItem>
        <MenuItem value="HOR">Horror</MenuItem>
        <MenuItem value="ADV">Adventures</MenuItem>
        <MenuItem value="ANI">Animation</MenuItem>
        <MenuItem value="HER">Heroes</MenuItem>
      </Select>
      <TextField 
        label="Max Price" 
        type="number" 
        value={priceFilter} 
        onChange={e => setPriceFilter(e.target.value)}
        className='movie-price-filter'
      />
    </div>
  );
};

export default MovieFilters;
