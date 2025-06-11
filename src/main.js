import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { getAbility, getUserAbilities, getUsers, getFiles } from "./abilities";
import { setMetadataPopover, openClosePopover } from "./popover";

const abilitiesDictionary = {
  Campagna_A: "./abilities.json",
  Campagna_B: "./abilities2.json"
};

let choosenFile;
let abilitiesFileSelect;
let searchAbilitiesFileButton;
let usersNameSelect;
let abilityNamesSelect;
let searchButton;
let searchUserAbilityButton;
let windowSearchButton;
let abilityCard;

async function initializeApp() {
  document.querySelector("#app").innerHTML = `
    <div>
      <div class="page-center">
        <div class="custom-select-wrapper">
          <select id="abilitiesFileSelect">
            <option value="" disabled selected hidden>Cerca Campagna</option>
          </select>
          <div class="custom-arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M7 10l5 5 5-5" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
      </div>
        <button id="searchAbilitiesFileButton" title="Cerca Abilità">Scegli Campagna</button><br>
      </div>
      <img src="./owl.svg" alt="Owl Icon" />
      <h2>Manuale del Giocatore  Draw Steel</h2>
      <div class="page-center">
        <div class="custom-select-wrapper">
          <select id="usersNameSelect">
            <option value="" disabled selected hidden>Nome Categoria</option>
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

  abilitiesFileSelect = document.getElementById('abilitiesFileSelect');
  searchAbilitiesFileButton = document.getElementById('searchAbilitiesFileButton');
  usersNameSelect = document.getElementById('usersNameSelect');
  abilityNamesSelect = document.getElementById('abilityNamesSelect');
  searchButton = document.getElementById('searchButton');
  searchUserAbilityButton = document.getElementById('searchUserAbilityButton');
  windowSearchButton = document.getElementById('windowSearchButton');
  abilityCard = document.getElementById('abilityCard');

  if (abilitiesFileSelect) {
    await getFiles(abilitiesFileSelect, abilitiesDictionary)
  } else {
    console.warn("abilitiesFileSelect element not found for abilitiesFileSelect.");
  }

  if (searchAbilitiesFileButton) {
    searchAbilitiesFileButton.addEventListener('click', async () => {
      setChoosenFile(abilitiesFileSelect.value);
      await getUsers(usersNameSelect, abilityNamesSelect, abilityCard);
    });
  } else {
    console.error("#searchAbilitiesFileButton element not found.");
  }

  if (usersNameSelect && typeof choosenFile === "string" && choosenFile.trim() !== "" ) {
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

function getChoosenFile() {
  return choosenFile;
}

function setChoosenFile(choosenFileNew) {
  choosenFile = choosenFileNew;
}

export { getChoosenFile, setChoosenFile };

OBR.onReady(() => {
  console.log("Owlbear Rodeo SDK is available");
  initializeApp();
});
