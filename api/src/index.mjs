import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser'
import { getAllMoviesFromStudios, getMovie } from '../src/helpers.mjs'
import { sony, warner, disney, movieAge, GENRE_STRING, studiosMap } from '../constants/studio_constants.mjs'
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'movies-app.log' })
  ]
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/studios', function (req, res) {
  let disneyTemp = {...disney}
  delete disneyTemp.movies
  let warnerTemp = {...warner}
  delete warnerTemp.movies
  let sonyTemp = {...sony}
  delete sonyTemp.movies
  res.json([
    disneyTemp,
    warnerTemp,
    sonyTemp
  ])
  // Log the studio request
  logger.info('Studios list requested');
});

app.get('/movies', function (req, res) {
  try {
    logger.info('Query parameters:', req.query); // Log the query parameters
    const { genre, title, price } = req.query;
    let movies = getAllMoviesFromStudios([disney, warner, sony]);

    // Filter by genre if provided
    if (genre) {
      logger.info('Genre from query:', genre);

      const genreKey = Object.keys(GENRE_STRING).find(key => GENRE_STRING[key] === genre);
      logger.info('Matching genreKey:', genreKey);

      if (genreKey) {
        movies = movies.filter(movie => movie.genre === parseInt(genreKey));
      } else {
        logger.warn('No matching genreKey found for genre:', genre);
      }
    }

    // Filter by title if provided
    if (title) {
      logger.info('Title movies:', movies);
      movies = movies.filter(movie => movie.name.toLowerCase().includes(title.toLowerCase()));
    }

    // Filter by price if provided
    if (price) {
      movies = movies.filter(movie => movie.price <= parseFloat(price));
    }

    res.status(200).json(movies);  // Send the filtered or unfiltered list of movies

  } catch (e) {
    logger.error('Error occurred:', e);
    res.status(500).send({ error: 'Internal Server Error' });
  }
});

app.get('/movieAge', function (req, res) {
  res.json(movieAge)
  logger.info('Movie age requested');
});

app.post('/transfer', function (req, res) {
  const { movieId, targetStudioId } = req.body;

  logger.info('Transfer Request:', { movieId, targetStudioId });

  if (!movieId || !targetStudioId) {
    logger.error('Missing movieId or targetStudioId');
    return res.status(400).json({ error: 'movieId and targetStudioId are required' });
  }

  // Get the list of studios from studiosMap
  const studios = Object.values(studiosMap);

  // Find the movie and the current studio
  const { movie, studioId } = getMovie(movieId, studios);

  if (!movie) {
    logger.error('Movie not found');
    return res.status(404).json({ error: 'Movie not found' });
  }

  if (studioId.toString() === targetStudioId.toString()) {
    logger.error('Movie already owned by the target studio');
    return res.status(400).json({ error: 'Movie is already owned by the target studio' });
  }

  // Use studiosMap to find the target studio
  const targetStudio = studiosMap[targetStudioId];

  if (!targetStudio) {
    logger.error('Target studio not found');
    return res.status(404).json({ error: 'Target studio not found' });
  }

  // Transfer the movie: Remove from current studio and add to target studio
  const currentStudio = studiosMap[studioId];
  currentStudio.movies = currentStudio.movies.filter(m => m.id !== movieId);
  targetStudio.movies.push(movie);

  logger.info('Transfer successful:', { movieId, from: studioId, to: targetStudioId });

  return res.status(200).json({ message: 'Movie rights transferred successfully' });
});

app.listen(3000, () => {
  logger.info('Movies app listening on port 3000');
});
