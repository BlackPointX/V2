document.addEventListener('DOMContentLoaded', () => {
    const matchesContainer = document.getElementById('matches-container');

    function createPlayerAvatars() {
        const avatarContainer = document.createElement('div');
        avatarContainer.style.display = 'flex';
        avatarContainer.style.flexDirection = 'column';
        avatarContainer.style.gap = '15px';
        avatarContainer.style.marginTop = '20px';

        const players = [
            { name: 'Mariusz', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mariusz.png', betLigaFilled: true, lmFilled: false },
            { name: 'Łukasz', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/%C5%81ukasz.png', betLigaFilled: true, lmFilled: false },
            { name: 'Mateusz', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mateusz.png', betLigaFilled: true, lmFilled: false },
            { name: 'Patryk', avatar: 'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Patryk.png', betLigaFilled: true, lmFilled: false }
        ];

        players.forEach(player => {
            const playerElement = document.createElement('div');
            playerElement.style.display = 'flex';
            playerElement.style.alignItems = 'center';
            playerElement.style.gap = '10px';
            playerElement.style.padding = '10px';
            playerElement.style.backgroundColor = '#1A252F';
            playerElement.style.borderRadius = '8px';

            // Avatar Image
            const avatar = document.createElement('img');
            avatar.src = player.avatar;
            avatar.alt = `${player.name} Avatar`;
            avatar.classList.add('avatar-small');
            avatar.style.width = '50px';  // Increase avatar size
            avatar.style.height = '50px';
            playerElement.appendChild(avatar);

            // Links and statuses
            const linksContainer = document.createElement('div');
            linksContainer.style.display = 'flex';
            linksContainer.style.flexDirection = 'column';
            linksContainer.style.gap = '5px';

            // BetLiga Link and Status
            const betLigaRow = document.createElement('div');
            betLigaRow.style.display = 'flex';
            betLigaRow.style.alignItems = 'center';

            const betLigaLink = document.createElement('a');
            betLigaLink.href = '#';
            betLigaLink.textContent = 'Formularz BetLiga';
            betLigaLink.style.color = '#3498DB';
            betLigaLink.style.textDecoration = 'none';
            betLigaRow.appendChild(betLigaLink);

            const betLigaStatus = document.createElement('span');
            betLigaStatus.innerHTML = player.betLigaFilled ? '✅' : '❌';
            betLigaStatus.style.marginLeft = '10px';
            betLigaRow.appendChild(betLigaStatus);

            // LM Link and Status
            const lmRow = document.createElement('div');
            lmRow.style.display = 'flex';
            lmRow.style.alignItems = 'center';

            const lmLink = document.createElement('a');
            lmLink.href = '#';
            lmLink.textContent = 'Formularz LM';
            lmLink.style.color = '#3498DB';
            lmLink.style.textDecoration = 'none';
            lmRow.appendChild(lmLink);

            const lmStatus = document.createElement('span');
            lmStatus.innerHTML = player.lmFilled ? '✅' : '❌';
            lmStatus.style.marginLeft = '10px';
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
