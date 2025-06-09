import OBR from "@owlbear-rodeo/sdk";

const popoverId = "drawsteel-plugin/popover";

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

export async function openClosePopover(usersNameSelected, abilityNamesSelected) {
  const metadata = await OBR.room.getMetadata();
  const isOpen = metadata["drawsteel-plugin/showPopover"] === true;

  if (isOpen) {
    return
  }
  else {

    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopover": true,
    });

    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopoverUserSelected": usersNameSelected,
    });

    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopoverabilityNamesSelected": abilityNamesSelected,
    });
  }
}

async function openPopover() {
  await OBR.popover.open({
    id: popoverId,
    url: "/popover.html",
    width: 600,
    height: 600,
    anchorOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
    transformOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
    disableClickAway: true,
    hidePaper: true,
    marginThreshold: 0,
  });

  setTimeout(async () => {
    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopoverUserSelected": "",
    });

    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopoverabilityNamesSelected": "",
    });

    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopover": false,
    });

    await OBR.popover.close("drawsteel-plugin/popover");
  }, 15000);
}