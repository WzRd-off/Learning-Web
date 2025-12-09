// Глобальні змінні для збереження даних між локаціями
let gameData = {
    fuelParams: { A: 0, B: 0, C: 0 },
    fuelResult: 0,
    selectedPlanet: null,
    shipSpeed: 0,
    currentTime: 0,
    energyLevel: 0,
    signalTrusted: false,
    currentLocation: 1
};

// Ініціалізація зірок
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = star.style.height = Math.random() * 3 + 'px';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        starsContainer.appendChild(star);
    }
}

// Ініціалізація гри
function initGame() {
    createStars();
    generateFuelParams();
}

// Локація 1: Генерація параметрів палива
function generateFuelParams() {
    gameData.fuelParams.A = Math.floor(Math.random() * 50) + 10;
    gameData.fuelParams.B = Math.floor(Math.random() * 20) + 5;
    gameData.fuelParams.C = Math.floor(Math.random() * 100) + 50;

    document.getElementById('fuel-params').innerHTML = `
                <h4>🔢 Параметри енергосистеми:</h4>
                <p><strong>A</strong> (Потужність двигуна): ${gameData.fuelParams.A}</p>
                <p><strong>B</strong> (Коефіцієнт ефективності): ${gameData.fuelParams.B}</p>
                <p><strong>C</strong> (Базове споживання): ${gameData.fuelParams.C}</p>
                <p><em>Формула: Необхідне паливо = (A × B) - C</em></p>
            `;
}

// Перевірка розрахунку палива
function checkFuelCalculation() {
    const userInput = parseInt(document.getElementById('fuel-calc').value);
    const correctAnswer = (gameData.fuelParams.A * gameData.fuelParams.B) - gameData.fuelParams.C;
    const resultDiv = document.getElementById('fuel-result');

    gameData.fuelResult = correctAnswer;

    if (userInput === correctAnswer) {
        resultDiv.className = 'status-display success';
        resultDiv.innerHTML = `
                    <h4>✅ Розрахунок правильний!</h4>
                    <p>Двигуни запущені! Необхідно ${correctAnswer} одиниць палива.</p>
                    <p><strong>Підказка:</strong> Наступна локація знаходиться в "Навігаційному Центрі".</p>
                `;
        setTimeout(() => nextLocation(2), 2000);
    } else {
        resultDiv.className = 'status-display error';
        resultDiv.innerHTML = `
                    <h4>❌ Помилка в розрахунках!</h4>
                    <p>Правильна відповідь: ${correctAnswer}</p>
                    <p>Спробуйте ще раз!</p>
                `;
    }
    resultDiv.style.display = 'block';
}

