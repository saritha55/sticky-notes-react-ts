import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Create Note button', () => {
  render(<App />);
  const buttonElement = screen.getByText(/Create Note/i);
  expect(buttonElement).toBeInTheDocument();
});
