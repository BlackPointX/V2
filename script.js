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

 // Funkcja zwracająca kolor w zależności od wartości zmiany
function getPositionChangeColor(change) {
    const numericChange = parseInt(change, 10); // Konwersja wartości na liczbę
    if (numericChange > 0) {
        return 'filter: invert(51%) sepia(92%) saturate(355%) hue-rotate(63deg) brightness(94%) contrast(101%);'; // Zielony
    } else if (numericChange < 0) {
        return 'filter: invert(19%) sepia(87%) saturate(7498%) hue-rotate(346deg) brightness(100%) contrast(112%);'; // Czerwony
    } else {
        return 'filter: invert(63%) sepia(90%) saturate(1509%) hue-rotate(8deg) brightness(100%) contrast(107%);'; // Szary
    }
}

// Funkcja zwracająca symbol z odpowiednią ikoną i stylem koloru
function getPositionChangeSymbol(change) {
    const colorStyle = getPositionChangeColor(change); // Pobieranie stylu koloru
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
            const playerScore = playerScoreData.split('/')[0]; // Wyciąganie wyniku przed sufiksem
            const suffix = playerScoreData.split('/')[1]; // Wyciąganie sufiksu dla koloru
    
            // Określenie koloru tła na podstawie sufiksu
            let backgroundColor;
            let borderClass = ''; // Domyślnie brak klasy ramki
    
            switch (suffix) {
                case 'y':
                    backgroundColor = '#a79907'; // Żółty, 80% przejrzystości
                    break;
                case 'yl':
                    borderClass = 'blinking-border-yellow'; // Żółta mrugająca ramka
                    break;
                case 'r':
                    backgroundColor = '#a10808'; // Czerwony, 80% przejrzystości
                    break;
                case 'rl':
                    borderClass = 'blinking-border-red'; // Czerwona mrugająca ramka
                    break;
                case 'g':
                    backgroundColor = '#057c05'; // Zielony, 80% przejrzystości
                    break;
                case 'gl':
                    borderClass = 'blinking-border-green'; // Zielona mrugająca ramka
                    break;
                default:
                    backgroundColor = 'rgba(200, 200, 200, 0.8)'; // Domyślny szary, 80% przejrzystości
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