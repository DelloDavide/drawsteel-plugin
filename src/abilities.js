let choosenFile;

export const abilitiesFilesDictionary = {
  "Milizia Di Taed": "./Milizia_Di_Taed.json",
  "L'Ultimo Sole": "./L_Ultimo_Sole.json"
};

export async function getFiles(abilitiesFileSelect) {
  try {
    if (abilitiesFilesDictionary && Object.keys(abilitiesFilesDictionary).length > 0 && !abilitiesFilesDictionary.error) {
      let selectOptions = '';
      for (const key in abilitiesFilesDictionary) {
        if (abilitiesFilesDictionary.hasOwnProperty(key)) {
          const fileName = abilitiesFilesDictionary[key];
          selectOptions += `<option value="${fileName}">${key}</option>\n`;
        }
        abilitiesFileSelect.innerHTML = selectOptions;
      }
    } else {
      const errorMessage = data.error || 'Nessun file trovato';
      abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">${errorMessage}</div>`;
      abilityCard.style.display = 'flex';
    }

  } catch (error) {
    console.error('Errore nel recupero dei file:', error);
    abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">Si è verificato un errore: ${error.message}</div>`;
    abilityCard.style.display = 'flex';
  }
}

export async function getUsers(usersNameSelect, abilityNamesSelect, abilityCard) {
  if (!usersNameSelect || !abilityNamesSelect || !abilityCard) {
    console.error('getUsers: Elementi DOM necessari non trovati (usersNameSelect, abilityNamesSelect, o abilityCard).');
    if (abilityCard) {
      abilityCard.innerHTML = '<div style="text-align: center; color: #FF6B6B;">Errore di configurazione: elementi mancanti.</div>';
      abilityCard.style.display = 'flex';
    }
    return;
  }

  try {
    const abilities = await readAbilities(getChoosenFile())

    if (abilities && Object.keys(abilities).length > 0 && !abilities.error) {
      let selectOptions = '';
      for (const key in abilities) {
        if (abilities.hasOwnProperty(key)) {
          selectOptions += `<option value="${key}">${key}</option>\n`;
        }
        usersNameSelect.innerHTML = selectOptions;
      }
    } else {
      const errorMessage = data.error || 'Nessuna abilità trovata per questo User';
      abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">${errorMessage}</div>`;
      abilityCard.style.display = 'flex';
    }

  } catch (error) {
    console.error('Errore nel recupero delle abilità per questo User:', error);
    abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">Si è verificato un errore: ${error.message}</div>`;
    abilityCard.style.display = 'flex';
  }
}

export async function getUserAbilities(usersNameSelect, abilityNamesSelect, abilityCard) {
  if (!usersNameSelect || !abilityNamesSelect || !abilityCard) {
    console.error('getUserAbilities: Elementi DOM necessari non trovati (usersNameSelect, abilityNamesSelect, o abilityCard).');
    if (abilityCard) {
      abilityCard.innerHTML = '<div style="text-align: center; color: #FF6B6B;">Errore di configurazione: elementi mancanti.</div>';
      abilityCard.style.display = 'flex';
    }
    return;
  }

  const userId = usersNameSelect.value;

  try {
    const abilities = await readAbilities(getChoosenFile())

    const data = getPropertyCaseInsensitive(abilities, userId);

    if (data && Object.keys(data).length > 0 && !data.error) {
      let selectOptions = '';
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const ability = data[key];
          selectOptions += `<option value="${key}">${ability.name}</option>\n`;
        }
        abilityNamesSelect.innerHTML = selectOptions;
      }
    } else {
      const errorMessage = data.error || 'Nessuna abilità trovata per questo User';
      abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">${errorMessage}</div>`;
      abilityCard.style.display = 'flex';
    }

  } catch (error) {
    console.error('Errore nel recupero delle abilità per questo User:', error);
    abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">Si è verificato un errore: ${error.message}</div>`;
    abilityCard.style.display = 'flex';
  }
}

export async function getAbility(usersNameSelect, abilityNamesSelect, abilityCard) {
  if (!usersNameSelect || !abilityNamesSelect || !abilityCard) {
    console.error('getAbility: Elementi DOM necessari non trovati (usersNameSelect, abilityNamesSelect, o abilityCard).');
    if (abilityCard) {
      abilityCard.innerHTML = '<div style="text-align: center; color: #FF6B6B;">Errore di configurazione: elementi mancanti.</div>';
      abilityCard.style.display = 'flex';
    }
    return;
  }

  abilityCard.style.display = "flex";

  const userId = usersNameSelect;
  const abilityName = abilityNamesSelect;

  abilityCard.innerHTML = '';
  abilityCard.style.display = 'none';

  if (!userId || !abilityName) {
    abilityCard.innerHTML = '<div style="text-align: center; color: #FFB300;">Per favore, inserisci User ID e Nome Abilità.</div>';
    abilityCard.style.display = 'flex';
    return;
  }

  await displayAbility(userId, abilityName, abilityCard)
}

