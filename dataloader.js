// dataLoader.js

export const avatars = [
    'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mariusz.png',
    'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/%C5%81ukasz.png',
    'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Mateusz.png',
    'https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/Patryk.png'
];

export const playerIndexMapping = {
    'Mariusz': 0,
    'Łukasz': 1,
    'Mateusz': 2,
    'Patryk': 3
};

export function showLoader(loader) {
    loader.style.display = 'flex';
}

export function hideLoader(loader) {
    loader.style.display = 'none';
}

export async function fetchAllData() {
    const cacheDuration = 5 * 60 * 1000;
    const cachedData = sessionStorage.getItem('allApiData');
    const cachedTime = sessionStorage.getItem('allApiDataTimestamp');

    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime, 10)) < cacheDuration) {
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
        sessionStorage.setItem('allApiDataTimestamp', Date.now().toString());

        return allData;
    } catch (error) {
        console.error('Error fetching all data:', error);
        return null;
    }
}

export async function loadAllData() {
    return await fetchAllData() || null;
}

export function renderPlayerData(players, matches, tableBody, tableType) {
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

        detailsRow.querySelectorAll('.match-result').forEach(match => {
            match.addEventListener('click', function () {
                const matchIndex = parseInt(this.getAttribute('data-match-index'), 10);
                openMatchModal(this, tableType === 'firstTable' ? matches : allData.secondTable.matches, matchIndex);
            });
        });
    });
}

export function getPositionChangeColor(change) {
    const numericChange = parseInt(change, 10);
    if (numericChange > 0) {
        return 'filter: invert(51%) sepia(92%) saturate(355%) hue-rotate(63deg) brightness(94%) contrast(101%);';
    } else if (numericChange < 0) {
        return 'filter: invert(19%) sepia(87%) saturate(7498%) hue-rotate(346deg) brightness(100%) contrast(112%);';
    } else {
        return 'filter: invert(63%) sepia(90%) saturate(1509%) hue-rotate(8deg) brightness(100%) contrast(107%);';
    }
}

export function getPositionChangeSymbol(change) {
    const colorStyle = getPositionChangeColor(change);
    if (change > 0) {
        return `<img src="https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/up_icon.svg" alt="Up" style="${colorStyle} vertical-align: middle; width: 25px;">`;
    } else if (change < 0) {
        return `<img src="https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/down.svg" alt="Down" style="${colorStyle} vertical-align: middle; width: 25px;">`;
    } else {
        return `<img src="https://raw.githubusercontent.com/BlackPointX/MLMP-BetLiga/refs/heads/main/images/equal.svg" alt="Equal" style="${colorStyle} vertical-align: middle; width: 20px;">`;
    }
}

export function getPlayerAvatar(playerName) {
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

export function generateMatchResults(matches, playerIndex) {
    let results = '<div class="match-grid">';
    matches.forEach((match, index) => {
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
            <div class="match-result ${borderClass}" style="background-color: ${backgroundColor};" data-match-index="${index}">
                <img src="${match[4]}" alt="Logo 1" class="club-logo">
                <span>${playerScore}</span>
                <img src="${match[5]}" alt="Logo 2" class="club-logo">
            </div>
        `;
    });
    results += '</div>';
    return results;
}

export function parseResult(resultString) {
    const separatorIndex = resultString.lastIndexOf('/');
    if (separatorIndex === -1) {
        return { displayResult: resultString, backgroundStyle: 'red' };
    }

    let displayPart = resultString.substring(0, separatorIndex);
    const styleCode = resultString.substring(separatorIndex + 1).toLowerCase();

    const styleMap = {
        'g': 'green',
        'y': 'yellow',
        'r': 'red',
        'gl': 'blink-green',
        'yl': 'blink-yellow',
        'rl': 'blink-red'
    };

    return {
        displayResult: displayPart.trim(),
        backgroundStyle: styleMap[styleCode] || 'red'
    };
}

export function colorizeResult(resultString) {
    if (resultString === ":") {
        return `<span style="color: gray;">:</span>`;
    }

    const overtimeMatch = resultString.includes('(');
    let mainResult, overtimeScore;

    if (overtimeMatch) {
        const parts = resultString.split(' ');
        mainResult = parts[0];
        overtimeScore = parts[1].slice(1, -1);
    } else {
        mainResult = resultString;
    }

    const [leftScore, rightScore] = mainResult.split(':').map(Number);

    let leftColor = 'gray', rightColor = 'gray', colonColor = 'gray';

    if (overtimeMatch) {
        leftColor = overtimeScore == leftScore ? 'white' : 'gray';
        rightColor = overtimeScore == rightScore ? 'white' : 'gray';
    } else if (leftScore > rightScore) {
        leftColor = 'white';
    } else if (rightScore > leftScore) {
        rightColor = 'white';
    }

    const coloredResult = `
        <span style="color: ${leftColor};">${leftScore}</span>
        <span style="color: ${colonColor};">:</span>
        <span style="color: ${rightColor};">${rightScore}</span>
        ${overtimeMatch ? `<span style="color: ${rightColor};"> (${overtimeScore})</span>` : ''}
    `;

    return coloredResult;
}

export function openMatchModal(matchElement, matches, matchIndex) {
    if (!matches || !matches[matchIndex]) {
        console.error(`Brak danych dla matchIndex: ${matchIndex}`);
        return;
    }

    const leftLogo = matches[matchIndex][4];
    const rightLogo = matches[matchIndex][5];
    const realMatchResult = matches[matchIndex][6];
    const leftTeam = matches[matchIndex][7];
    const rightTeam = matches[matchIndex][8];
    const date = matches[matchIndex][9];
    const gamestatus = matches[matchIndex][10];
    const leagueName = matches[matchIndex][11];

    document.getElementById('left-team-logo-large').src = leftLogo;
    document.getElementById('right-team-logo-large').src = rightLogo;
    document.getElementById('match-result-large').innerHTML = colorizeResult(realMatchResult);
    document.getElementById('left-text').textContent = leftTeam;
    document.getElementById('right-text').textContent = rightTeam;

    const scoreTextElement = document.getElementById('score-text');
    if (gamestatus.toLowerCase() === "live") {
        scoreTextElement.innerHTML = `<span class="blinking-dot"></span> ${gamestatus}`;
    } else {
        scoreTextElement.textContent = gamestatus;
    }

    document.getElementById('league-name').textContent = leagueName;
    document.getElementById('date').textContent = date;

    const resultsForMatch = matches[matchIndex].slice(0, 4);
    for (let i = 1; i <= 4; i++) {
        const parsedResult = parseResult(resultsForMatch[i - 1]);
        document.getElementById(`small-match-result-${i}`).textContent = parsedResult.displayResult;
        const smallMatchElement = document.getElementById(`small-match-${i}`);
        smallMatchElement.className = `small-match ${parsedResult.backgroundStyle}`;
        document.getElementById(`player-avatar-${i}`).src = avatars[i - 1];
        document.getElementById(`small-left-logo-${i}`).src = leftLogo;
        document.getElementById(`small-right-logo-${i}`).src = rightLogo;
    }

    const modal = document.getElementById('match-modal');
    modal.style.display = 'flex';

    const closeModal = document.getElementById('close-modal');
    closeModal.addEventListener('click', closeMatchModal);
}

export function closeMatchModal() {
    const modal = document.getElementById('match-modal');
    modal.style.display = 'none';

    const closeModal = document.getElementById('close-modal');
    closeModal.removeEventListener('click', closeMatchModal);
}
