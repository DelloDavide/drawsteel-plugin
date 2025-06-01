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

function initializeApp() {
  document.querySelector("#app").innerHTML = `
  <div>
    <img src="./owl.svg" alt="Owl Icon" />
    <h2>Abilità del Giocatore</h2>
    <input type="text" id="userId" placeholder="User ID Discord" /><br>
    <input type="text" id="abilityName" placeholder="Nome Abilità" /><br>
    <button id="searchButton">Cerca</button> 
    <div id="abilityCard"></div>
  </div>
  `;

  userIdInput = document.getElementById('userId');
  abilityNameInput = document.getElementById('abilityName');
  searchButton = document.getElementById('searchButton');
  abilityCard = document.getElementById('abilityCard');

  if (searchButton) {
    searchButton.addEventListener('click', getAbility); 
  } else {
    console.error("#searchButton element not found.");
  }

  if (window.OBR) {
    OBR.onReady(async () => {
      setupContextMenu();

      const initiativeListElement = document.querySelector("#initiative-list");
      if (initiativeListElement) {
        setupInitiativeList(initiativeListElement);
      } else {
        console.warn("#initiative-list element not found for setupInitiativeList.");
      }

    });
  } else {
    console.warn("Owlbear Rodeo SDK not found. Running in standalone mode. Some features might not work.");
  }
}

initializeApp();