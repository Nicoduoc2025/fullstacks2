import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Aplicacion from './App';
import './styles.css';

const raiz = document.getElementById('root');

createRoot(raiz!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Aplicacion />
    </BrowserRouter>
  </React.StrictMode>,
);
