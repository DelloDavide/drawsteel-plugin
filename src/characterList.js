import OBR from "@owlbear-rodeo/sdk";

const ID = "drawsteel-plugin.character-name-tracker";

export function setupCharacterList(element) {
  const renderList = (items) => {
    const characterItems = [];
    for (const item of items) {
      const metadata = item.metadata[`${ID}/metadata`];
      if (metadata) {
        characterItems.push({
          character: metadata.characterName,
          name: item.name,
        });
      }
    }
    const sortedItems = characterItems.sort(
      (a, b) => parseFloat(b.character) - parseFloat(a.character)
    );
    const nodes = [];
    for (const characterItem of sortedItems) {
      const node = document.createElement("li");
      node.innerHTML = `${characterItem.name} (${characterItem.character})`;
      nodes.push(node);
    }
    element.replaceChildren(...nodes);
  };
  OBR.scene.items.onChange(renderList);
}