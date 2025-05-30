import OBR from "@owlbear-rodeo/sdk";

const EXTENSION_ID = "com.steel.discorduserid"; // Must match your manifest.json id
const METADATA_KEY_USER_ID = `${EXTENSION_ID}/discordUserId`;

OBR.onReady(() => {
  OBR.contextMenu.create({
    id: `${EXTENSION_ID}/set-discord-id`,
    icons: [
      {
        icon: "./owl.svg", // You can use a more specific icon if you have one
        label: "Set Player ID",
        mimeType: "image/svg+xml",
      },
    ],
    onClick: async (context) => {
      if (context.selection.length === 0) {
        OBR.notification.show("Please select at least one token.", "WARNING");
        return;
      }

      const currentToken = (await OBR.scene.items.getItems(context.selection.map(item => item.id)))[0];
      const currentId = currentToken?.metadata[METADATA_KEY_USER_ID] || "";

      const userId = prompt("Enter the Discord User ID for the selected token(s):", currentId);

      if (userId !== null) { // User didn't cancel prompt
        await OBR.scene.items.updateItems(
          (item) => context.selection.some(selectedItem => selectedItem.id === item.id),
          (items) => {
            for (let item of items) {
              item.metadata[METADATA_KEY_USER_ID] = userId.trim();
            }
          }
        );
        OBR.notification.show(`Player ID "${userId.trim()}" set for selected token(s).`, "SUCCESS");
      }
    },
    // Show only when image (token) items are selected
    filter: {
      every: [{ key: "layer", value: "CHARACTER", coordinator: "||" }, { key: "layer", value: "MOUNT" }],
      permissions: ["UPDATE"]
    }
  });
});