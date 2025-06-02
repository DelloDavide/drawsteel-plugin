import "./style.css";
import "./mainStyle.css";
import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./contextMenu";
import { setupCharacterList } from "./characterList";
import { getAbility, getUserAbilities } from "./abilities";

let userIdInput;
let abilityNamesSelect;
let searchButton;
let searchUserAbilityButton;
let abilityCard;

function initializeApp() {
  document.querySelector("#app").innerHTML = `
    <div>
      <img src="./owl.svg" alt="Owl Icon" />
      <h2>Manuale del Giocatore  Draw Steel</h2>
      <div class="page-center">
        <input type="text" id="userId" placeholder="Nome Categoria / Personaggio" readonly /><br>
        <button id="searchUserAbilityButton">Cerca Abilità</button><br>
      </div>
      <div class="page-center">
        <div class="custom-select-wrapper">
          <select id="abilityName">
            <option value="" disabled selected hidden>Nome Azione</option>
          </select>
          <div class="custom-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>
        <button id="searchButton">Vedi Abilità</button><br>
      </div>
      <div id="abilityCard"></div>
    </div>
  `;

  userIdInput = document.getElementById('userId');
  abilityNamesSelect = document.getElementById('abilityName');
  searchButton = document.getElementById('searchButton');
  searchUserAbilityButton = document.getElementById('searchUserAbilityButton');
  abilityCard = document.getElementById('abilityCard');

  setupContextMenu();

  if (userIdInput) {
    setupCharacterList(userIdInput);
  } else {
    console.warn("userIdInput element not found for setupCharacterList.");
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
