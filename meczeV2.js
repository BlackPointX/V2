document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('matches-container')) {
        const matchesContainer = document.getElementById('matches-container');

        async function fetchMatchData() {
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbxPKj0TKn1XMYUdf6C7JNZWrqgl6T8sT4LON9bq0lcDHDHuFda3yPd20PgDkfakvCumEg/exec?page=Komplet');
                const data = await response.json();
                logFetchedData(data.Komplet.slice(1));
                return data.Komplet.slice(1);
            } catch (error) {
                console.error('Error fetching data:', error);
                return [];
            }
        }

        function logFetchedData(fetchedData) {
            console.log('Fetched data from API:', fetchedData);
        }

        function formatPlayerResult(result) {
            const [scores, suffix] = result.split('/');
            let homePlayerScore = "0", awayPlayerScore = "0", homePlayerClass = "", awayPlayerClass = "", color = "black";
        
            if (scores) {
                const scoreMatch = scores.match(/^(\d+):(\d+)(?:\s?\((\d+)\))?$/);
        
                if (scoreMatch) {
                    const [_, mainHomeScore, mainAwayScore, extraInfo] = scoreMatch;
                    homePlayerScore = mainHomeScore;
                    awayPlayerScore = mainAwayScore;
        
                    // Apply winner-circle class based on extraInfo (1 for home, 2 for away)
                    if (extraInfo === "1") {
                        homePlayerClass = "winner-circle";
                    } else if (extraInfo === "2") {
                        awayPlayerClass = "winner-circle";
                    }
                } else {
                    [homePlayerScore, awayPlayerScore] = scores.split(':');
                }
            }
        
            switch (suffix) {
                case 'y': color = 'yellow'; break;
                case 'r': color = 'red'; break;
                case 'g': color = 'green'; break;
                case 'yg': color = '#87CEEB'; break;
                default: color = 'black'; break;
            }
        
            return {
                homePlayer: `<span class="${homePlayerClass}" style="color:${color}">${homePlayerScore}</span>`,
                awayPlayer: `<span class="${awayPlayerClass}" style="color:${color}">${awayPlayerScore}</span>`
            };
        }

        function getTeamColors(homeScore, awayScore, homeScoreClass, awayScoreClass) {
            if (homeScoreClass === "winner-circle") {
                return { homeColor: '#ffffff', awayColor: 'rgba(255, 255, 255, 0.5)' };
            } else if (awayScoreClass === "winner-circle") {
                return { homeColor: 'rgba(255, 255, 255, 0.5)', awayColor: '#ffffff' };
            } else if (parseInt(homeScore) > parseInt(awayScore)) {
                return { homeColor: '#ffffff', awayColor: 'rgba(255, 255, 255, 0.5)' };
            } else if (parseInt(awayScore) > parseInt(homeScore)) {
                return { homeColor: 'rgba(255, 255, 255, 0.5)', awayColor: '#ffffff' };
            } else {
                return { homeColor: 'rgba(255, 255, 255, 0.5)', awayColor: 'rgba(255, 255, 255, 0.5)' };
            }
        }

        function generateMatches(apiData) {
            return apiData.map(match => {
                const player1 = formatPlayerResult(match[6]);
                const player2 = formatPlayerResult(match[7]);
                const player3 = formatPlayerResult(match[8]);
                const player4 = formatPlayerResult(match[9]);

                let matchScore = match[2];
                let homeScore = "0", awayScore = "0", homeScoreClass = "", awayScoreClass = "";

                const scoreMatch = matchScore.match(/^(\d+):(\d+)(?:\s?\((\d+)\))?$/);
                
                if (scoreMatch) {
                    const [_, mainHomeScore, mainAwayScore, extraInfo] = scoreMatch;
                    homeScore = mainHomeScore;
                    awayScore = mainAwayScore;

                    if (extraInfo === "1") {
                        homeScoreClass = "winner-circle";
                    } else if (extraInfo === "2") {
                        awayScoreClass = "winner-circle";
                    }
                } else {
                    [homeScore, awayScore] = matchScore.split(':');
                }

                const { homeColor, awayColor } = getTeamColors(homeScore, awayScore, homeScoreClass, awayScoreClass);

                return {
                    date: match[15],
                    leagueName: match[17],
                    leagueLogo: 'https://via.placeholder.com/16',
                    time: match[15].split(' ')[1],
                    status: 'FT',
                    homeTeam: match[1],
                    awayTeam: match[3],
                    homeTeamHtml: `<span style="color:${homeColor}">${match[1]}</span>`,
                    awayTeamHtml: `<span style="color:${awayColor}">${match[3]}</span>`,
                    homeLogo: match[0],
                    awayLogo: match[4],
                    homeScore: `<span class="${homeScoreClass}" style="color:${homeColor}">${homeScore}</span>`,
                    awayScore: `<span class="${awayScoreClass}" style="color:${awayColor}">${awayScore}</span>`,
                    playerResults: [player1, player2, player3, player4]
                };
            });
        }

        function renderMatches(matches) {
            let currentKolejka = 1;
            let matchesForKolejka = document.createElement('div');
            matchesForKolejka.classList.add('matches-for-kolejka');

            function createKolejkaSection(kolejkaNumber) {
                const kolejkaDivider = document.createElement('section');
                kolejkaDivider.classList.add('date-divider');
                kolejkaDivider.textContent = `Kolejka ${kolejkaNumber}`;
                matchesContainer.appendChild(kolejkaDivider);

                matchesForKolejka = document.createElement('div');
                matchesForKolejka.classList.add('matches-for-date');
                matchesContainer.appendChild(matchesForKolejka);
            }

            // Tworzymy początkową kolejkę
            createKolejkaSection(currentKolejka);

            matches.forEach((match, index) => {
                const matchElement = document.createElement('section');
                matchElement.classList.add('match');

                matchElement.innerHTML = `
                    <div class="league-info">
                        <img class="league-logo" src="${match.leagueLogo}" alt="Logo ${match.homeTeam}">
                        <span class="league-name">${match.leagueName}</span>
                    </div>

                    <div class="match-info">
                        <div class="left-section">
                            <div class="match-time-status">
                                <span class="match-status">${match.status}</span>
                            </div>
                        </div>
                        <div class="vertical-separator"></div>
                        <div class="teams">
                            <div class="team-home">
                                <img src="${match.homeLogo}" alt="Logo ${match.homeTeam}">
                                <span class="team-name">${match.homeTeamHtml}</span>
                            </div>
                            <div class="team-away">
                                <img src="${match.awayLogo}" alt="Logo ${match.awayTeam}">
                                <span class="team-name">${match.awayTeamHtml}</span>
                            </div>
                        </div>
                        <div class="score">
                            <span class="score-home" style="margin-bottom: 5px;">${match.homeScore}</span>
                            <span class="score-away" style="margin-bottom: 0px;">${match.awayScore}</span>
                        </div>
                        <div class="vertical-separator"></div>
                        
                        <div class="score-player">
                            <span class="score-home" style="margin-bottom: 5px;">${match.playerResults[0].homePlayer}</span>
                            <span class="score-away" style="margin-bottom: 0px;">${match.playerResults[0].awayPlayer}</span>
                        </div>

                        <div class="vertical-separator-result"></div>
                        
                        <div class="score-player">
                            <span class="score-home" style="margin-bottom: 5px;">${match.playerResults[1].homePlayer}</span>
                            <span class="score-away" style="margin-bottom: 0px;">${match.playerResults[1].awayPlayer}</span>
                        </div>

                        <div class="vertical-separator-result"></div>
                        
                        <div class="score-player">
                            <span class="score-home" style="margin-bottom: 5px;">${match.playerResults[2].homePlayer}</span>
                            <span class="score-away" style="margin-bottom: 0px;">${match.playerResults[2].awayPlayer}</span>
                        </div>

                        <div class="vertical-separator-result"></div>
                        
                        <div class="score-player">
                            <span class="score-home" style="margin-bottom: 5px;">${match.playerResults[3].homePlayer}</span>
                            <span class="score-away" style="margin-bottom: 0px;">${match.playerResults[3].awayPlayer}</span>
                        </div>
                    </div>
                `;

                matchesForKolejka.appendChild(matchElement);

                // Jeśli `match[10]` zawiera wartość, oznacza to koniec kolejki
                if (match[10]) {
                    currentKolejka++;
                    createKolejkaSection(currentKolejka);
                }
            });
        }

        async function init() {
            const apiData = await fetchMatchData();
            const matches = generateMatches(apiData);
            renderMatches(matches);
        }

        init();
    }
});
