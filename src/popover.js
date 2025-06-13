import OBR from "@owlbear-rodeo/sdk";

export const popoverId = "drawsteel-plugin/popover";

OBR.onReady(() => {
  OBR.room.onMetadataChange(async (metadata) => {
    if (metadata["drawsteel-plugin/showPopover"] === true) {
      await openPopover();
    }
  });
});

export async function setMetadataPopover() {
  await OBR.room.setMetadata({
    "drawsteel-plugin/showPopover": false,
  });
}

export async function openClosePopover(usersNameSelected, abilityNamesSelected, fileSelected) {
  const metadata = await OBR.room.getMetadata();
  const isOpen = metadata["drawsteel-plugin/showPopover"] === true;

  if (isOpen) return;

  await OBR.room.setMetadata({
    "drawsteel-plugin/showPopover": true,
    "drawsteel-plugin/showPopoverUserSelected": usersNameSelected,
    "drawsteel-plugin/showPopoverabilityNamesSelected": abilityNamesSelected,
    "drawsteel-plugin/showPopoverFileSelected": fileSelected
  });
}

async function openPopover() {
  const metadata = await OBR.room.getMetadata();
  const user = metadata["drawsteel-plugin/showPopoverUserSelected"];
  const ability = metadata["drawsteel-plugin/showPopoverabilityNamesSelected"];
  const file = metadata["drawsteel-plugin/showPopoverFileSelected"];

  if (!user || !ability || !file) {
    console.warn("Dati mancanti per aprire il popover.");
    return;
  }

  await OBR.popover.open({
    id: popoverId,
    url: `/popover.html?file=${encodeURIComponent(file)}&user=${encodeURIComponent(user)}&ability=${encodeURIComponent(ability)}`,
    width: 600,
    height: 600,
    anchorOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
    transformOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
    disableClickAway: true,
    hidePaper: true,
    marginThreshold: 0,
  });

  // Reset dopo 15 secondi (opzionale)
  setTimeout(async () => {
    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopover": false,
      "drawsteel-plugin/showPopoverUserSelected": "",
      "drawsteel-plugin/showPopoverabilityNamesSelected": "",
      "drawsteel-plugin/showPopoverFileSelected": ""
    });

    await OBR.popover.close(popoverId);
  }, 15000);
}