import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@agenda_users';
const SESSION_KEY = '@agenda_session';
const eventsKey = (username) => `@agenda_events_${username}`;

async function readJSON(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export const getUsers = () => readJSON(USERS_KEY, []);
export const saveUsers = (users) => AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

export const getSession = async () => AsyncStorage.getItem(SESSION_KEY);
export const saveSession = (username) => AsyncStorage.setItem(SESSION_KEY, username);
export const clearSession = () => AsyncStorage.removeItem(SESSION_KEY);

export const getEvents = (username) => readJSON(eventsKey(username), []);
export const saveEvents = (username, events) =>
  AsyncStorage.setItem(eventsKey(username), JSON.stringify(events));
