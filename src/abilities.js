import { CONFIG } from './config';
import { stateManager } from './state';
import { handleError, validateElements, getPropertyCaseInsensitive, ERROR_MESSAGES } from './utils';

export async function getFiles(abilitiesFileSelect) {
  try {
    if (CONFIG.ABILITIES_FILES && Object.keys(CONFIG.ABILITIES_FILES).length > 0) {
      const selectOptions = Object.entries(CONFIG.ABILITIES_FILES)
        .map(([key, fileName]) => `<option value="${fileName}">${key}</option>`)
        .join('\n');
      abilitiesFileSelect.innerHTML = selectOptions;
    } else {
      handleError(new Error(ERROR_MESSAGES.NO_FILES), abilitiesFileSelect);
    }
  } catch (error) {
    handleError(error, abilitiesFileSelect);
  }
}

export async function getUsers(usersNameSelect, abilityNamesSelect, abilityCard) {
  if (!validateElements({ usersNameSelect, abilityNamesSelect, abilityCard })) {
    handleError(new Error(ERROR_MESSAGES.MISSING_ELEMENTS), abilityCard);
    return;
  }

  try {
    const abilities = await readAbilities(stateManager.choosenFile);

    if (abilities && Object.keys(abilities).length > 0) {
      const selectOptions = Object.keys(abilities)
        .map(key => `<option value="${key}">${key}</option>`)
        .join('\n');
      usersNameSelect.innerHTML = selectOptions;
    } else {
      handleError(new Error(ERROR_MESSAGES.NO_ABILITIES), abilityCard);
    }
  } catch (error) {
    handleError(error, abilityCard);
  }
}

export async function getUserAbilities(usersNameSelect, abilityNamesSelect, abilityCard) {
  if (!validateElements({ usersNameSelect, abilityNamesSelect, abilityCard })) {
    handleError(new Error(ERROR_MESSAGES.MISSING_ELEMENTS), abilityCard);
    return;
  }

  const userId = usersNameSelect.value;

  try {
    const abilities = await readAbilities(stateManager.choosenFile);
    const data = getPropertyCaseInsensitive(abilities, userId);

    if (data && Object.keys(data).length > 0) {
      const selectOptions = Object.entries(data)
        .map(([key, ability]) => `<option value="${key}">${ability.name}</option>`)
        .join('\n');
      abilityNamesSelect.innerHTML = selectOptions;
    } else {
      handleError(new Error(ERROR_MESSAGES.NO_ABILITIES), abilityCard);
    }
  } catch (error) {
    handleError(error, abilityCard);
  }
}

export async function getAbility(usersNameSelect, abilityNamesSelect, abilityCard) {
  if (!validateElements({ usersNameSelect, abilityNamesSelect, abilityCard })) {
    handleError(new Error(ERROR_MESSAGES.MISSING_ELEMENTS), abilityCard);
    return;
  }

  abilityCard.style.display = "flex";
  abilityCard.innerHTML = '';
  abilityCard.style.display = 'none';

  if (!usersNameSelect || !abilityNamesSelect) {
    handleError(new Error(ERROR_MESSAGES.MISSING_INPUT), abilityCard);
    return;
  }

  await displayAbility(usersNameSelect, abilityNamesSelect, abilityCard);
}

export async function getStoredAbility(abilitiesFileSelect, usersNameSelect, abilityNamesSelect, abilityCard) {
  if (!validateElements({ usersNameSelect, abilityNamesSelect, abilityCard })) {
    handleError(new Error(ERROR_MESSAGES.MISSING_ELEMENTS), abilityCard);
    return;
  }

  abilityCard.style.display = "flex";
  abilityCard.innerHTML = '';
  abilityCard.style.display = 'none';

  if (!usersNameSelect || !abilityNamesSelect) {
    handleError(new Error(ERROR_MESSAGES.MISSING_INPUT), abilityCard);
    return;
  }

  await displayAbilityStored(abilitiesFileSelect, usersNameSelect, abilityNamesSelect, abilityCard);
}

async function displayAbilityStored(abilitiesFile, userId, abilityName, abilityCard) {
  try {
    const abilities = await readAbilities(abilitiesFile);
    const dataUser = getPropertyCaseInsensitive(abilities, userId);
    const data = getPropertyCaseInsensitive(dataUser, abilityName);

    if (data && Object.keys(data).length > 0) {
      createCard(data, abilityCard);
    } else {
      handleError(
        new Error(`Nessuna abilità trovata con questo nome/ID, file: ${stateManager.choosenFile}, userId: ${userId}, abilityName: ${abilityName}`),
        abilityCard
      );
    }
  } catch (error) {
    handleError(error, abilityCard);
  }
}

