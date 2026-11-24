import { fireEvent, render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import Boton from '../components/atoms/Button';

test('Botón transmite texto, tipo, clase y evento', () => {
  const click = vi.fn();

  render(
    <Boton type="button" className="secundario" onClick={click}>
      Guardar
    </Boton>
  );

  const button = screen.getByRole('button', { name: 'Guardar' });

  expect(button).toHaveAttribute('type', 'button');
  expect(button).toHaveClass('boton', 'secundario');

  fireEvent.click(button);

  expect(click).toHaveBeenCalledTimes(2);
});