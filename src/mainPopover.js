import "./style.css";
import "./mainStyle.css";
import OBR from "@owlbear-rodeo/sdk";
import { getAbilityPopover } from "./abilities";

let abilityCardPopover;
let userId;

async function initializeApp() {
  document.querySelector("#app").innerHTML = `
    <div>
      <h3 id="userId"></h3>
      <div id="abilityCardPopover"></div>
    </div>
  `;

  abilityCardPopover = document.getElementById('abilityCardPopover');
  userId = document.getElementById('userId');

  if (abilityCardPopover && userId) {
    const metadata = await OBR.room.getMetadata();
    const userSelected = metadata["drawsteel-plugin/showPopoverUserSelected"];
    const abilitySelected = metadata["drawsteel-plugin/showPopoverabilityNamesSelected"];

    userId.innerHTML = userSelected;
    getAbilityPopover(userSelected, abilitySelected, abilityCardPopover);
  } else {
    console.error("#abilityCardPopover element not found.");
  }
}

OBR.onReady(() => {
  console.log("Popover - Owlbear Rodeo SDK is available");
  initializeApp();
});

setTimeout(() => {
  if (!window.OBR || !window.owbear) {
    console.warn("Popover - Owlbear Rodeo SDK not found. Running in standalone mode.");
    initializeApp();
  }
}, 1000);