// Вибір планети
function selectPlanet(planet, distance, minSpeed) {
    // Очищаємо попередній вибір
    document.querySelectorAll('.planet-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Вибираємо нову планету
    event.target.closest('.planet-card').classList.add('selected');

    gameData.selectedPlanet = {
        name: planet,
        distance: distance,
        minSpeed: minSpeed
    };
}

// Перевірка умов польоту
function checkFlightConditions() {
    if (!gameData.selectedPlanet) {
        alert('Спочатку виберіть планету призначення!');
        return;
    }

    const speed = parseFloat(document.getElementById('ship-speed').value);
    const time = parseInt(document.getElementById('current-time').value);
    const energy = parseInt(document.getElementById('energy-level').value);

    gameData.shipSpeed = speed;
    gameData.currentTime = time;
    gameData.energyLevel = energy;

    const resultDiv = document.getElementById('flight-result');
    const consoleDiv = document.getElementById('flight-console');

    // Розрахунки
    const travelTime = gameData.selectedPlanet.distance / speed; // години
    const speedCheck = speed >= gameData.selectedPlanet.minSpeed;
    const timeWindow = time >= 10 && time <= 14;
    const energyCheck = energy > 80;

    // Перевірка умов запуску
    const canLaunch = speedCheck && (timeWindow && energyCheck);

    // Відображення результатів
    let consoleOutput = '';
    consoleOutput += `> Аналіз траєкторії польоту...\n`;
    consoleOutput += `> Планета: ${gameData.selectedPlanet.name.toUpperCase()}\n`;
    consoleOutput += `> Відстань: ${gameData.selectedPlanet.distance} млн км\n`;
    consoleOutput += `> Швидкість корабля: ${speed} км/с\n`;
    consoleOutput += `> Час польоту: ${travelTime.toFixed(2)} годин\n`;
    consoleOutput += `> Мінімальна швидкість: ${speedCheck ? '✅ ПРОЙДЕНО' : '❌ НЕДОСТАТНЬО'}\n`;
    consoleOutput += `> Часове вікно (10-14): ${timeWindow ? '✅ ДОСТУПНЕ' : '❌ НЕДОСТУПНЕ'}\n`;
    consoleOutput += `> Рівень енергії: ${energyCheck ? '✅ ДОСТАТНЬО' : '❌ НЕДОСТАТНЬО'}\n`;
    consoleOutput += `> Статус запуску: ${canLaunch ? '✅ ДОЗВОЛЕНО' : '❌ ЗАБОРОНЕНО'}\n`;

    consoleDiv.innerHTML = consoleOutput.split('\n').map(line =>
        `<div class="console-line">${line}</div>`
    ).join('');

    if (canLaunch) {
        resultDiv.className = 'status-display success';
        resultDiv.innerHTML = `
                    <h4>🚀 Політ дозволено!</h4>
                    <p>Всі системи готові до старту. Час прибуття: ${travelTime.toFixed(2)} годин.</p>
                    <p><strong>Підказка:</strong> "Слухай сигнали космосу, але будь обережний з невідомими джерелами".</p>
                `;
        setTimeout(() => nextLocation(3), 3000);
    } else {
        resultDiv.className = 'status-display error';
        resultDiv.innerHTML = `
                    <h4>⚠️ Політ неможливий!</h4>
                    <p>Умови не відповідають вимогам безпеки. Перевірте параметри.</p>
                `;
    }

    resultDiv.style.display = 'block';
    consoleDiv.style.display = 'block';
}

// Аналіз сигналів
function analyzeSignals() {
    const action = document.getElementById('signal-action').value;
    if (!action) {
        alert('Виберіть дію з сигналом!');
        return;
    }

    const resultDiv = document.getElementById('signal-result');
    let unknownStatus = null; // імітуємо undefined/null

    // Використовуємо оператор ?? для присвоєння статусу
    unknownStatus = unknownStatus ?? 'ПІДОЗРІЛИЙ';

    // Логіка аналізу сигналів
    const reliableSignal = true;
    const trustUnknown = action === 'trust';
    gameData.signalTrusted = trustUnknown;

    const safeToTrust = reliableSignal && !trustUnknown; // НЕ довіряємо невідомому
    const finalDecision = safeToTrust || action === 'analyze'; // безпечно АБО аналізуємо

    if (finalDecision && action !== 'trust') {
        resultDiv.className = 'status-display success';
        resultDiv.innerHTML = `
                    <h4>✅ Правильне рішення!</h4>
                    <p>Невідомий сигнал класифіковано як: <strong>${unknownStatus}</strong></p>
                    <p>Ви діяли обережно. Координати до фінальної точки отримано!</p>
                    <p><strong>Увага:</strong> Детектор виявив аномалію в енергосистемі корабля!</p>
                `;
        setTimeout(() => nextLocation(4), 3000);
    } else {
        resultDiv.className = 'status-display error';
        resultDiv.innerHTML = `
                    <h4>⚠️ Ризиковане рішення!</h4>
                    <p>Довіра невідомим сигналам може призвести до проблем...</p>
                    <p>Але місія продовжується. Будьте обережні!</p>
                `;
        setTimeout(() => nextLocation(4), 3000);
    }

    resultDiv.style.display = 'block';
}

// Фінальне завдання: різання дротів
let countdown = 60;
let countdownInterval;

function startCountdown() {
    countdownInterval = setInterval(() => {
        countdown--;
        document.getElementById('countdown').textContent = Math.max(0, countdown);

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            explode();
        }
    }, 1000);
}

