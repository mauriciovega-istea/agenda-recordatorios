import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import PrimaryButton from '../src/components/PrimaryButton';

describe('Componente PrimaryButton', () => {
  describe('Renderizado inicial', () => {
    it('muestra el texto recibido por props', () => {
      render(<PrimaryButton title="Guardar evento" onPress={() => {}} />);
      expect(screen.getByText('Guardar evento')).toBeTruthy();
    });
  });

  describe('Interacciones', () => {
    it('ejecuta onPress al ser presionado', () => {
      const onPress = jest.fn();
      render(<PrimaryButton title="Guardar evento" onPress={onPress} />);
      fireEvent.press(screen.getByText('Guardar evento'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });
  });
});