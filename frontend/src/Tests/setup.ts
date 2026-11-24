import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { repositorioProductos } from '../data/productRepository';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  repositorioProductos.reiniciar();
});
