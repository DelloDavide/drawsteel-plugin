import OBR from "@owlbear-rodeo/sdk";

const popoverId = "drawsteel-plugin/popover";

OBR.onReady(() => {
  OBR.room.onMetadataChange((metadata) => {
    if (metadata["drawsteel-plugin/showPopover"]) {
      openPopover();
    } else {
      closePopover();
    }
  });
});

export async function setMetadataPopover() {
    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopover": true,
    });
}

export async function openClosePopover(usersNameSelected, abilityNamesSelected) {
    const metadata = await OBR.room.getMetadata();
    const isOpen = metadata["drawsteel-plugin/showPopover"] === true;

    await OBR.room.setMetadata({
      "drawsteel-plugin/showPopover": !isOpen,
    });

    if(!isOpen){
      await OBR.room.setMetadata({
        "drawsteel-plugin/showPopoverUserSelected": usersNameSelected,
      });

      await OBR.room.setMetadata({
        "drawsteel-plugin/showPopoverabilityNamesSelected": abilityNamesSelected,
      });
    }

    else{
      await OBR.room.setMetadata({
        "drawsteel-plugin/showPopoverUserSelected": "",
      });

      await OBR.room.setMetadata({
        "drawsteel-plugin/showPopoverabilityNamesSelected": "",
      });
    }
}

function openPopover() {
  OBR.popover.open({
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
}

function closePopover() {
  OBR.popover.close(popoverId);
}