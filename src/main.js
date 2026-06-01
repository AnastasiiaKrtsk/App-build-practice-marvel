//main.js
import { renderUi, list } from './ui';
import {
  addCharacterAction,
  asyncState,
  clearEditedId,
  deleteCharacterAction,
  setCharactersAction,
  setEditedId,
  state,
  updateCharacterAction,
} from './state';
import {
  deleteCharacter,
  getCharacters,
  updateCharacter,
  createCharacter,
} from './api';

const form = document.querySelector('.form');
const loadCharacters = async () => {
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
    const data = await getCharacters(asyncState.controller.signal);

    //*REQUEST CHECK
    if (asyncState.requestId !== currentRequestId) return;

    setCharactersAction(data);
    renderUi();
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
      renderUi();
    } catch (error) {
      console.error(err);
    } finally {
      asyncState.deleteLock.delete(id);
    }
  }

  if (e.target.closest('[data-edit]')) {
    setEditedId(id);
    renderUi();
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
      renderUi();
    } catch (error) {
      console.error(err);
    } finally {
      asyncState.updateLock = false;
    }
  }
  if (e.target.closest('[data-cancel]')) {
    clearEditedId();
    renderUi();
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
    renderUi();

    form.reset();
  } catch (err) {
    console.error(err);
  } finally {
    asyncState.createLock = false;
  }
};

form.addEventListener('submit', handleFormSubmit);
list.addEventListener('click', handleListClick);
document.addEventListener('DOMContentLoaded', loadCharacters);
