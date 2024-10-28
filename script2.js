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

        // Funkcja konwertująca datę w formacie "dd/mm/rrrr hh:mm" na obiekt Date
        function parseDate(dateString) {
            const [datePart, timePart] = dateString.split(' ');
            const [day, month, year] = datePart.split('/');
            const [hours, minutes] = timePart.split(':');
            return new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
        }

        // Funkcja generująca mecze na podstawie danych z API
        function generateMatches(apiData) {
            return apiData.map(match => ({
                date: match[15], // Data meczu
                parsedDate: parseDate(match[15]), // Parsujemy datę do obiektu Date
                leagueName: match[17], // Nazwa ligi z indeksu 17
                leagueLogo: 'https://via.placeholder.com/16', // Tymczasowy placeholder dla logo ligi (można zmienić, jeśli API dostarcza)
                time: match[15].split(' ')[1], // Czas meczu z daty
                status: 'FT', // Przyjmujemy, że wszystkie mecze są zakończone
                homeTeam: match[1], // Gospodarz
                awayTeam: match[3], // Gość
                homeLogo: match[0], // Logo drużyny gospodarzy
                awayLogo: match[4], // Logo drużyny gości
                homeScore: match[2].split(':')[0], // Wynik gospodarzy
                awayScore: match[2].split(':')[1], // Wynik gości
                symbol: 'https://img.icons8.com/?size=100&id=107649&format=png&color=FFFFFF' // Ikona piłki
            }));
        }

        // Funkcja renderująca mecze zgrupowane datami
        function renderMatches(matches) {
            // Grupowanie meczów według daty
            const matchesByDate = {};
            matches.forEach(match => {
                const date = match.parsedDate.toISOString().split('T')[0]; // Wyciągamy datę w formacie "YYYY-MM-DD"
                if (!matchesByDate[date]) {
                    matchesByDate[date] = [];
                }
                matchesByDate[date].push(match);
            });

            // Dla każdej daty tworzymy dzielnik i mecze
            for (const date in matchesByDate) {
                // Tworzenie dzielnika daty
                const dateDivider = document.createElement('section');
                dateDivider.classList.add('date-divider');
                dateDivider.textContent = formatDate(date);
                matchesContainer.appendChild(dateDivider);

                // Kontener meczów dla danej daty
                const matchesForDate = document.createElement('div');
                matchesForDate.classList.add('matches-for-date');
                matchesContainer.appendChild(matchesForDate);

                // Renderowanie meczów dla danej daty
                matchesByDate[date].forEach(match => {
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
                                    <span class="match-time">${match.time}</span>
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
                            <div class="symbol">
                                <img src="${match.symbol}" alt="Symbol">
                            </div>
                        </div>
                    `;

                    matchesForDate.appendChild(matchElement);
                });
            }
        }

        // Funkcja formatowania daty
        function formatDate(dateString) {
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('pl-PL', options);
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
