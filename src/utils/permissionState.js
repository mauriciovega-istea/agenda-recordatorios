// Lógica pura para interpretar el resultado de un pedido de permiso.

/** Devuelve 'granted' (concedido), 'denied' (rechazado) o 'undetermined' (pendiente). */
export function normalizePermission(response) {
  if (!response) return 'undetermined';
  if (response.granted === true || response.status === 'granted') return 'granted';
  if (response.status === 'denied') return 'denied';
  return 'undetermined';
}

export function getPermissionMessage(state, label) {
  if (state === 'granted') {
    return `El permiso de ${label} está concedido.`;
  }
  if (state === 'denied') {
    return `Rechazaste el permiso de ${label}. Sin él no podemos usar esta función. Podés activarlo desde los ajustes del teléfono.`;
  }
  return `Todavía no respondiste el permiso de ${label}. Volvé a intentarlo y elegí "Permitir".`;
}
