//ui.js
import { state } from './state.js';
export const list = document.querySelector('.list');

export const renderUi = () => {
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
