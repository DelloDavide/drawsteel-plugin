import "./style.css";
import "./mainStyle.css";
import OBR from "@owlbear-rodeo/sdk";
import { setupActionsList } from "./characterList";
import { getAbility, getUserAbilities, getUsers } from "./abilities";
import { setMetadataPopover, openClosePopover } from "./background";

let usersNameSelect;
let abilityNamesSelect;
let searchButton;
let searchUserAbilityButton;
let windowSearchButton;
let abilityCard;

async function initializeApp() {
  document.querySelector("#app").innerHTML = `
    <div>
      <img src="./owl.svg" alt="Owl Icon" />
      <h2>Manuale del Giocatore  Draw Steel</h2>
      <div class="page-center">
        <div class="custom-select-wrapper">
          <select id="usersNameSelect">
            <option value="" disabled selected hidden>Nome Azione</option>
          </select>
          <div class="custom-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
      </div>
        <button id="searchUserAbilityButton">Cerca Abilità</button><br>
      </div>
      <div class="page-center">
        <div class="custom-select-wrapper">
          <select id="abilityNamesSelect">
            <option value="" disabled selected hidden>Nome Azione</option>
          </select>
          <div class="custom-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      <div class="page-center">
        <button id="searchButton">Vedi Abilità - Locale</button><br>
        <button id="windowSearchButton">Vedi Abilità - Condivisa</button><br>
      </div>
      <div id="abilityCard"></div>
    </div>
  `;

  usersNameSelect = document.getElementById('usersNameSelect');
  abilityNamesSelect = document.getElementById('abilityNamesSelect');
  searchButton = document.getElementById('searchButton');
  searchUserAbilityButton = document.getElementById('searchUserAbilityButton');
  windowSearchButton = document.getElementById('windowSearchButton');
  abilityCard = document.getElementById('abilityCard');

  if (usersNameSelect) {
    getUsers()
    setupActionsList(usersNameSelect);
  } else {
    console.warn("usersNameSelect element not found for setupActionsList.");
  }

  if (searchUserAbilityButton) {
    searchUserAbilityButton.addEventListener('click', getUserAbilities);
  } else {
    console.error("#searchUserAbilityButton element not found.");
  }

  if (searchButton) {
    searchButton.addEventListener('click', getAbility);
  } else {
    console.error("#searchButton element not found.");
  }

  if (windowSearchButton) {
    await setMetadataPopover()
    windowSearchButton.addEventListener('click', () => {
      openClosePopover(usersNameSelect.value, abilityNamesSelect.value);
    });
  } else {
    console.error("#windowSearchButton element not found.");
  }
}

OBR.onReady(() => {
  console.log("Owlbear Rodeo SDK is available");
  initializeApp();
});

setTimeout(() => {
  if (!window.OBR || !window.owbear) {
    console.warn("Owlbear Rodeo SDK not found. Running in standalone mode.");
    initializeApp();
  }
}, 1000);
