//api.js
const BASE_URL = 'http://localhost:3000/characters';

export const getCharacters = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('Failed fetch characters');
  return res.json();
};
