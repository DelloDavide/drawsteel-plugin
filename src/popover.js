import OBR from "@owlbear-rodeo/sdk";
import { CONFIG } from './config';
import { POPOVER_DIMENSIONS } from './utils';

export const popoverId = CONFIG.POPOVER.ID;

OBR.onReady(() => {
  OBR.room.onMetadataChange(async (metadata) => {
    if (metadata[CONFIG.POPOVER.METADATA_KEYS.SHOW_POPOVER] === true) {
      await openPopover();
    }
  });
});

export async function setMetadataPopover() {
  await OBR.room.setMetadata({
    [CONFIG.POPOVER.METADATA_KEYS.SHOW_POPOVER]: false,
  });
}

export async function openClosePopover(usersNameSelected, abilityNamesSelected, fileSelected) {
  const metadata = await OBR.room.getMetadata();
  const isOpen = metadata[CONFIG.POPOVER.METADATA_KEYS.SHOW_POPOVER] === true;

  if (isOpen) return;

  await OBR.room.setMetadata({
    [CONFIG.POPOVER.METADATA_KEYS.SHOW_POPOVER]: true,
    [CONFIG.POPOVER.METADATA_KEYS.USER_SELECTED]: usersNameSelected,
    [CONFIG.POPOVER.METADATA_KEYS.ABILITY_SELECTED]: abilityNamesSelected,
    [CONFIG.POPOVER.METADATA_KEYS.FILE_SELECTED]: fileSelected
  });
}

async function openPopover() {
  const metadata = await OBR.room.getMetadata();
  const user = metadata[CONFIG.POPOVER.METADATA_KEYS.USER_SELECTED];
  const ability = metadata[CONFIG.POPOVER.METADATA_KEYS.ABILITY_SELECTED];
  const file = metadata[CONFIG.POPOVER.METADATA_KEYS.FILE_SELECTED];

  if (!user || !ability || !file) {
    console.warn("Dati mancanti per aprire il popover.");
    return;
  }

  await OBR.popover.open({
    id: popoverId,
    url: `/popover.html?file=${encodeURIComponent(file)}&user=${encodeURIComponent(user)}&ability=${encodeURIComponent(ability)}`,
    width: POPOVER_DIMENSIONS.WIDTH,
    height: POPOVER_DIMENSIONS.HEIGHT,
    anchorOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
    transformOrigin: { horizontal: "RIGHT", vertical: "BOTTOM" },
    disableClickAway: true,
    hidePaper: true,
    marginThreshold: 0,
  });

  // Reset dopo il timeout
  setTimeout(async () => {
    await OBR.room.setMetadata({
      [CONFIG.POPOVER.METADATA_KEYS.SHOW_POPOVER]: false,
      [CONFIG.POPOVER.METADATA_KEYS.USER_SELECTED]: "",
      [CONFIG.POPOVER.METADATA_KEYS.ABILITY_SELECTED]: "",
      [CONFIG.POPOVER.METADATA_KEYS.FILE_SELECTED]: ""
    });

    await OBR.popover.close(popoverId);
  }, POPOVER_DIMENSIONS.TIMEOUT);
}