import OBR from "@owlbear-rodeo/sdk";

const ID = "drawsteel-plugin.discord-id-tracker";

export function setupContextMenu() {
  OBR.contextMenu.create({
    id: `${ID}/context-menu`,
    icons: [
      {
        icon: `${window.location.origin}/assets/discordAdd.svg`,
        label: "Add your Discord ID",
        filter: {
          every: [
            { key: "layer", value: "CHARACTER" },
            { key: ["metadata", `${ID}/metadata`], value: undefined },
          ],
        },
      },
      {
        icon: `${window.location.origin}/assets/discordRemove.svg`,
        label: "Remove your Discord ID",
        filter: {
          every: [{ key: "layer", value: "CHARACTER" }],
        },
      },
    ],
    onClick(context) {
      const addToInitiative = context.items.every(
        (item) => item.metadata[`${ID}/metadata`] === undefined
      );
      if (addToInitiative) {
        const initiative = window.prompt("Enter your Discord ID");
        OBR.scene.items.updateItems(context.items, (items) => {
          for (let item of items) {
            item.metadata[`${ID}/metadata`] = {
              initiative,
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