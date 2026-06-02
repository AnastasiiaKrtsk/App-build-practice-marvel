//ui.js
import { state } from './state.js';
export const list = document.querySelector('.list');
export const prevBtn = document.querySelector('[data-prev]');
export const nextBtn = document.querySelector('[data-next]');
export const loadMore = document.querySelector('[data-more]');

const renderUi = () => {
  // console.log('CURRENT STATE', state);
  list.innerHTML = state.characters
    .map((char) => {
      const isEditing = state.editedId === char.id;

      return `
        <li data-id="${char.id}" class="card">
          ${
            isEditing
              ? `
                <input 
                  name="name"
                  value="${char.name}"
                />

                <input 
                  name="realName"
                  value="${char.realName}"
                />

                <input 
                  name="power"
                  value="${char.power}"
                />

                <button data-save>Save</button>
                <button data-cancel>Cancel</button>
              `
              : `
                <h3>${char.name}</h3>
                <p>${char.realName}</p>
                <p>${char.power}</p>
                
                <button data-edit>Edit</button>
                <button data-del>Delete</button>
              `
          }
        </li>
      `;
    })
    .join('');
};

const updatePaginationUi = () => {
  prevBtn.disabled = state.page === 1;
  nextBtn.disabled = !state.hasMore;
  loadMore.disabled = !state.hasMore;
};
export const syncUI = () => {
  renderUi();
  updatePaginationUi();
};
