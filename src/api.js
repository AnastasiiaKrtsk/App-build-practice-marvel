//api.js
const BASE_URL = 'http://localhost:3000/characters';

export const getCharacters = async () => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error('GET failed');
  return res.json();
};

export const deleteCharacter = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('DELETE failed');
};

export const createCharacter = async (data) => {
  const res = await fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('POST failed');
  return res.json();
};

export const updateCharacter = async (id, newData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(newData),
  });
  if (!res.ok) throw new Error('POST failed');
  return res.json();
};
