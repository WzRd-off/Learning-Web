const targetTempSlider = document.getElementById('target-temp-slider');
const targetTempLabel = document.getElementById('target-temp-val');
const targetHumidSlider = document.getElementById('target-humid-slider');
const targetHumidLabel = document.getElementById('target-humid-val');
const outsideTempSlider = document.getElementById('outside-temp-slider');
const outsideTempLabel = document.getElementById('outside-temp-val');
const detailRoomName = document.getElementById('detail-room-name');
const detailTemp = document.getElementById('detail-temp');
const detailHumidity = document.getElementById('detail-humidity');
const houseGrid = document.getElementById('house-grid');
const Select = document.getElementById('day-night-select');
const SimModeSelect = document.getElementById('sim-mode-select'); 
const securityBtn = document.getElementById('security-btn'); 
const specialDevicesContainer = document.getElementById('special-devices-container');
const roomElements = document.querySelectorAll('.room');
const logArea = document.getElementById('log-container');

const lastStates = {};
let activeRoomId = 'living';

outsideTempSlider.value = outsideTemp;

// 1. Повзунки
targetTempSlider.addEventListener('input', function() {
    targetTempLabel.innerText = targetTempSlider.value;
    const room = houseState.find(r => r.id === activeRoomId);
    if (room) room.targetTemperature = Number(targetTempSlider.value);
});

targetHumidSlider.addEventListener('input', function() {
    targetHumidLabel.innerText = targetHumidSlider.value;
    const room = houseState.find(r => r.id === activeRoomId);
    if (room) room.targetHumidity = Number(targetHumidSlider.value);
});

outsideTempSlider.addEventListener('input', function() {
    outsideTempLabel.innerText = outsideTempSlider.value;
    outsideTemp = Number(outsideTempSlider.value);

});

// 2. Режими
Select.addEventListener('change', function() {
    updateDayNightUI(Select.value === 'night');
    isNight = (Select.value === 'night');
    printLog(isNight ? "Режим змінено на: Ніч 🌙" : "Режим змінено на: День ☀️");
});

SimModeSelect.addEventListener('change', function() {
    simulationMode = SimModeSelect.value;
    outsideTempSlider.disabled = (simulationMode === 'auto');
    printLog(`Режим симуляції: ${simulationMode === 'auto' ? 'Автономний' : 'Ручний'}`);
});

// 3. Охорона
securityBtn.addEventListener('click', function() {
    if (isAlarmTriggered) {
        // Якщо тривога кнопка скидає тривогу
        isAlarmTriggered = false;
        isArmed = false;
        securityBtn.innerText = "Вимкнено";
        securityBtn.classList.remove('alarm-active');
        houseGrid.classList.remove('alarm-flash'); 
        printLog("ТРИВОГА ВИМКНЕНА КОРИСТУВАЧЕМ");
    } else {
        // Звичайне перемикання
        isArmed = !isArmed;
        securityBtn.innerText = isArmed ? "АКТИВОВАНО" : "Вимкнено";
        securityBtn.classList.toggle('active', isArmed);
        printLog(isArmed ? "Система охорони: АКТИВОВАНА 🛡️" : "Система охорони: ДЕАКТИВОВАНА");
    }
});

// 4. Кліки по кімнатах
roomElements.forEach(roomElem => {
    roomElem.addEventListener('click', function() {
        const cleanId = this.id.replace('room-', '');
        
        registerMotion(cleanId);
        
        // Якщо спрацювала тривога після цього руху
        if (isAlarmTriggered) {
            triggerAlarmVisuals(cleanId);
            return;
        }

        selectRoom(cleanId);
        
        const roomData = houseState.find(r => r.id === cleanId);
        if(roomData) printLog(`Користувач обрав кімнату: ${roomData.name}`);
    });
});


function updateDayNightUI(isNightNow) {
    if (!isNightNow) {
        houseGrid.style.backgroundColor = '#fff5d7';
        Select.value = 'day';
    } else {
        houseGrid.style.backgroundColor = '#252530';
        Select.value = 'night';
    }
}

function selectRoom(roomId) {
    activeRoomId = roomId;
    const roomData = houseState.find(room => room.id === roomId);

    if (!roomData) return;

    detailRoomName.innerText = roomData.name;
    detailTemp.innerText = roomData.currentTemperature; 
    detailHumidity.innerText = roomData.currentHumidity;

    targetTempSlider.value = roomData.targetTemperature;
    targetTempLabel.innerText = roomData.targetTemperature;
    targetHumidSlider.value = roomData.targetHumidity;
    targetHumidLabel.innerText = roomData.targetHumidity;
    
    updateDeviceStatus(roomData);
    renderSpecialDevices(roomData); 
}

// Генерація кнопок розумних пристроїв
function renderSpecialDevices(roomData) {
    specialDevicesContainer.innerHTML = ''; 

    if (!roomData.specialDevices || roomData.specialDevices.length === 0) {
        specialDevicesContainer.innerHTML = '<div style="color: #666; font-style: italic;">Немає розумних пристроїв</div>';
        return;
    }

    roomData.specialDevices.forEach(device => {
        const btn = document.createElement('div');
        btn.className = `device-icon ${device.active ? 'active' : 'inactive'}`;
        btn.innerText = device.name;
        btn.style.cursor = 'pointer';
        
        // Клік по кнопці пристрою
        btn.onclick = () => {
            const updatedDevice = toggleSpecialDevice(roomData.id, device.id); 
            if (updatedDevice) {
                btn.className = `device-icon ${updatedDevice.active ? 'active' : 'inactive'}`;
                printLog(`${roomData.name}: ${updatedDevice.name} -> ${updatedDevice.active ? 'УВІМК' : 'ВИМК'}`);
            }
        };

        specialDevicesContainer.appendChild(btn);
    });
}

