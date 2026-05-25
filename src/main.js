import { renderUi, list } from './ui';
import { state } from './state';

document.addEventListener('DOMContentLoaded', () => {
  renderUi();
});

list.addEventListener('click', (e) => {
  const li = e.target.closest('li');
  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.closest('[data-del]')) {
    state.characters = state.characters.filter((char) => char.id !== id);
  }
  renderUi();
});
