import { renderUi, list } from './ui';
import { state } from './state';
import { getCharacters } from './api';

const loadCharacters = async () => {
  const data = await getCharacters();
  state.characters = data;
  renderUi();
};

list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.closest('[data-del]')) {
    state.characters = state.characters.filter((char) => char.id !== id);
  }
  renderUi();
});

document.addEventListener('DOMContentLoaded', loadCharacters);
