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

    // Funkcja pokazująca loader
    function showLoader() {
        loader.style.display = 'flex';
    }

    // Funkcja ukrywająca loader
    function hideLoader() {
        loader.style.display = 'none';
    }

    // Funkcja pobierająca dane z Google Sheets dla pierwszej tabeli
    async function fetchFirstTableData() {
        const apiUrl = 'https://script.google.com/macros/s/AKfycbzKHTwb1o2HzhOS6_OY9M_PRm1jSpEgfb-OIzZ8jVMEmyt9RSU8kx407lCImbMzVCUYNA/exec';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania danych');
            }
            const data = await response.json();
            return data.WWW; // Zwracamy dane zawodników
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        }
    }

    // Funkcja pobierająca dane z Google Sheets dla drugiej tabeli
    async function fetchSecondTableData() {
        const apiUrl = 'https://script.google.com/macros/s/AKfycbyr4gVCSGs93yIMMd1ogqiR-EOL7sAgMIgf4izRBce_zJIUSwT1ZyaTo6yvS0M8xy8MTg/exec';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania danych');
            }
            const data = await response.json();
            return data.WWW; // Zwracamy dane zawodników
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        }
    }

    // Funkcja renderująca dane zawodników do tabeli w zaawansowany sposób
    function renderPlayerData(players, tableBody) {
        players.slice(1).forEach((player, index) => { // Pomijamy nagłówek
            const row = document.createElement('tr');
            const avatarUrl = getPlayerAvatar(player[2]);
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
                        <img src="${avatarUrl}" alt="${player[2]}" class="player-avatar">
                        <span>${player[2]}</span>
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
            tableBody.appendChild(row);
        });
    }

    // Funkcja zwracająca kolor zmiany pozycji
    function getPositionChangeColor(change) {
        if (change.startsWith('+')) {
            return 'green';
        } else if (change.startsWith('-')) {
            return 'red';
        } else {
            return 'gray';
        }
    }

    // Funkcja zwracająca symbol zmiany pozycji
    function getPositionChangeSymbol(change) {
        if (change.startsWith('+')) {
            return '↑';
        } else if (change.startsWith('-')) {
            return '↓';
        } else {
            return '↔';
        }
    }

    // Funkcja zwracająca avatar zawodnika na podstawie jego imienia
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
                return 'https://via.placeholder.com/32'; // Domyślny avatar, jeśli nie znaleziono
        }
    }

    // Pokaż loader na początku
    showLoader();

    // Pobieranie i renderowanie danych dla obu tabel
    const firstTableData = await fetchFirstTableData();
    if (firstTableData) {
        renderPlayerData(firstTableData, firstTableBody);
    }

    const secondTableData = await fetchSecondTableData();
    if (secondTableData) {
        renderPlayerData(secondTableData, secondTableBody);
    }

    // Ukryj loader po załadowaniu danych
    hideLoader();
});
