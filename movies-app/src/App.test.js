import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import App from './App';
import { fetchMovies, fetchStudios, transferMovieRights } from './hooks/useApi';

jest.mock('./hooks/useApi', () => ({
  fetchMovies: jest.fn(),
  fetchStudios: jest.fn(),
  transferMovieRights: jest.fn()
}));

it('renders the App component', async () => {

  fetchMovies.mockResolvedValueOnce([
    { id: '1', name: 'Movie 1' },
    { id: '2', name: 'Movie 2' }
  ]);

  fetchStudios.mockResolvedValueOnce([
    { id: 'disney', name: 'Disney' },
    { id: 'warner', name: 'Warner Bros' },
    { id: 'sony', name: 'Sony Pictures' }
  ]);

  transferMovieRights.mockResolvedValueOnce({ message: 'Movie rights transferred successfully' });
   
  await act(async () => {
    render(<App />);
  });

  const FilterHeading = screen.getByRole('heading', { name: /Filter Movies/i });
  const MovieTransferHeading = screen.getByRole('heading', { name: /Movie Transfer/i });
  const ImagesHeading = screen.getByRole('heading', { name: /Images:/i });
  expect(FilterHeading).toBeInTheDocument();
  expect(MovieTransferHeading).toBeInTheDocument();
  expect(ImagesHeading).toBeInTheDocument();

  const textBox = screen.getByRole('textbox', { name: "" });
  const spinButton = screen.getByRole('spinbutton');
  expect(textBox).toHaveAttribute('type', 'text');
  expect(spinButton).toBeInTheDocument();
  expect(spinButton).toHaveAttribute('type', 'number');

  const transferButtonLabel = screen.getByRole('button', { name: /Transfer Rights/i });
  expect(transferButtonLabel).toBeInTheDocument();

  const combobox1 = screen.getAllByRole('button')[0];
  expect(combobox1).toBeInTheDocument();

  const combobox2 = screen.getAllByRole('button')[1];
  expect(combobox2).toBeInTheDocument();
});
