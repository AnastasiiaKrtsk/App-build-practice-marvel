// state.js
export const state = {
  characters: [],
  editedId: null,

  page: 1,
  limit: 2,
  hasMore: true,

  search: '',
};

export const asyncState = {
  loading: false,
  controller: null,
  requestId: 0,

  deleteLock: new Set(),
  createLock: false,
  updateLock: false,
};

export const setCharactersAction = (data) => {
  state.characters = data;
};

export const deleteCharacterAction = (id) => {
  state.characters = state.characters.filter((c) => String(c.id) !== id);
};

export const addCharacterAction = (data) => {
  state.characters.push(data);
};

export const setEditedId = (id) => {
  state.editedId = id;
};

export const clearEditedId = () => {
  state.editedId = null;
};

export const updateCharacterAction = (id, update) => {
  state.characters = state.characters.map((char) =>
    char.id === id ? update : char,
  );
};

export const setHasMoreAction = (next) => {
  state.hasMore = next !== null;
};

export const nextPageAction = () => {
  state.page += 1;
};

export const prevPageAction = () => {
  if (state.page === 1) return;
  state.page -= 1;
};

export const setPageAction = (page) => {
  state.page = page;
};
export const setSearchAction = (query) => {
  state.search = query;
};

export const appendCharactersAction = (data) => {
  state.characters = [...state.characters, ...data];
};
