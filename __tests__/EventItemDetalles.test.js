import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import EventItem from '../src/components/EventItem';
import ContactPickerModal from '../src/components/ContactPickerModal';

const base = { id: '1', title: 'Dentista', date: '10/12/2026', time: '09:30' };

describe('Componente EventItem con recursos del dispositivo', () => {
  describe('Foto', () => {
    it('no muestra imagen si el evento no tiene foto', () => {
      render(<EventItem event={base} onDelete={() => {}} />);
      expect(screen.queryByTestId('photo-1')).toBeNull();
    });

    it('muestra la imagen asociada al evento', () => {
      render(<EventItem event={{ ...base, photoUri: 'file://foto.jpg' }} onDelete={() => {}} />);
      expect(screen.getByTestId('photo-1')).toBeTruthy();
    });
  });

  describe('Ubicación y contacto', () => {
    it('muestra la dirección aproximada', () => {
      const event = {
        ...base,
        location: { latitude: 1, longitude: 2, address: 'Av. San Martín 100' },
      };
      render(<EventItem event={event} onDelete={() => {}} />);
      expect(screen.getByText('📍 Av. San Martín 100')).toBeTruthy();
    });

    it('muestra el contacto relacionado', () => {
      const event = { ...base, contact: { name: 'Ana', phone: '2611234567' } };
      render(<EventItem event={event} onDelete={() => {}} />);
      expect(screen.getByText('👤 Ana · 2611234567')).toBeTruthy();
    });
  });

  describe('Calendario', () => {
    it('ofrece agregar el evento al calendario y ejecuta la acción', () => {
      const onAddToCalendar = jest.fn();
      render(<EventItem event={base} onDelete={() => {}} onAddToCalendar={onAddToCalendar} />);
      fireEvent.press(screen.getByTestId('calendar-1'));
      expect(onAddToCalendar).toHaveBeenCalledWith(base);
    });

    it('indica que el evento ya está en el calendario', () => {
      render(
        <EventItem
          event={{ ...base, calendarEventId: 'cal-1' }}
          onDelete={() => {}}
          onAddToCalendar={() => {}}
        />
      );
      expect(screen.getByText('📅 En el calendario')).toBeTruthy();
      expect(screen.queryByTestId('calendar-1')).toBeNull();
    });
  });
});

describe('Componente ContactPickerModal', () => {
  const contacts = [
    { id: 'a', name: 'Ana Gómez', phone: '111' },
    { id: 'b', name: 'Bruno Díaz', phone: '222' },
  ];

  describe('Renderizado inicial', () => {
    it('lista los contactos recibidos', () => {
      render(<ContactPickerModal visible contacts={contacts} onSelect={() => {}} onClose={() => {}} />);
      expect(screen.getByText('Ana Gómez')).toBeTruthy();
      expect(screen.getByText('Bruno Díaz')).toBeTruthy();
    });
  });

  describe('Interacciones', () => {
    it('filtra los contactos al buscar por nombre', () => {
      render(<ContactPickerModal visible contacts={contacts} onSelect={() => {}} onClose={() => {}} />);
      fireEvent.changeText(screen.getByPlaceholderText('Buscar por nombre'), 'bru');
      expect(screen.queryByText('Ana Gómez')).toBeNull();
      expect(screen.getByText('Bruno Díaz')).toBeTruthy();
    });

    it('devuelve el contacto elegido', () => {
      const onSelect = jest.fn();
      render(<ContactPickerModal visible contacts={contacts} onSelect={onSelect} onClose={() => {}} />);
      fireEvent.press(screen.getByText('Ana Gómez'));
      expect(onSelect).toHaveBeenCalledWith(contacts[0]);
    });
  });
});
