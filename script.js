document.addEventListener('DOMContentLoaded', async () => {
    const firstTableBody = document.getElementById('first-table-body');
    const secondTableBody = document.getElementById('second-table-body');
    const loader = document.getElementById('loading-spinner');

    if (!firstTableBody || !secondTableBody || !loader) {
        if (!firstTableBody) {
            console.error('Nie znaleziono elementu firstTableBody. Upewnij się, że element o id "first-table-body" istnieje w HTML.');
        }
        if (!secondTableBody) {
            console.error('Nie znaleziono elementu secondTableBody. Upewnij się, że element o id "loading-spinner" istnieje w HTML.');
        }
        return;
    }

    const avatars = [
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mariusz.png',
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/%C5%81ukasz.png',
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mateusz.png',
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Patryk.png'
    ];

    const playerIndexMapping = {
        'Mariusz': 0,
        'Łukasz': 1,
        'Mateusz': 2,
        'Patryk': 3
    };

    function showLoader() {
        loader.style.display = 'flex';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    // Funkcja pobierająca wszystkie dane z API, jeśli nie są jeszcze w sessionStorage
    async function fetchAllData() {
        const cachedData = sessionStorage.getItem('allApiData');
        if (cachedData) {
            return JSON.parse(cachedData);
        }

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

            sessionStorage.setItem('allApiData', JSON.stringify(allData));
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

    function renderPlayerData(players, matches, tableBody) {
        players.slice(1).forEach((player) => {
            const playerName = player[2];
            const playerIndex = playerIndexMapping[playerName];
            const row = document.createElement('tr');
            const avatarUrl = getPlayerAvatar(playerName);
            row.innerHTML = `
                <td>
                    <div class="position-cell">
                        <div style="display: flex; align-items: center; white-space: nowrap;">
                            <span class="position-number">${player[0]}</span>
                            <span class="position-change" style="color: ${getPositionChangeColor(String(player[1]))}">${player[1]}</span>
                        </div>
                        <div class="position-symbol">${getPositionChangeSymbol(String(player[1]))}</div>
                    </div>
                </td>
                <td>
                    <div class="name-cell">
                        <img src="${avatarUrl}" alt="${playerName}" class="player-avatar">
                        <span>${playerName}</span>
                    </div>
                </td>
                <td>${player[3]}</td>
                <td>${player[4]}</td>
                <td><span class="difference">${player[5]}</span></td>
                <td>
                    <div class="points-cell">
                        <span class="points-number">${player[7]}</span>
                        <span class="points-change">${player[8]}</span>
                    </div>
                </td>
            `;

            const detailsRow = document.createElement('tr');
            detailsRow.classList.add('details-row');
            detailsRow.style.display = 'none';
            detailsRow.innerHTML = `
                <td colspan="6">
                    <div class="match-results">${generateMatchResults(matches, playerIndex)}</div>
                </td>
            `;

            row.addEventListener('click', () => {
                detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
            });

            tableBody.appendChild(row);
            tableBody.appendChild(detailsRow);
        });
    }

    function getPositionChangeColor(change) {
        const numericChange = parseInt(change, 10);
        if (numericChange > 0) {
            return 'filter: invert(51%) sepia(92%) saturate(355%) hue-rotate(63deg) brightness(94%) contrast(101%);';
        } else if (numericChange < 0) {
            return 'filter: invert(19%) sepia(87%) saturate(7498%) hue-rotate(346deg) brightness(100%) contrast(112%);';
        } else {
            return 'filter: invert(63%) sepia(90%) saturate(1509%) hue-rotate(8deg) brightness(100%) contrast(107%);';
        }
    }

    function getPositionChangeSymbol(change) {
        const colorStyle = getPositionChangeColor(change);
        if (change > 0) {
            return `<img src="https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/up_icon.svg" alt="Up" style="${colorStyle} vertical-align: middle; width: 25px;">`;
        } else if (change < 0) {
            return `<img src="https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/down.svg" alt="Down" style="${colorStyle} vertical-align: middle; width: 25px;">`;
        } else {
            return `<img src="https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/equal.svg" alt="Equal" style="${colorStyle} vertical-align: middle; width: 20px;">`;
        }
    }

    function getPlayerAvatar(playerName) {
        switch (playerName) {
            case 'Mariusz':
                return avatars[0];
            case 'Łukasz':
                return avatars[1];
            case 'Mateusz':
                return avatars[2];
            case 'Patryk':
                return avatars[3];
            default:
                return 'https://via.placeholder.com/32';
        }
    }

    function generateMatchResults(matches, playerIndex) {
        let results = '<div class="match-grid">';
        matches.forEach(match => {
            const playerScoreData = match[playerIndex];
            const playerScore = playerScoreData.split('/')[0];
            const suffix = playerScoreData.split('/')[1];
            let backgroundColor;
            let borderClass = '';
            switch (suffix) {
                case 'y':
                    backgroundColor = '#a79907';
                    break;
                case 'yl':
                    borderClass = 'blinking-border-yellow';
                    break;
                case 'r':
                    backgroundColor = '#a10808';
                    break;
                case 'rl':
                    borderClass = 'blinking-border-red';
                    break;
                case 'g':
                    backgroundColor = '#057c05';
                    break;
                case 'gl':
                    borderClass = 'blinking-border-green';
                    break;
                default:
                    backgroundColor = 'rgba(200, 200, 200, 0.8)';
            }
            results += `
                <div class="match-result ${borderClass}" style="background-color: ${backgroundColor};">
                    <img src="${match[4]}" alt="Logo 1" class="club-logo">
                    <span>${playerScore}</span>
                    <img src="${match[5]}" alt="Logo 2" class="club-logo">
                </div>
            `;
        });
        results += '</div>';
        return results;
    }

    showLoader();

    const allData = await loadAllData();
    if (allData) {
        renderPlayerData(allData.firstTable.players, allData.firstTable.matches, firstTableBody);
        renderPlayerData(allData.secondTable.players, allData.secondTable.matches, secondTableBody);
    }

    hideLoader();
});
