//main.js
import { renderUi, list } from './ui';
import {
  addCharacterAction,
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
  const data = await getCharacters();
  setCharactersAction(data);
  renderUi();
};

const handleListClick = async (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = String(li.dataset.id);

  if (e.target.closest('[data-del]')) {
    await deleteCharacter(id);
    deleteCharacterAction(id);
    renderUi();
    return;
  }
  if (e.target.closest('[data-edit]')) {
    setEditedId(id);
    renderUi();
    return;
  }
  if (e.target.closest('[data-save]')) {
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
    return;
  }
  if (e.target.closest('[data-cancel]')) {
    clearEditedId();
    renderUi();
    return;
  }
};

const handleFormSubmit = async (e) => {
  e.preventDefault();
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
};

form.addEventListener('submit', handleFormSubmit);
list.addEventListener('click', handleListClick);
document.addEventListener('DOMContentLoaded', loadCharacters);
