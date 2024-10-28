document.addEventListener('DOMContentLoaded', async () => {
    const matchesContainer = document.getElementById('matches-container');

    // Fetch data from the first API for BetLiga
    async function fetchBetLigaResults() {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbzKHTwb1o2HzhOS6_OY9M_PRm1jSpEgfb-OIzZ8jVMEmyt9RSU8kx407lCImbMzVCUYNA/exec');
            const data = await response.json();
            return data.Wyniki;
        } catch (error) {
            console.error("Error fetching BetLiga data:", error);
            return null;
        }
    }

    // Fetch data from the second API for LM
    async function fetchLMResults() {
        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbyr4gVCSGs93yIMMd1ogqiR-EOL7sAgMIgf4izRBce_zJIUSwT1ZyaTo6yvS0M8xy8MTg/exec');
            const data = await response.json();
            return data.Wyniki;
        } catch (error) {
            console.error("Error fetching LM data:", error);
            return null;
        }
    }

    // Check if any results for a player contain "n\o"
    function checkPlayerResults(results, playerName) {
        const playerIndex = results[0].indexOf(playerName);
        for (let i = 1; i < results.length; i++) {
            if (results[i][playerIndex] === 'n\\o') {
                return false; // Red cross if any result is "n\o"
            }
        }
        return true; // Green check if all results are okay
    }

    async function createPlayerAvatars() {
        const betLigaResults = await fetchBetLigaResults();
        const lmResults = await fetchLMResults();
        
        if (!betLigaResults || !lmResults) return;

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

            // Avatar Image
            const avatar = document.createElement('img');
            avatar.src = player.avatar;
            avatar.alt = `${player.name} Avatar`;
            avatar.classList.add('avatar-small-form');
            playerElement.appendChild(avatar);

            // Links and statuses
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

            // Determine BetLiga Status
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

            // Determine LM Status
            const lmStatus = document.createElement('span');
            const isLMFilled = checkPlayerResults(lmResults, player.name);
            lmStatus.innerHTML = isLMFilled ? '✅' : '❌';
            lmStatus.classList.add(isLMFilled ? 'status-green' : 'status-red');
            lmRow.appendChild(lmStatus);

            // Append rows to linksContainer
            linksContainer.appendChild(betLigaRow);
            linksContainer.appendChild(lmRow);

            // Append linksContainer to playerElement
            playerElement.appendChild(linksContainer);
            avatarContainer.appendChild(playerElement);
        });

        matchesContainer.appendChild(avatarContainer);
    }

    createPlayerAvatars();
});
