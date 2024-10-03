import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useApi, ApiProvider } from './ApiContext';
import { fetchStudios, fetchMovies } from '../hooks/useApi';

jest.mock('../hooks/useApi', () => ({
  fetchStudios: jest.fn(),
  fetchMovies: jest.fn(),
}));

const TestComponent = ({ genre, title, price }) => {
  const { fetchStudios, fetchMovies } = useApi();

  React.useEffect(() => {
    fetchMovies({ genre, title, price });
  }, [genre, title, price]);

  return (
    <div>
      <button onClick={fetchStudios}>Fetch Studios</button>
      <button onClick={() => fetchMovies({ genre, title, price })}>Fetch Movies</button>
    </div>
  );
};

describe('ApiContext', () => {
  beforeEach(() => {
    fetchMovies.mockClear();
    fetchStudios.mockClear();
  });

  it('provides fetchStudios and fetchMovies functions', () => {
    render(
      <ApiProvider>
        <TestComponent />
      </ApiProvider>
    );

    const fetchStudiosButton = screen.getByText('Fetch Studios');
    const fetchMoviesButton = screen.getByText('Fetch Movies');
  
    expect(fetchStudiosButton).toBeInTheDocument();
    expect(fetchMoviesButton).toBeInTheDocument();

    fetchStudiosButton.click();
    expect(fetchStudios).toHaveBeenCalled();

    fetchMoviesButton.click();
    expect(fetchMovies).toHaveBeenCalled();
  });

  it('calls fetchMovies with genre filter', () => {
    render(
      <ApiProvider>
        <TestComponent genre="Action" />
      </ApiProvider>
    );

    expect(fetchMovies).toHaveBeenCalledTimes(1);
    expect(fetchMovies).toHaveBeenCalledWith({ genre: 'Action', title: undefined, price: undefined });
  });

  it('calls fetchMovies with title filter', () => {
    render(
      <ApiProvider>
        <TestComponent title="Inception" />
      </ApiProvider>
    );

    expect(fetchMovies).toHaveBeenCalledTimes(1);
    expect(fetchMovies).toHaveBeenCalledWith({ genre: undefined, title: 'Inception', price: undefined });
  });

  it('calls fetchMovies with price filter', () => {
    render(
      <ApiProvider>
        <TestComponent price="15" />
      </ApiProvider>
    );

    expect(fetchMovies).toHaveBeenCalledTimes(1);
    expect(fetchMovies).toHaveBeenCalledWith({ genre: undefined, title: undefined, price: '15' });
  });

  it('calls fetchMovies with multiple filters', () => {
    render(
      <ApiProvider>
        <TestComponent genre="Horror" title="Scream" price="10" />
      </ApiProvider>
    );

    expect(fetchMovies).toHaveBeenCalledTimes(1);
    expect(fetchMovies).toHaveBeenCalledWith({ genre: 'Horror', title: 'Scream', price: '10' });
  });
});
