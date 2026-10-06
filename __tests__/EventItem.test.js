import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import EventItem from '../src/components/EventItem';

const event = { id: '1', title: 'Dentista', date: '10/10/2026', time: '09:30' };

describe('EventItem', () => {
  it('renderiza título, fecha y hora', () => {
    render(<EventItem event={event} onDelete={() => {}} />);
    expect(screen.getByText('Dentista')).toBeTruthy();
    expect(screen.getByText('10/10/2026 · 09:30 hs')).toBeTruthy();
  });

  it('llama a onDelete con el id al presionar Eliminar', () => {
    const onDelete = jest.fn();
    render(<EventItem event={event} onDelete={onDelete} />);
    fireEvent.press(screen.getByTestId('delete-1'));
    expect(onDelete).toHaveBeenCalledWith('1');
  });
});