async function displayAbility(userId, abilityName, abilityCard) {
  try {
    const abilities = await readAbilities(stateManager.choosenFile);
    const dataUser = getPropertyCaseInsensitive(abilities, userId);
    const data = getPropertyCaseInsensitive(dataUser, abilityName);

    if (data && Object.keys(data).length > 0) {
      createCard(data, abilityCard);
    } else {
      handleError(
        new Error(`Nessuna abilità trovata con questo nome/ID, file: ${stateManager.choosenFile}, userId: ${userId}, abilityName: ${abilityName}`),
        abilityCard
      );
    }
  } catch (error) {
    handleError(error, abilityCard);
  }
}

function createCard(data, abilityCard) {
  abilityCard.style.display = 'flex';

  const elements = {
    title: createElement('h3', data.name || 'Nome Sconosciuto'),
    typeBadge: createElement('div', getAbilityBadge(data.name, data.type), { id: 'abilityTypeBadge' })
  };

  Object.values(elements).forEach(element => abilityCard.appendChild(element));

  if (data.keywords) {
    abilityCard.appendChild(createSection('Keywords', data.keywords, 'full-width', 'keywords'));
  }

  if (data.type) {
    abilityCard.appendChild(createSection('Action', data.type));
  }

  if (data.char) {
    abilityCard.appendChild(createSection('', `Power Roll: ${data.char}`, 'full-width', 'power-roll-title'));
  }

  if (data.distance) {
    abilityCard.appendChild(createSection('Distance', data.distance));
  }

  if (data.target) {
    abilityCard.appendChild(createSection('Target', data.target));
  }

  const damageRolls = [data.roll1, data.roll2, data.roll3].filter(Boolean);
  if (damageRolls.length > 0) {
    abilityCard.appendChild(createDamageList(damageRolls));
  }

  if (data.effect) {
    abilityCard.appendChild(createSection('Effect', data.effect, 'full-width', '', { textAlign: 'center', paddingRight: '0' }));
  }
}

function getAbilityBadge(name, type) {
  const nameLower = name?.toLowerCase() || '';
  const typeLower = type?.toLowerCase() || '';

  // Check for numbers in parentheses (Heroic Ability)
  const numberMatch = name.match(/\((\d+)\)/i);
  if (numberMatch) {
    return numberMatch[1];
  }

  // Check for Free Strike
  if (nameLower.includes('free strike')) {
    return 'FS';
  }

  // Check for Signature
  if (nameLower.includes('(signature)')) {
    return 'S';
  }

  // Check for Manovra Gratuita
  if (nameLower.includes('(manovra gratuita)') || typeLower === 'manovra gratuita') {
    return 'FM';
  }

  // Check for Manovra
  if (typeLower === 'manovra' || nameLower.includes('(manovra)')) {
    return 'M';
  }

  // Check for Azione Innescata Gratuita
  if (nameLower.includes('(azione innescata gratuita)') || typeLower === 'azione innescata gratuita') {
    return 'FT';
  }

  // Check for Azione Innescata
  if (nameLower.includes('(azione innescata)') || typeLower === 'azione innescata') {
    return 'T';
  }

  // Default case
  return 'A';
}

function createElement(tag, content, attributes = {}) {
  const element = document.createElement(tag);
  element.textContent = content;
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
  return element;
}

function createSection(label, value, className = '', valueClassName = '', labelStyle = {}) {
  const section = document.createElement('div');
  section.className = `card-section ${className}`;

  const labelSpan = document.createElement('span');
  labelSpan.className = 'card-label';
  labelSpan.textContent = label;
  Object.entries(labelStyle).forEach(([key, value]) => labelSpan.style[key] = value);

  const valueSpan = document.createElement('span');
  valueSpan.className = `card-value ${valueClassName}`;
  valueSpan.innerHTML = value;

  section.appendChild(labelSpan);
  section.appendChild(valueSpan);
  return section;
}

function createDamageList(damageRolls) {
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

  return damageList;
}

async function readAbilities(file) {
  const response = await fetch(file);
  if (!response.ok) {
    throw new Error(ERROR_MESSAGES.HTTP_ERROR + response.status);
  }
  return await response.json();
}

export function setChoosenFile(file) {
  stateManager.choosenFile = file;
}