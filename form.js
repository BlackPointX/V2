document.addEventListener('DOMContentLoaded', async () => {
    const matchesContainer = document.getElementById('matches-container');

    // Funkcja pobierająca wszystkie dane z API, jeśli nie są w sessionStorage
    async function fetchAllData() {
        const cacheDuration = 2 * 60 * 1000; // Cache data for 5 minutes
        const cachedData = sessionStorage.getItem('allApiData');
        const cachedTime = sessionStorage.getItem('allApiDataTimestamp');
    
        // Check if cached data exists and is still valid
        if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10)) < cacheDuration) {
            return JSON.parse(cachedData);
        }
    
        // If data is missing or expired, fetch new data from the API
        try {
            const [firstTableResponse, secondTableResponse, matchesResponse, lmResponse] = await Promise.all([
                fetch('https://script.google.com/macros/s/AKfycbzKHTwb1o2HzhOS6_OY9M_PRm1jSpEgfb-OIzZ8jVMEmyt9RSU8kx407lCImbMzVCUYNA/exec'),
                fetch('https://script.google.com/macros/s/AKfycbyr4gVCSGs93yIMMd1ogqiR-EOL7sAgMIgf4izRBce_zJIUSwT1ZyaTo6yvS0M8xy8MTg/exec'),
                fetch('https://script.google.com/macros/s/AKfycbxPKj0TKn1XMYUdf6C7JNZWrqgl6T8sT4LON9bq0lcDHDHuFda3yPd20PgDkfakvCumEg/exec?page=Komplet'),
                fetch('https://script.google.com/macros/s/AKfycbwJW9UnKuZ3dD-YH2GLfE0Py6vqLR9Z787V8QHatbXdzYtmmkw5NelfKWYbq4X-30xqDw/exec?page=Komplet')
            ]);
    
            const [firstTableData, secondTableData, matchesData, lmData] = await Promise.all([
                firstTableResponse.json(),
                secondTableResponse.json(),
                matchesResponse.json(),
                lmResponse.json()
            ]);
    
            const allData = {
                firstTable: { players: firstTableData.WWW, matches: firstTableData.Wyniki.slice(1) },
                secondTable: { players: secondTableData.WWW, matches: secondTableData.Wyniki.slice(1) },
                BetLiga: matchesData.Komplet.slice(1),
                LigaMistrzow: lmData.Komplet.slice(1)
            };
    
            // Store data and timestamp in sessionStorage
            sessionStorage.setItem('allApiData', JSON.stringify(allData));
            sessionStorage.setItem('allApiDataTimestamp', Date.now().toString());
    
            return allData;
        } catch (error) {
            console.error('Error fetching all data:', error);
            return null;
        }
    }

    // Funkcja ładująca dane z sessionStorage lub z API
    async function loadAllData() {
        const allData = await fetchAllData();
        if (allData) {
            return allData;
        }
        return null;
    }

    // Funkcja sprawdzająca wyniki gracza
    function checkPlayerResults(results, playerName) {
        // Mapowanie nazw graczy na ich indeksy w tabeli wyników
        const playerIndexes = {
            'Mariusz': 0,
            'Łukasz': 1,
            'Mateusz': 2,
            'Patryk': 3
        };
    
        // Pobierz indeks dla danego gracza
        const playerIndex = playerIndexes[playerName];
    
        // Jeśli gracza nie ma w mapowaniu, zwróć false
        if (playerIndex === undefined) return false;
    
        // Sprawdź każdy wynik gracza, aby upewnić się, że żaden nie jest "n\\o"
        for (let i = 1; i < results.length; i++) {
            const playerResult = results[i][playerIndex];
            
            // Jeśli wynik to dokładnie "n\\o", zwróć false
            if (playerResult === 'n\\o') {
                return false;
            }
        }
        return true;
    }
    
    
    


    
    // Funkcja tworząca awatary graczy i ich statusy
    async function createPlayerAvatars() {
        const allData = await loadAllData();
        if (!allData) return;

        const betLigaResults = allData.firstTable.matches;
        const lmResults = allData.secondTable.matches;

        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('avatar-container');

        const players = [
            { name: 'Mariusz', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mariusz.png' },
            { name: 'Łukasz', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/%C5%81ukasz.png' },
            { name: 'Mateusz', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mateusz.png' },
            { name: 'Patryk', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Patryk.png' }
        ];

        players.forEach(player => {
            const playerElement = document.createElement('div');
            playerElement.classList.add('player-element');

            const avatar = document.createElement('img');
            avatar.src = player.avatar;
            avatar.alt = `${player.name} Avatar`;
            avatar.classList.add('avatar-small-form');
            playerElement.appendChild(avatar);

            const linksContainer = document.createElement('div');
            linksContainer.classList.add('links-container');

            // BetLiga Link and Status
            const betLigaRow = document.createElement('div');
            betLigaRow.classList.add('row');

            const betLigaLink = document.createElement('a');
            betLigaLink.href = 'https://forms.gle/gTSR5Z2E5khiDCkE7';
            betLigaLink.textContent = 'Formularz BetLiga';
            betLigaLink.classList.add('link');
            betLigaRow.appendChild(betLigaLink);

            const betLigaStatus = document.createElement('span');
            const isBetLigaFilled = checkPlayerResults(betLigaResults, player.name);
            betLigaStatus.innerHTML = isBetLigaFilled ? '✅' : '❌';
            betLigaStatus.classList.add(isBetLigaFilled ? 'status-green' : 'status-red');
            betLigaRow.appendChild(betLigaStatus);

            // LM Link and Status
            const lmRow = document.createElement('div');
            lmRow.classList.add('row');

            const lmLink = document.createElement('a');
            lmLink.href = 'https://forms.gle/seRUjgPk7dctbrW37';
            lmLink.textContent = 'Formularz LM';
            lmLink.classList.add('link');
            lmRow.appendChild(lmLink);

            const lmStatus = document.createElement('span');
            const isLMFilled = checkPlayerResults(lmResults, player.name);
            lmStatus.innerHTML = isLMFilled ? '✅' : '❌';
            lmStatus.classList.add(isLMFilled ? 'status-green' : 'status-red');
            lmRow.appendChild(lmStatus);

            linksContainer.appendChild(betLigaRow);
            linksContainer.appendChild(lmRow);

            playerElement.appendChild(linksContainer);
            avatarContainer.appendChild(playerElement);
        });

        matchesContainer.appendChild(avatarContainer);
    }

    createPlayerAvatars();
});
