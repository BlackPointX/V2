    document.addEventListener('DOMContentLoaded', async () => {
        const matchesContainer = document.getElementById('matches-container');

        // Funkcja do ładowania wszystkich danych z sessionStorage
        function loadAllData() {
            const cachedData = sessionStorage.getItem('allApiData');
            if (cachedData) {
                return JSON.parse(cachedData);
            } else {
                console.error("Nie znaleziono danych w cache. Upewnij się, że strona główna została załadowana jako pierwsza.");
                return null;
            }
        }

        // Funkcja sprawdzająca, czy wyniki gracza są w porządku
        function checkPlayerResults(results, playerName) {
            const playerIndex = results[0].indexOf(playerName);
            for (let i = 1; i < results.length; i++) {
                if (results[i][playerIndex] === 'n\\o') {
                    return false;
                }
            }
            return true;
        }

        async function createPlayerAvatars() {
            const allData = loadAllData();
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
                betLigaLink.href = 'https://forms.gle/DvzSj17dyeqaTWd9A';
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
                lmLink.href = 'https://forms.gle/W3wknHF7jaefrj5H9';
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
