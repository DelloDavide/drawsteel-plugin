import "./style.css";
import OBR from "@owlbear-rodeo/sdk";
import { getAbility, getUserAbilities, getUsers, getFiles, setChoosenFile, getStoredAbility } from "./abilities";
import { setMetadataPopover, openClosePopover } from "./popover";

let abilitiesFileSelect;
let searchAbilitiesFileButton;
let usersNameSelect;
let abilityNamesSelect;
let searchButton;
let searchUserAbilityButton;
let windowSearchButton;
let abilityCard;
let abilityCardSidebar;
let sidebarUserId;

async function resetSavedAbilities() {
  try {
    const metadata = await OBR.room.getMetadata();
    const players = await OBR.party.getPlayers();
    
    // Reset savedAbilities only if there's one player in the room
    if (players.length < 1) {
      await OBR.room.setMetadata({
        ...metadata,
        savedAbilities: []
      });
    }
  } catch (err) {
    console.error("Errore durante il reset dei metadati:", err);
  }
}

async function initializeApp() {
  // Reset saved abilities when app starts
  await resetSavedAbilities();

  document.querySelector("#app").innerHTML = `
    <div class="app-container">
      <div class="sidebar-overlay"></div>
      <button id="sidebarToggle" class="sidebar-toggle" title="Apri/Chiudi Sidebar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 18l6-6-6-6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="sidebar">
        <div class="sidebar-content">
          <h3>Storico Abilità Condivise</h3>
          <div id="savedAbilities" class="saved-abilities"></div>
          <h3 id="sidebarUserId"></h3>
          <div class="page-center">
            <div id="abilityCardSidebar"></div>
          </div>
        </div>
      </div>
      <div class="main-content">
        <div>
          <img src="./owl.svg" alt="Owl Icon" />
          <h2>Manuale del Giocatore Draw Steel</h2>
          <div class="page-center">
            <div class="custom-select-wrapper">
              <select id="abilitiesFileSelect">
                <option value="" disabled selected hidden>Cerca Campagna</option>
              </select>
              <div class="custom-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10l5 5 5-5" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <button id="searchAbilitiesFileButton" title="Cerca Abilità">Scegli Campagna</button><br>
          </div>
          <div class="page-center">
            <div class="custom-select-wrapper">
              <select id="usersNameSelect">
                <option value="" disabled selected hidden>Nome Categoria</option>
              </select>
              <div class="custom-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10l5 5 5-5" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <button id="searchUserAbilityButton" title="Cerca Abilità">Cerca Abilità</button><br>
          </div>
          <div class="page-center">
            <div class="custom-select-wrapper">
              <select id="abilityNamesSelect">
                <option value="" disabled selected hidden>Nome Azione</option>
              </select>
              <div class="custom-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 10l5 5 5-5" stroke="#ccc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
          <div class="page-center">
            <button id="searchButton" title="Vedi Abilità - Locale">Vedi Abilità - Locale</button><br>
            <button id="windowSearchButton" title="Mostra Abilità - Condividi">Mostra Abilità - Condividi</button><br>
          </div>
          <div class="page-center">
            <div id="abilityCard"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  abilitiesFileSelect = document.getElementById('abilitiesFileSelect');
  searchAbilitiesFileButton = document.getElementById('searchAbilitiesFileButton');
  usersNameSelect = document.getElementById('usersNameSelect');
  abilityNamesSelect = document.getElementById('abilityNamesSelect');
  searchButton = document.getElementById('searchButton');
  searchUserAbilityButton = document.getElementById('searchUserAbilityButton');
  windowSearchButton = document.getElementById('windowSearchButton');
  abilityCard = document.getElementById('abilityCard');
  abilityCardSidebar = document.getElementById('abilityCardSidebar');
  sidebarUserId = document.getElementById('sidebarUserId');

  abilityCard.style.display = "none";
  abilityCardSidebar.style.display = "none";

  if (abilitiesFileSelect) {
    await getFiles(abilitiesFileSelect)
    setChoosenFile(abilitiesFileSelect.value);
  } else {
    console.warn("abilitiesFileSelect element not found for abilitiesFileSelect.");
  }

  if (searchAbilitiesFileButton) {
    searchAbilitiesFileButton.addEventListener('click', async () => {
      setChoosenFile(abilitiesFileSelect.value);
      await getUsers(usersNameSelect, abilityNamesSelect, abilityCard);
    });
  } else {
    console.error("#searchAbilitiesFileButton element not found.");
  }

  if (usersNameSelect) {
    await getUsers(usersNameSelect, abilityNamesSelect, abilityCard)
    await getUserAbilities(usersNameSelect, abilityNamesSelect, abilityCard);
  } else {
    console.warn("usersNameSelect element not found for usersNameSelect.");
  }

  if (searchUserAbilityButton) {
    searchUserAbilityButton.addEventListener('click', async () => {
      await getUserAbilities(usersNameSelect, abilityNamesSelect, abilityCard);
    });
  } else {
    console.error("#searchUserAbilityButton element not found.");
  }

  if (searchButton) {
    searchButton.addEventListener('click', async () => {
      await getAbility(usersNameSelect.value, abilityNamesSelect.value, abilityCard);
    });
  } else {
    console.error("#searchButton element not found.");
  }

  if (windowSearchButton) {
    await setMetadataPopover();
    windowSearchButton.addEventListener('click', async () => {
      windowSearchButton.disabled = true;
      windowSearchButton.classList.add('loading');

      try {
        await openClosePopover(usersNameSelect.value, abilityNamesSelect.value, abilitiesFileSelect.value);

        // Get current saved abilities from metadata
        const metadata = await OBR.room.getMetadata();
        const savedAbilities = metadata.savedAbilities || [];

        // Create new ability object
        const newAbility = {
          campaign: abilitiesFileSelect.value,
          category: usersNameSelect.value,
          ability: abilityNamesSelect.value,
          timestamp: Date.now()
        };

        // Add new ability to array if it doesn't exist
        if (!savedAbilities.some(ability =>
          ability.campaign === newAbility.campaign &&
          ability.category === newAbility.category &&
          ability.ability === newAbility.ability &&
          newAbility.timestamp - ability.timestamp < 2000
        )) {
          savedAbilities.push(newAbility);

          // Update metadata
          await OBR.room.setMetadata({
            ...metadata,
            savedAbilities
          });
        }
      } catch (err) {
        console.error("Errore durante openClosePopover:", err);
      }

      windowSearchButton.disabled = false;
      windowSearchButton.classList.remove('loading');
    });
  } else {
    console.error("#windowSearchButton element not found.");
  }

  // Listen for metadata changes
  OBR.room.onMetadataChange(async (metadata) => {
    const savedAbilities = metadata.savedAbilities || [];
    const savedAbilitiesContainer = document.getElementById('savedAbilities');

    // Clear existing buttons
    savedAbilitiesContainer.innerHTML = '';

    // Create buttons for each saved ability
    for (const ability of savedAbilities) {
      const button = document.createElement('button');
      button.className = 'saved-ability-button';

      const categoryTitle = ability.category
      const abilityTitle = ability.ability
      const abilityTimestamp = epochToTime(ability.timestamp)
      const title = `${categoryTitle} - ${abilityTitle} - ${abilityTimestamp}`;

      button.textContent = title;
      button.title = `${ability.campaign} - ${ability.category} - ${ability.ability}`;

      button.dataset.campaign = ability.campaign;
      button.dataset.category = ability.category;
      button.dataset.ability = ability.ability;

      button.addEventListener('click', async () => {
        sidebarUserId.innerHTML = categoryTitle;

        await getStoredAbility(
          button.dataset.campaign,
          button.dataset.category,
          button.dataset.ability,
          abilityCardSidebar
        );
      });

      savedAbilitiesContainer.appendChild(button);
    }
  });

  // Add sidebar toggle functionality
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarToggle.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    overlay.addEventListener('click', () => {
      if (sidebar.classList.contains('active')) {
        toggleSidebar();
      }
    });

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('active')) {
        toggleSidebar();
      }
    });
  }

  function epochToTime(epochMillis) {
  const date = new Date(epochMillis);
  return date.toLocaleTimeString('it-IT', { hour12: false });
}
}

OBR.onReady(() => {
  console.log("Owlbear Rodeo SDK is available");
  initializeApp();
});
