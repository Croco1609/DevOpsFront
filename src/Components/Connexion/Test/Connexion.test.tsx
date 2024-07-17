// Connexion.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Connexion from '../Connexion';

test('renders login form', () => {
  render(
    <BrowserRouter>
      <Connexion />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Connectez-vous')).toBeInTheDocument();
  
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  
  expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /connexion/i })).toBeInTheDocument();
});

test('handles form submission', async () => {
  render(
    <BrowserRouter>
      <Connexion />
    </BrowserRouter>
  );

  // Remplir les champs email et mot de passe
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/mot de passe/i), { target: { value: 'password' } });

  // Soumettre le formulaire
  fireEvent.click(screen.getByRole('button', { name: /connexion/i }));
});
