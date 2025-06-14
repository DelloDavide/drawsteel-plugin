// Constants
export const POPOVER_DIMENSIONS = {
  WIDTH: 625,
  HEIGHT: 650,
  TIMEOUT: 15000
};

export const ERROR_MESSAGES = {
  NO_FILES: 'Nessun file trovato',
  NO_ABILITIES: 'Nessuna abilità trovata per questo User',
  MISSING_ELEMENTS: 'Errore di configurazione: elementi mancanti.',
  MISSING_INPUT: 'Per favore, inserisci User ID e Nome Abilità.',
  HTTP_ERROR: 'Errore HTTP: ',
  GENERIC_ERROR: 'Si è verificato un errore: '
};

// Utility Functions
export function getPropertyCaseInsensitive(obj, keyToFind) {
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

// Error Handling
export function handleError(error, element, customMessage = '') {
  console.error(error);
  if (element) {
    const message = customMessage || ERROR_MESSAGES.GENERIC_ERROR + error.message;
    element.innerHTML = `<div style="text-align: center; color: #FF6B6B;">${message}</div>`;
    element.style.display = 'flex';
  }
}

// DOM Element Validation
export function validateElements(elements) {
  const missingElements = Object.entries(elements)
    .filter(([_, element]) => !element)
    .map(([name]) => name);

  if (missingElements.length > 0) {
    console.error(`Missing elements: ${missingElements.join(', ')}`);
    return false;
  }
  return true;
} 