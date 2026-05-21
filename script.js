document.addEventListener('DOMContentLoaded', () => {
    
    // Список городов с их официальными идентификаторами часовых поясов IANA
    const cities = [
        { name: "Москва", zone: "Europe/Moscow", emoji: "🏰" },
        { name: "Лондон", zone: "Europe/London", emoji: "🇬🇧" },
        { name: "Нью-Йорк", zone: "America/New_York", emoji: "🗽" },
        { name: "Токио", zone: "Asia/Tokyo", emoji: "🗼" },
        { name: "Сидней", zone: "Australia/Sydney", emoji: "🦘" },
        { name: "Дубай", zone: "Asia/Dubai", emoji: "🐪" }
    ];

    let currentCityIdx = 0;
    let clockInterval;

    const clockCard = document.getElementById('clock-card');
    const cityName = document.getElementById('city-name');
    const cityEmoji = document.getElementById('city-emoji');
    const timeString = document.getElementById('time-string');
    const dateString = document.getElementById('date-string');
    const timezoneOffset = document.getElementById('timezone-offset');
    const nextCityBtn = document.getElementById('next-city-btn');

    // Функция обновления времени для выбранного города
    function updateClock() {
        const activeCity = cities[currentCityIdx];
        const now = new Date();

        try {
            // Форматирование времени
            const timeOptions = { timeZone: activeCity.zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
            timeString.textContent = new Intl.DateTimeFormat('ru-RU', timeOptions).format(now);

            // Форматирование даты
            const dateOptions = { timeZone: activeCity.zone, weekday: 'long', day: 'numeric', month: 'long' };
            let formattedDate = new Intl.DateTimeFormat('ru-RU', dateOptions).format(now);
            // Делаем первую букву дня недели заглавной
            dateString.textContent = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

            // Определение смещения UTC
            const tzOptions = { timeZone: activeCity.zone, timeZoneName: 'short' };
            const parts = new Intl.DateTimeFormat('ru-RU', tzOptions).formatToParts(now);
            const tzName = parts.find(p => p.type === 'timeZoneName').value;
            timezoneOffset.textContent = tzName;
        } catch (e) {
            // Запасной вариант, если браузер не поддерживает конкретную зону
            timeString.textContent = now.toLocaleTimeString('ru-RU');
        }
    }

    // Функция переключения города с 3D-анимацией
    function changeCity() {
        // Включаем анимацию переворота карточки
        clockCard.classList.add('flip');

        // Ждем середины анимации (когда карточка не видна глазу), чтобы сменить данные
        setTimeout(() => {
            currentCityIdx = (currentCityIdx + 1) % cities.length;
            const targetCity = cities[currentCityIdx];

            cityName.textContent = targetCity.name;
            cityEmoji.textContent = targetCity.emoji;
            
            // Мгновенно обновляем цифры под новый часовой пояс
            updateClock();

            // Возвращаем карточку в исходное положение
            clockCard.classList.remove('flip');
        }, 300);
    }

    // Слушатель событий на кнопку
    nextCityBtn.addEventListener('click', changeCity);

    // Запуск часов в реальном времени (каждую секунду)
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
});
