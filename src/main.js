//main.js
import { syncUI, list, loadMore } from './ui';
import {
  addCharacterAction,
  appendCharactersAction,
  asyncState,
  clearEditedId,
  deleteCharacterAction,
  nextPageAction,
  prevPageAction,
  setCharactersAction,
  setEditedId,
  setHasMoreAction,
  setPageAction,
  setSearchAction,
  state,
  updateCharacterAction,
} from './state';
import {
  deleteCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
} from './api';

import debounce from 'lodash/debounce';

const form = document.querySelector('.form');
const pagination = document.querySelector('.pagination');
const search = document.querySelector('.search');

const loadCharacters = async (append = false) => {
  //*LOADING
  if (asyncState.loading) return;
  asyncState.loading = true;

  //*CONTROLLER
  asyncState.controller?.abort();
  asyncState.controller = new AbortController();

  //*REQUEST ID
  const currentRequestId = ++asyncState.requestId;

  //*TRY CATCH FINALLY
  try {
    const { data, hasMore } = await getCharacters(
      state.page,
      state.limit,
      state.search,
      asyncState.controller.signal,
    );

    //*REQUEST CHECK
    if (asyncState.requestId !== currentRequestId) return;

    if (append) {
      appendCharactersAction(data);
    } else {
      setCharactersAction(data);
    }
    setHasMoreAction(hasMore);

    syncUI();
  } catch (error) {
    if (error.name === 'AbortError') return;
  } finally {
    asyncState.loading = false;
  }
};

const handleListClick = async (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = String(li.dataset.id);

  if (e.target.closest('[data-del]')) {
    if (asyncState.deleteLock.has(id)) return;
    asyncState.deleteLock.add(id);

    try {
      await deleteCharacter(id);
      deleteCharacterAction(id);
      syncUI();
    } catch (error) {
      console.error(err);
    } finally {
      asyncState.deleteLock.delete(id);
    }
  }

  if (e.target.closest('[data-edit]')) {
    setEditedId(id);
    syncUI();
    return;
  }
  if (e.target.closest('[data-save]')) {
    if (asyncState.updateLock) return;
    asyncState.updateLock = true;

    try {
      const name = li.querySelector('[name="name"]').value.trim();
      const realName = li.querySelector('[name="realName"]').value.trim();
      const power = li.querySelector('[name="power"]').value.trim();

      const updatedCharacter = {
        id,
        name,
        realName,
        power,
      };

      const update = await updateCharacter(id, updatedCharacter);
      updateCharacterAction(id, updatedCharacter);
      clearEditedId();
      syncUI();
    } catch (error) {
      console.error(err);
    } finally {
      asyncState.updateLock = false;
    }
  }
  if (e.target.closest('[data-cancel]')) {
    clearEditedId();
    syncUI();
    return;
  }
};

const handleFormSubmit = async (e) => {
  e.preventDefault();

  if (asyncState.createLock) return;
  asyncState.createLock = true;

  try {
    const name = e.target.name.value.trim();
    const realName = e.target.realName.value.trim();
    const power = e.target.power.value.trim();

    if (!name || !realName || !power) return;

    const newChar = {
      name,
      realName,
      power,
    };

    const created = await createCharacter(newChar);
    addCharacterAction(created);
    await loadCharacters();

    form.reset();
  } catch (err) {
    console.error(err);
  } finally {
    asyncState.createLock = false;
  }
};

const handlePaginationClick = async (e) => {
  if (e.target.closest('[data-prev]')) {
    prevPageAction();
    await loadCharacters();
  }

  if (e.target.closest('[data-next]')) {
    nextPageAction();
    await loadCharacters();
  }
};

const handleSearchInput = debounce(async (e) => {
  const value = e.target.value.trim();

  setSearchAction(value);
  setPageAction(1);
  await loadCharacters();
}, 500);

const handleLoadMoreClick = async () => {
  nextPageAction();
  await loadCharacters(true);
};

loadMore.addEventListener('click', handleLoadMoreClick);
search.addEventListener('input', handleSearchInput);
pagination.addEventListener('click', handlePaginationClick);
form.addEventListener('submit', handleFormSubmit);
list.addEventListener('click', handleListClick);
document.addEventListener('DOMContentLoaded', loadCharacters);
