import "./style.css";
import "./mainStyle.css";
import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./contextMenu";
import { setupCharacterList } from "./characterList";
import { getAbility } from "./abilities";

let userIdInput;
let abilityNameInput;
let searchButton;
let abilityCard;
let characterListElement;

function initializeApp() {
  document.querySelector("#app").innerHTML = `
    <div>
      <img src="./owl.svg" alt="Owl Icon" />
      <h2>Manuale del Giocatore  Draw Steel</h2>
      <input type="text" id="userId" placeholder="Nome Categoria / Personaggio" /><br>
      <input type="text" id="abilityName" placeholder="Nome Azione" /><br>
      <button id="searchButton">Cerca</button> 
      <div id="abilityCard"></div>
      <ul id="character-list"></ul>
    </div>
  `;

  userIdInput = document.getElementById('userId');
  abilityNameInput = document.getElementById('abilityName');
  searchButton = document.getElementById('searchButton');
  abilityCard = document.getElementById('abilityCard');
  characterListElement = document.querySelector("#character-list");

  setupContextMenu();

  if (characterListElement) {
    setupCharacterList(characterListElement);
  } else {
    console.warn("#character-list element not found for setupCharacterList.");
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
