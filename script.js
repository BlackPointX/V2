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

    function showLoader() {
        loader.style.display = 'flex';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }

    async function fetchFirstTableData() {
        const apiUrl = 'https://script.google.com/macros/s/AKfycbzKHTwb1o2HzhOS6_OY9M_PRm1jSpEgfb-OIzZ8jVMEmyt9RSU8kx407lCImbMzVCUYNA/exec';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania danych');
            }
            const data = await response.json();
            return data.WWW;
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        }
    }

    async function fetchSecondTableData() {
        const apiUrl = 'https://script.google.com/macros/s/AKfycbyr4gVCSGs93yIMMd1ogqiR-EOL7sAgMIgf4izRBce_zJIUSwT1ZyaTo6yvS0M8xy8MTg/exec';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Błąd podczas pobierania danych');
            }
            const data = await response.json();
            return data.WWW;
        } catch (error) {
            console.error('Błąd podczas pobierania danych:', error);
            return null;
        }
    }

    function renderPlayerData(players, tableBody) {
        players.slice(1).forEach((player, index) => {
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

            const detailsRow = document.createElement('tr');
            detailsRow.classList.add('details-row');
            detailsRow.style.display = 'none';
            detailsRow.innerHTML = `
                <td colspan="6">
                    <div class="match-results">${generateRandomMatchResults()}</div>
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

    function generateRandomMatchResults() {
        const clubs = [
           'https://www.thesportsdb.com/images/media/team/badge/zsva1p1626103599.png/tiny', // Sample logo 1
            'https://www.thesportsdb.com/images/media/team/badge/zsva1p1626103599.png/tiny', // Sample logo 2
            'https://www.thesportsdb.com/images/media/team/badge/zsva1p1626103599.png/tiny', // Sample logo 3
            'https://www.thesportsdb.com/images/media/team/badge/zsva1p1626103599.png/tiny'  // Sample logo 4
        ];
        let results = '<div class="match-grid">';
        for (let i = 0; i < 18; i++) {
            const club1 = clubs[Math.floor(Math.random() * clubs.length)];
            const club2 = clubs[Math.floor(Math.random() * clubs.length)];
            const score1 = Math.floor(Math.random() * 5);
            const score2 = Math.floor(Math.random() * 5);
            results += `
                <div class="match-result">
                    <img src="${club1}" alt="Logo 1" class="club-logo">
                    <span>${score1}:${score2}</span>
                    <img src="${club2}" alt="Logo 2" class="club-logo">
                </div>
            `;
        }
        results += '</div>';
        return results;
    }

    showLoader();

    const firstTableData = await fetchFirstTableData();
    if (firstTableData) {
        renderPlayerData(firstTableData, firstTableBody);
    }

    const secondTableData = await fetchSecondTableData();
    if (secondTableData) {
        renderPlayerData(secondTableData, secondTableBody);
    }

    hideLoader();
});
