import "./style.css";
import "./mainStyle.css";
import OBR from "@owlbear-rodeo/sdk";
import { setupContextMenu } from "./contextMenu";
import { setupInitiativeList } from "./initiativeList";
import { getAbility } from "./abilities";

let userIdInput;
let abilityNameInput;
let searchButton;
let abilityCard;
let initiativeListElement;

function initializeApp() {
  document.querySelector("#app").innerHTML = `
    <div>
      <img src="./owl.svg" alt="Owl Icon" />
      <h2>Abilità del Giocatore</h2>
      <input type="text" id="userId" placeholder="Nome Personaggio" /><br>
      <input type="text" id="abilityName" placeholder="Nome Abilità" /><br>
      <button id="searchButton">Cerca</button> 
      <div id="abilityCard"></div>
      <ul id="initiative-list"></ul>
    </div>
  `;

  userIdInput = document.getElementById('userId');
  abilityNameInput = document.getElementById('abilityName');
  searchButton = document.getElementById('searchButton');
  abilityCard = document.getElementById('abilityCard');
  initiativeListElement = document.querySelector("#initiative-list");

  setupContextMenu();

  if (initiativeListElement) {
    setupInitiativeList(initiativeListElement);
  } else {
    console.warn("#initiative-list element not found for setupInitiativeList.");
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
