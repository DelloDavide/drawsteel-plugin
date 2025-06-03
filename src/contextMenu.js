import OBR from "@owlbear-rodeo/sdk";

const ID = "drawsteel-plugin.character-name-tracker";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: `${window.location.origin}/assets/owlPlus.svg`,
        label: "Add Character Name",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: `${window.location.origin}/assets/owlMinus.svg`,
        label: "Remove Character Name",
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
        const characterName = window.prompt("Scrivi il nome del tuo personaggio (Supportati per ora: 'Condizioni', 'Azioni', 'Manovre', 'Movimento', 'Degotho', 'C'eree', 'M'kell', 'Antares', 'Valangus', 'Daron', 'Master')");
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