async function displayAbility(userId, abilityName, abilityCard) {
  try {
    const file = getChoosenFile();
    const abilities = await readAbilities(file);
    const dataUser = getPropertyCaseInsensitive(abilities, userId);
    const data = getPropertyCaseInsensitive(dataUser, abilityName);

    if (data && Object.keys(data).length > 0 && !data.error) {
      createCard(data, abilityCard);
    } else {
      const errorMessage = data?.error || `Nessuna abilità trovata con questo nome/ID, file: ${file}, userId: ${userId}, abilityName: ${abilityName}`;
      abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">${errorMessage}</div>`;
      abilityCard.style.display = 'flex';
    }

  } catch (error) {
    console.error('Errore nel recupero dell\'abilità:', error);
    abilityCard.innerHTML = `<div style="text-align: center; color: #FF6B6B;">Si è verificato un errore: ${error.message}</div>`;
    abilityCard.style.display = 'flex';
  }
}

function createCard(data, abilityCard){
  abilityCard.style.display = 'flex';

      const title = document.createElement('h3');
      title.textContent = data.name || 'Nome Sconosciuto';
      abilityCard.appendChild(title);

      const typeBadge = document.createElement('div');
      typeBadge.id = 'abilityTypeBadge';
      typeBadge.textContent = (data.type && data.type.length > 0) ? data.type[0].toUpperCase() : 'A';
      abilityCard.appendChild(typeBadge);

      if (data.keywords) {
        const keywordsSection = document.createElement('div');
        keywordsSection.className = 'card-section full-width';
        keywordsSection.innerHTML = `<span class="card-label">Keywords</span><span class="card-value keywords">${data.keywords}</span>`;
        abilityCard.appendChild(keywordsSection);
      }

      if (data.type) {
        const typeSection = document.createElement('div');
        typeSection.className = 'card-section';
        typeSection.innerHTML = `<span class="card-label">Action</span><span class="card-value">${data.type}</span>`;
        abilityCard.appendChild(typeSection);
      }

      if (data.char) {
        const charSection = document.createElement('div');
        charSection.className = 'card-section full-width';
        charSection.innerHTML = `<span class="card-value power-roll-title">Power Roll: ${data.char}</span>`;
        abilityCard.appendChild(charSection);
      }

      if (data.distance) {
        const distanceSection = document.createElement('div');
        distanceSection.className = 'card-section';
        distanceSection.innerHTML = `<span class="card-label">Distance</span><span class="card-value">${data.distance}</span>`;
        abilityCard.appendChild(distanceSection);
      }

      if (data.target) {
        const targetSection = document.createElement('div');
        targetSection.className = 'card-section';
        targetSection.innerHTML = `<span class="card-label">Target</span><span class="card-value">${data.target}</span>`;
        abilityCard.appendChild(targetSection);
      }

      const damageRolls = [data.roll1, data.roll2, data.roll3].filter(Boolean);

      if (damageRolls.length > 0) {
        const damageList = document.createElement('ul');
        damageList.className = 'power-damage-list';
        damageRolls.forEach(rollText => {
          const listItem = document.createElement('li');
          const parts = rollText.split(':');
          if (parts.length === 2) {
            const condition = parts[0].replace(/\*/g, '').trim();
            const damage = parts[1].trim();
            listItem.innerHTML = `<span>${condition}</span><span>${damage}</span>`;
          } else {
            listItem.innerHTML = `<span>${rollText.trim()}</span><span></span>`;
          }
          damageList.appendChild(listItem);
        });
        abilityCard.appendChild(damageList);
      }

      if (data.effect) {
        const effectSection = document.createElement('div');
        effectSection.className = 'card-section full-width';
        effectSection.innerHTML = `<span class="card-label" style="text-align: center; padding-right: 0;">Effect</span><span class="card-value">${data.effect}</span>`;
        abilityCard.appendChild(effectSection);
      }
}

function getPropertyCaseInsensitive(obj, keyToFind) {
  if (!obj || typeof obj !== 'object' || keyToFind === null || keyToFind === undefined) {
    return undefined;
  }
  const lowerKeyToFind = String(keyToFind).toLowerCase();
  for (const currentKey in obj) {
    if (obj.hasOwnProperty(currentKey) && String(currentKey).toLowerCase() === lowerKeyToFind) {
      return obj[currentKey];
    }
  }
  return undefined;
}

async function readAbilities(file) {
  const response = await fetch(file);

  if (!response.ok) {
    throw new Error(`Errore HTTP: ${response.status}`);
  }

  return await response.json();
}

function getChoosenFile() {
  return choosenFile;
}

function setChoosenFile(choosenFileNew) {
  choosenFile = choosenFileNew;
}

export { getChoosenFile, setChoosenFile };