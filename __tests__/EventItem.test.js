import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import EventItem from '../src/components/EventItem';

const event = { id: '1', title: 'Dentista', date: '10/10/2026', time: '09:30' };

describe('Componente EventItem', () => {
  describe('Renderizado inicial', () => {
    it('muestra el título del evento', () => {
      render(<EventItem event={event} onDelete={() => {}} />);
      expect(screen.getByText('Dentista')).toBeTruthy();
    });

    it('muestra la fecha y la hora del evento', () => {
      render(<EventItem event={event} onDelete={() => {}} />);
      expect(screen.getByText('10/10/2026 · 09:30 hs')).toBeTruthy();
    });

    it('muestra el botón Eliminar', () => {
      render(<EventItem event={event} onDelete={() => {}} />);
      expect(screen.getByText('Eliminar')).toBeTruthy();
    });
  });

  describe('Interacciones', () => {
    it('llama a onDelete con el id del evento al presionar Eliminar', () => {
      const onDelete = jest.fn();
      render(<EventItem event={event} onDelete={onDelete} />);
      fireEvent.press(screen.getByTestId('delete-1'));
      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('1');
    });
  });
});