import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { getAbility, getUserAbilities, getUsers } from "./abilities";
import { setMetadataPopover, openClosePopover } from "./popover";

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
        <button id="searchUserAbilityButton" title="Cerca Abilità">Cerca Abilità</button><br>
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
        <button id="searchButton" title="Vedi Abilità - Locale">Vedi Abilità - Locale</button><br>
        <button id="windowSearchButton" title="Mostra Abilità - Condividi">Mostra Abilità - Condividi</button><br>
      </div>
      <div class="page-center">
        <div id="abilityCard"></div>
      </div>
    </div>
  `;

  usersNameSelect = document.getElementById('usersNameSelect');
  abilityNamesSelect = document.getElementById('abilityNamesSelect');
  searchButton = document.getElementById('searchButton');
  searchUserAbilityButton = document.getElementById('searchUserAbilityButton');
  windowSearchButton = document.getElementById('windowSearchButton');
  abilityCard = document.getElementById('abilityCard');

  if (usersNameSelect) {
    await getUsers(usersNameSelect, abilityNamesSelect, abilityCard)
    await getUserAbilities(usersNameSelect, abilityNamesSelect, abilityCard);
  } else {
    console.warn("usersNameSelect element not found for usersNameSelect.");
  }

  if (searchUserAbilityButton) {
    searchUserAbilityButton.addEventListener('click', async () => {
      await getUserAbilities(usersNameSelect, abilityNamesSelect, abilityCard);
    });
  } else {
    console.error("#searchUserAbilityButton element not found.");
  }

  if (searchButton) {
    searchButton.addEventListener('click', async () => {
      await getAbility(usersNameSelect.value, abilityNamesSelect.value, abilityCard);
    });
  } else {
    console.error("#searchButton element not found.");
  }

  if (windowSearchButton) {
    await setMetadataPopover();
    windowSearchButton.addEventListener('click', async () => {
      windowSearchButton.disabled = true;
      windowSearchButton.classList.add('loading');

      try {
        await openClosePopover(usersNameSelect.value, abilityNamesSelect.value);
      } catch (err) {
        console.error("Errore durante openClosePopover:", err);
      }

      windowSearchButton.disabled = false;
      windowSearchButton.classList.remove('loading');
    });
  } else {
    console.error("#windowSearchButton element not found.");
  }
}

OBR.onReady(() => {
  console.log("Owlbear Rodeo SDK is available");
  initializeApp();
});
