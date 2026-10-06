import React, { createContext, useContext, useEffect, useState } from 'react';
import { clearSession, getSession, getUsers, saveSession, saveUsers } from '../storage/storage';
import { validateCredentials } from '../utils/validation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession()
      .then((u) => setUser(u))
      .finally(() => setLoading(false));
  }, []);

  const register = async (username, password) => {
    const error = validateCredentials(username, password);
    if (error) return { ok: false, error };

    const users = await getUsers();
    const exists = users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase());
    if (exists) return { ok: false, error: 'Ese usuario ya existe' };

    await saveUsers([...users, { username: username.trim(), password }]);
    return { ok: true };
  };

  const login = async (username, password) => {
    const users = await getUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Usuario o contraseña incorrectos' };

    await saveSession(found.username);
    setUser(found.username);
    return { ok: true };
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
