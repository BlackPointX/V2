document.addEventListener('DOMContentLoaded', () => {
    // Kod dla mecze.html
    if (document.getElementById('matches-container')) {
        const matchesContainer = document.getElementById('matches-container');

        // Funkcja pobierająca dane z API
        async function fetchMatchData() {
            try {
                const response = await fetch('https://script.google.com/macros/s/AKfycbxPKj0TKn1XMYUdf6C7JNZWrqgl6T8sT4LON9bq0lcDHDHuFda3yPd20PgDkfakvCumEg/exec?page=Komplet');
                const data = await response.json();
                
                logFetchedData(data.Komplet.slice(1)); // Logowanie danych do konsoli
                return data.Komplet.slice(1); // Ignoruje pierwszą grupę (nagłówki)
            } catch (error) {
                console.error('Błąd podczas pobierania danych:', error);
                return [];
            }
        }

        // Funkcja logująca pobrane dane do konsoli
        function logFetchedData(fetchedData) {
            console.log('Pobrane dane z API:', fetchedData);
        }

        // Funkcja do wyciągania wyniku zawodnika, koloru, i tworzenia elementu HTML
        function formatPlayerResult(result) {
            // Oddzielenie wyniku od sufiksu
            const [scores, suffix] = result.split('/');
            const [homePlayerScore, awayPlayerScore] = scores.split(':'); // Oddzielamy wynik gospodarza i gościa

            // Definiowanie koloru w zależności od sufiksu
            let color = '';
            switch (suffix) {
                case 'y': color = 'yellow'; break;
                case 'r': color = 'red'; break;
                case 'g': color = 'green'; break;
                default: color = 'black'; break; // Domyślny kolor, jeśli brak sufiksu
            }

            // Zwracamy HTML dla wyniku z odpowiednim kolorem
            return {
                homePlayer: `<span style="color:${color}">${homePlayerScore}</span>`,
                awayPlayer: `<span style="color:${color}">${awayPlayerScore}</span>`
            };
        }

        // Funkcja generująca mecze na podstawie danych z API
        function generateMatches(apiData) {
            return apiData.map(match => {
                const player1 = formatPlayerResult(match[6]);
                const player2 = formatPlayerResult(match[7]);
                const player3 = formatPlayerResult(match[8]);
                const player4 = formatPlayerResult(match[9]);

                return {
                    date: match[15], // Data meczu
                    leagueName: match[17], // Nazwa ligi z indeksu 17
                    leagueLogo: 'https://via.placeholder.com/16', // Placeholder logo
                    time: match[15].split(' ')[1], // Czas meczu
                    status: 'FT', // Przyjmujemy, że wszystkie mecze są zakończone
                    homeTeam: match[1], // Gospodarz
                    awayTeam: match[3], // Gość
                    homeLogo: match[0], // Logo drużyny gospodarzy
                    awayLogo: match[4], // Logo drużyny gości
                    homeScore: match[2].split(':')[0], // Wynik gospodarzy
                    awayScore: match[2].split(':')[1], // Wynik gości
                    playerResults: [player1, player2, player3, player4] // Wyniki graczy
                };
            });
        }

        // Funkcja renderująca mecze pogrupowane w kolejki
        function renderMatches(matches) {
            let matchCounter = 0;
            let currentKolejka = 1;
            let matchesForKolejka = document.createElement('div');
            matchesForKolejka.classList.add('matches-for-kolejka');

            // Dodanie sekcji dla kolejki z użyciem stylu "date-divider"
            function createKolejkaSection(kolejkaNumber) {
                const kolejkaDivider = document.createElement('section');
                kolejkaDivider.classList.add('date-divider'); // Reusing the date divider style
                kolejkaDivider.textContent = `Kolejka ${kolejkaNumber}`;
                matchesContainer.appendChild(kolejkaDivider);

                matchesForKolejka = document.createElement('div');
                matchesForKolejka.classList.add('matches-for-date'); // Keeping the same class for match container
                matchesContainer.appendChild(matchesForKolejka);
            }

            // Inicjujemy pierwszą kolejkę
            createKolejkaSection(currentKolejka);

            matches.forEach(match => {
                // Jeśli mamy 8 meczów w kolejce, zaczynamy nową kolejkę
                if (matchCounter === 8) {
                    currentKolejka++;
                    matchCounter = 0;
                    createKolejkaSection(currentKolejka); // Tworzymy nową sekcję dla kolejki
                }

                const matchElement = document.createElement('section');
                matchElement.classList.add('match');

                matchElement.innerHTML = `
                    <!-- Sekcja dla ligi, wyświetlana nad meczem -->
                    <div class="league-info">
                        <img class="league-logo" src="${match.leagueLogo}" alt="Logo ${match.leagueName}">
                        <span class="league-name">${match.leagueName}</span> <!-- Nazwa ligi -->
                    </div>

                    <!-- Sekcja dla meczu -->
                    <div class="match-info">
                        <div class="left-section">
                            <div class="match-time-status">
                                <span class="match-status">${match.status}</span>
                            </div>
                        </div>
                         <div class="vertical-separator"></div>
                        <div class="teams">
                            <div class="team">
                                <img src="${match.homeLogo}" alt="Logo ${match.homeTeam}">
                                <span class="team-name">${match.homeTeam}</span>
                            </div>
                            <div class="team">
                                <img src="${match.awayLogo}" alt="Logo ${match.awayTeam}">
                                <span class="team-name">${match.awayTeam}</span>
                            </div>
                        </div>
                        <div class="score">
                            <span class="score-home">${match.homeScore}</span>
                            <span class="score-away">${match.awayScore}</span>
                        </div>
                        <div class="vertical-separator"></div>
                        
                        <!-- Wyniki zawodników w dwóch kolumnach -->
                        <div class="score-player">
                            <!-- Wyniki graczy gospodarza -->
                            <span class="score-home">${match.playerResults[0].homePlayer}</span>
                            <span class="score-home">${match.playerResults[0].awayPlayer}</span>
                        </div>

                        <div class="vertical-separator-result"></div>
                        
                        <div class="score-player">
                            <!-- Wyniki graczy gości -->
                            <span class="score-away">${match.playerResults[1].homePlayer}</span>
                            <span class="score-away">${match.playerResults[1].awayPlayer}</span>
                        </div>

                        <div class="vertical-separator-result"></div>
                        
                        <div class="score-player">
                            <!-- Wyniki graczy gospodarza -->
                            <span class="score-home">${match.playerResults[2].homePlayer}</span>
                            <span class="score-home">${match.playerResults[2].awayPlayer}</span>
                        </div>

                        <div class="vertical-separator-result"></div>
                        
                            <!-- Wyniki graczy gości -->
                        <div class="score-player">
                            <span class="score-away">${match.playerResults[3].homePlayer}</span>
                            <span class="score-away">${match.playerResults[3].awayPlayer}</span>
                        </div>
                    </div>
                `;

                matchesForKolejka.appendChild(matchElement);
                matchCounter++;
            });
        }

        // Funkcja inicjująca pobieranie i renderowanie meczów
        async function init() {
            const apiData = await fetchMatchData();
            const matches = generateMatches(apiData);
            renderMatches(matches);
        }

        init();
    }
});
