import OBR from "@owlbear-rodeo/sdk";

const ID = "drawsteel-plugin.character-name-tracker";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: `${window.location.origin}/assets/discordAdd.svg`,
        label: "Aggiungi il tuo nome del tuo personaggio",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: `${window.location.origin}/assets/discordRemove.svg`,
        label: "Rimuovi il nome del tuo personaggio",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      const addCharacterName = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );
      if (addCharacterName) {
        const characterName = window.prompt("Scrivi il nome del tuo personaggio");
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = {
              characterName,
            };
          }
        });
      } else {
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            delete item.metadata[`${ID}/metadata`];
          }
        });
      }
    },
  });
}