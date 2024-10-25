document.addEventListener('DOMContentLoaded', async () => {
    const firstTableBody = document.getElementById('first-table-body');
    const secondTableBody = document.getElementById('second-table-body');
    const loader = document.getElementById('loading-spinner');

    if (!firstTableBody || !secondTableBody || !loader) {
        if (!firstTableBody) {
            console.error('Nie znaleziono elementu firstTableBody. Upewnij się, że element o id "first-table-body" istnieje w HTML.');
        }
        if (!secondTableBody) {
            console.error('Nie znaleziono elementu secondTableBody. Upewnij się, że element o id "second-table-body" istnieje w HTML.');
        }
        if (!loader) {
            console.error('Nie znaleziono elementu loader. Upewnij się, że element o id "loading-spinner" istnieje w HTML.');
        }
        return;
    }

    const avatars = [
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mariusz.png',
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/%C5%81ukasz.png',
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mateusz.png',
        'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Patryk.png'
    ];

    // Static mapping of players to their result columns in `Wyniki`
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

    async function fetchTableData(apiUrl) {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania danych');
            }
            const data = await response.json();
            return { players: data.WWW, matches: data.Wyniki.slice(1) }; // Skip header row in matches
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        }
    }

    function renderPlayerData(players, matches, tableBody) {
        players.slice(1).forEach((player) => {
            const playerName = player[2]; // Extract player name
            const playerIndex = playerIndexMapping[playerName]; // Use the static index mapping

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
        return change.startsWith('+') ? 'green' : change.startsWith('-') ? 'red' : 'gray';
    }

    function getPositionChangeSymbol(change) {
        return change.startsWith('+') ? '↑' : change.startsWith('-') ? '↓' : '↔';
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
            const playerScore = playerScoreData.split('/')[0]; // Extract score before suffix
            const suffix = playerScoreData.split('/')[1]; // Extract suffix for color

            // Determine background color based on suffix
            let backgroundColor;
            switch (suffix) {
                case 'y':
                    backgroundColor = 'rgba(255, 255, 0, 0.8)'; // Yellow, 80% opacity
                    break;
                case 'r':
                    backgroundColor = 'rgba(255, 0, 0, 0.8)'; // Red, 80% opacity
                    break;
                case 'g':
                    backgroundColor = 'rgba(0, 255, 0, 0.8)'; // Green, 80% opacity
                    break;
                default:
                    backgroundColor = 'rgba(200, 200, 200, 0.8)'; // Default gray, 80% opacity
            }

            results += `
                <div class="match-result" style="background-color: ${backgroundColor};">
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

    const firstTableData = await fetchTableData('https://script.google.com/macros/s/AKfycbzKHTwb1o2HzhOS6_OY9M_PRm1jSpEgfb-OIzZ8jVMEmyt9RSU8kx407lCImbMzVCUYNA/exec');
    if (firstTableData) {
        renderPlayerData(firstTableData.players, firstTableData.matches, firstTableBody);
    }

    const secondTableData = await fetchTableData('https://script.google.com/macros/s/AKfycbyr4gVCSGs93yIMMd1ogqiR-EOL7sAgMIgf4izRBce_zJIUSwT1ZyaTo6yvS0M8xy8MTg/exec');
    if (secondTableData) {
        renderPlayerData(secondTableData.players, secondTableData.matches, secondTableBody);
    }

    hideLoader();
});