function cutWire(color) {
    clearInterval(countdownInterval);

    // Логіка вибору правильного дроту
    const fuelWasEven = gameData.fuelResult % 2 === 0;
    const highSpeed = gameData.shipSpeed > 15;
    const goodEnergy = gameData.energyLevel > 80;
    const goodTime = gameData.currentTime >= 10 && gameData.currentTime <= 14;
    const trustedUnknown = gameData.signalTrusted;

    let correctWire;
    if (fuelWasEven) {
        correctWire = 'red';
    } else if (highSpeed) {
        correctWire = 'blue';
    } else if (goodEnergy || goodTime) {
        correctWire = 'green';
    } else if (trustedUnknown) {
        correctWire = 'yellow';
    } else {
        correctWire = 'green'; // запасний варіант
    }

    const resultDiv = document.getElementById('bomb-result');
    const wireElements = document.querySelectorAll('.wire');

    // Позначаємо дріт як перерізаний
    event.target.classList.add('cut');
    wireElements.forEach(wire => wire.onclick = null);

    // Перевірка результату
    if (color === correctWire) {
        resultDiv.className = 'status-display success';
        resultDiv.innerHTML = `
                    <h4>🎉 МІСІЮ ЗАВЕРШЕНО УСПІШНО!</h4>
                    <p>Ви правильно вибрали ${color === 'red' ? 'червоний' : color === 'blue' ? 'синій' : color === 'green' ? 'зелений' : 'жовтий'} дріт!</p>
                    <p>Енергосистема стабілізована. Корабель врятовано!</p>
                    <p><strong>Вітаємо, капітане! Ви успішно завершили космічну подорож!</strong></p>
                    <button class="btn" onclick="restartGame()">🔄 Грати ще</button>
                `;
        updateProgress(4);
    } else {
        resultDiv.className = 'status-display error';
        resultDiv.innerHTML = `
                    <h4>💥 КРИТИЧНА ПОМИЛКА!</h4>
                    <p>Неправильний вибір дроту призвів до перевантаження системи!</p>
                    <p>Правильним був ${correctWire === 'red' ? 'червоний' : correctWire === 'blue' ? 'синій' : correctWire === 'green' ? 'зелений' : 'жовтий'} дріт.</p>
                    <p><strong>Місія провалена, але ви можете спробувати знову!</strong></p>
                    <button class="btn" onclick="restartGame()">🔄 Почати заново</button>
                `;
    }

    resultDiv.style.display = 'block';
}

function explode() {
    const resultDiv = document.getElementById('bomb-result');
    resultDiv.className = 'status-display error';
    resultDiv.innerHTML = `
                <h4>⏰ ЧАС ВИЙШОВ!</h4>
                <p>Енергосистема перевантажилась через відсутність дій!</p>
                <p><strong>Місія провалена!</strong></p>
                <button class="btn" onclick="restartGame()">🔄 Спробувати ще раз</button>
            `;
    resultDiv.style.display = 'block';
}

// Перехід між локаціями
function nextLocation(locationNumber) {
    // Приховуємо поточну локацію
    document.querySelectorAll('.location').forEach(loc => {
        loc.classList.remove('active');
    });

    // Показуємо нову локацію
    document.getElementById(`location${locationNumber}`).classList.add('active');

    // Оновлюємо прогрес
    updateProgress(locationNumber);

    // Запускаємо зворотний відлік для фінальної локації
    if (locationNumber === 4) {
        setTimeout(() => startCountdown(), 1000);
    }
}

function updateProgress(step) {
    const progress = (step / 4) * 100;
    document.getElementById('progress').style.width = progress + '%';
    document.getElementById('progress-text').textContent = `${step}/4`;
    gameData.currentLocation = step;
}

// Перезапуск гри
function restartGame() {
    // Скидаємо дані гри
    gameData = {
        fuelParams: { A: 0, B: 0, C: 0 },
        fuelResult: 0,
        selectedPlanet: null,
        shipSpeed: 0,
        currentTime: 0,
        energyLevel: 0,
        signalTrusted: false,
        currentLocation: 1
    };

    countdown = 60;
    clearInterval(countdownInterval);

    // Очищаємо форми
    document.getElementById('fuel-calc').value = '';
    document.getElementById('ship-speed').value = '12';
    document.getElementById('current-time').value = '12';
    document.getElementById('energy-level').value = '85';
    document.getElementById('signal-action').value = '';

    // Приховуємо результати
    document.querySelectorAll('.status-display[id$="-result"]').forEach(div => {
        div.style.display = 'none';
    });

    // Відновлюємо дроти
    document.querySelectorAll('.wire').forEach(wire => {
        wire.classList.remove('cut');
        const color = wire.classList[1];
        wire.onclick = () => cutWire(color);
    });

    // Очищаємо вибір планет
    document.querySelectorAll('.planet-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Повертаємося до першої локації
    nextLocation(1);
    generateFuelParams();
}

// Запуск гри при завантаженні сторінки
window.addEventListener('load', initGame);