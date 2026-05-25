import { state } from './state.js';
export const list = document.querySelector('.list');

export const renderUi = () => {
  list.innerHTML = state.characters
    .map(
      (char) =>
        `
      <li data-id="${char.id}" class="card">
        <h3>${char.name}</h3>
        <p><b>Real name:</b> ${char.realName}</p>
        <p><b>Power:</b> ${char.power}</p>

        <button data-del>Delete</button>
      </li>
    `,
    )
    .join('');
};
