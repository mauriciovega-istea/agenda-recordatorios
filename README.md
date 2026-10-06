# 📅 Agenda / Recordatorios

App móvil hecha con **React Native + Expo** para el Parcial 1 de Aplicaciones Móviles.

**Opción elegida:** Agenda / Recordatorios (eventos simples con fecha y hora).

## Cómo ejecutar la app

```bash
npm install
npx expo start
```
Escanear el QR con **Expo Go** (Android/iOS) o presionar `a` para abrir un emulador Android.

## Tests

```bash
npm test
```

## Funcionalidades implementadas

- Registro e inicio de sesión local (usuario y contraseña guardados en AsyncStorage).
- Navegación con Stack: Login, Registro, Home y Alta de evento. Sin sesión no se accede a Home.
- Alta de eventos con título, fecha (DD/MM/AAAA) y hora (HH:MM) con validaciones.
- Lista de eventos ordenada por fecha, con opción de eliminar.
- Persistencia de datos y de la sesión al cerrar la app.
- Notificación local programada a la fecha y hora del evento, y botón de prueba a los 5 segundos.
- Componentes reutilizables: `EventItem` y `PrimaryButton`.
- Tests con Jest + React Native Testing Library.

## Video demo

(Pendiente: agregar enlace de YouTube)
