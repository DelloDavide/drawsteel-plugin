import OBR from "@owlbear-rodeo/sdk";

import { getUserAbilities } from "./abilities";

const ID = "drawsteel-plugin.character-name-tracker";

export function setupCharacterList(inputElement) {
    const abilityNamesSelect = document.getElementById('abilityName');
    const abilityCard = document.getElementById('abilityCard');
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
    if (sortedItems.length === 0)
    {
      inputElement.value = "";
      abilityNamesSelect.innerHTML = `<option value="" disabled selected hidden>Nome Azione</option>`;
      abilityCard.innerHTML = "";
      abilityCard.style.display = 'none'; 
    }
    for (const characterItem of sortedItems) {
      if(characterItem.character)
        inputElement.value = characterItem.character;
      else
      {
        inputElement.value = "";
        abilityNamesSelect.innerHTML = `<option value="" disabled selected hidden>Nome Azione</option>`;
        abilityCard.innerHTML = "";
        abilityCard.style.display = 'none'; 
      }
    }
  };

  OBR.scene.items.onChange(renderList);
}