import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { getAbility } from "./abilities";

let abilityCardPopover;
let userId;
let closePopoverBtn

async function initializeApp() {
  document.querySelector("#app").innerHTML = `
    <div>
    <button class="close-popover-btn" id="closePopoverBtn" aria-label="Chiudi Finestra">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
      <h3 id="userId"></h3>
      <div id="abilityCardPopover"></div>
    </div>
  `;

  abilityCardPopover = document.getElementById('abilityCardPopover');
  userId = document.getElementById('userId');
  closePopoverBtn = document.getElementById('closePopoverBtn');

  if (abilityCardPopover && userId) {
    const metadata = await OBR.room.getMetadata();
    const userSelected = metadata["drawsteel-plugin/showPopoverUserSelected"];
    const abilitySelected = metadata["drawsteel-plugin/showPopoverabilityNamesSelected"];

    if (typeof userSelected === "string" && userSelected.trim() !== "" &&
      typeof abilitySelected === "string" && abilitySelected.trim() !== "") {
      userId.innerHTML = userSelected;
      await getAbility(userSelected, abilitySelected, abilityCardPopover);
    }
  } else {
    console.error("#abilityCardPopover element not found.");
  }

  if (closePopoverBtn) {
    closePopoverBtn.addEventListener('click', async () => {

      await OBR.room.setMetadata({
        "drawsteel-plugin/showPopover": false,
      });
      await OBR.room.setMetadata({
        "drawsteel-plugin/showPopoverUserSelected": "",
      });

      await OBR.room.setMetadata({
        "drawsteel-plugin/showPopoverabilityNamesSelected": "",
      });

      await OBR.popover.close("drawsteel-plugin/popover");
    });
  } else {
    console.error("#closePopoverBtn element not found.");
  }
}

OBR.onReady(() => {
  console.log("Popover - Owlbear Rodeo SDK is available");
  initializeApp();
});