function updateDeviceStatus(roomData) {
    const setStatus = (elementId, isActive) => {
        const element = document.getElementById(elementId);
        if (element) {
            if (isActive) {
                element.classList.add('active');
                element.classList.remove('inactive');
            } else {
                element.classList.add('inactive');
                element.classList.remove('active');
            }
        }
    };
    setStatus('dev-ac', roomData.acON);
    setStatus('dev-heater', roomData.heaterON);
    setStatus('dev-humid', roomData.humidifierON);
    setStatus('dev-light', roomData.ligthON);
}

function updateRoomLigth(roomData) {
    const room = document.getElementById('room-' + roomData.id);
    const roomIcons = room.querySelector('.room-icons');
    const roomTitle = room.querySelector('.room-title');    

    if(roomData.ligthON) {
        room.classList.add('ligth');
        if(roomIcons) roomIcons.classList.add('ligth-font');
        if(roomTitle) roomTitle.classList.add('ligth-font');
    }
    else {
        room.classList.remove('ligth');
        if(roomIcons) roomIcons.classList.remove('ligth-font');
        if(roomTitle) roomTitle.classList.remove('ligth-font');
    }
}

function updateRoomVisuals(roomId, temp, humid) {
    const roomDiv = document.getElementById('room-' + roomId);
    const tempSpan = roomDiv.querySelector('#temp');
    const humidSpan = roomDiv.querySelector('#humid');
    tempSpan.innerText = `🌡️ ${temp}°`;
    humidSpan.innerText = `💧 ${humid}%`;
    
    // Оновлюємо світло
    const roomData = houseState.find(r => r.id === roomId);
    if (roomData) updateRoomLigth(roomData);

    // Якщо це активна кімната - оновлюємо праву панель в реальному часі
    if (activeRoomId === roomId) {
        detailTemp.innerText = temp;
        detailHumidity.innerText = humid;
    }
}

function triggerAlarmVisuals(roomId) {
    printLog(`!!! ТРИВОГА !!! Виявлено рух у кімнаті: ${roomId.toUpperCase()}`);
    securityBtn.innerText = "ТРИВОГА! (Скинути)";
    securityBtn.classList.add('alarm-active');
    houseGrid.classList.add('alarm-flash'); // CSS анімація
}

function checkStateChanges(room) {
    if (!lastStates[room.id]) {
        lastStates[room.id] = {
            light: room.ligthON,
            heater: room.heaterON,
            ac: room.acON,
            humidifier: room.humidifierON
        };
        return;
    }

    const last = lastStates[room.id];

    if (room.ligthON !== last.light) {
        const status = room.ligthON ? "УВІМКНЕНО 💡" : "ВИМКНЕНО 🌑";
        printLog(`${room.name}: Світло ${status}`);
        last.light = room.ligthON;
    }
    if (room.heaterON !== last.heater) {
        const status = room.heaterON ? "Увімкнено обігрів 🔥" : "Вимкнено обігрів";
        printLog(`${room.name}: ${status}`);
        last.heater = room.heaterON;
    }
    if (room.acON !== last.ac) {
        const status = room.acON ? "Увімкнено охолодження ❄️" : "Вимкнено охолодження";
        printLog(`${room.name}: ${status}`);
        last.ac = room.acON;
    }
    if (room.humidifierON !== last.humidifier) {
        const status = room.humidifierON ? "Увімкнено зволоження 💧" : "Вимкнено зволоження";
        printLog(`${room.name}: ${status}`);
        last.humidifier = room.humidifierON;
    }
}

function printLog(message) {
    const timestamp = new Date().toLocaleTimeString();
    let messageText  = `[${timestamp}] ${message}\n`;
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    logEntry.innerText = messageText;
    logArea.appendChild(logEntry);
    logArea.scrollTop = logArea.scrollHeight;
}

function startSimulation() {
    printLog('Симуляція розпочата.');
    const startBtn = document.getElementById('start-sim-btn');
    if(startBtn) {
        startBtn.disabled = true;
        startBtn.textContent = 'Симуляція йде...';
    }

    outsideTempSlider.disabled = (simulationMode === 'auto');
    selectRoom("living");

    setInterval(() => {
        // 1. Цикл дня/ночі
        const cycleResult = updateDayNightCycle();
        if (cycleResult.changed) {
            updateDayNightUI(cycleResult.isNight);
            printLog(cycleResult.isNight ? "Автоматичний перехід: Ніч" : "Автоматичний перехід: День");
        }

        // 2. Оновлення температури вулиці
        updateOutsideTemp();
        outsideTempLabel.innerText = outsideTemp;
        if(simulationMode === 'auto') outsideTempSlider.value = outsideTemp;

        // 3. Оновлення кімнат
        houseState.forEach(room => {
           updateIndicators(room);
           checkStateChanges(room);
        });
        
    }, 1000);
}