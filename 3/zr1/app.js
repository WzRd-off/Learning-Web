
const outsideTempSlider = document.getElementById('outside-temp-slider');
const targetHumidSlider = document.getElementById('target-humid-slider');
const targetTempSlider = document.getElementById('target-temp-slider');
const targetHumidLabel = document.getElementById('target-humid-val');
const outsideTempLabel = document.getElementById('outside-temp-val');
const targetTempLabel = document.getElementById('target-temp-val');
const detailRoomName = document.getElementById('detail-room-name');
const detailHumidity = document.getElementById('detail-humidity');
const Select = document.getElementById('day-night-select');
const detailTemp = document.getElementById('detail-temp');
const logArea = document.getElementById('log-container');
const houseGrid = document.getElementById('house-grid');
const roomElements = document.querySelectorAll('.room');

const lastStates = {};

let activeRoomId = 'living';

// Робота з повзунками
targetTempSlider.addEventListener('input', function() {
    targetTempLabel.innerText = targetTempSlider.value;
    const room = houseState.find(r => r.id === activeRoomId);
    if (room) {
        room.targetTemperature = Number(targetTempSlider.value);
    }
});

targetHumidSlider.addEventListener('input', function() {
    targetHumidLabel.innerText = targetHumidSlider.value;
    const room = houseState.find(r => r.id === activeRoomId);
    if (room) {
        room.targetHumidity = Number(targetHumidSlider.value);
    }
});

outsideTempSlider.addEventListener('input', function() {
    outsideTempLabel.innerText = outsideTempSlider.value;
    outsideTemp = Number(outsideTempSlider.value);
});

Select.addEventListener('input', function() {
    if (Select.value == 'day') {
        isNight = false;
        houseGrid.style.backgroundColor = '#fff5d7';
        printLog("Перемикання на денний режим");
    }
    else if (Select.value == 'night') {
        isNight = true;
        houseGrid.style.backgroundColor = '#252530';
        printLog("Перемикання на нічний режим");
    }
    else{
        printLog("Помиклка вибору часу");
    }
})

roomElements.forEach(roomElem => {
    roomElem.addEventListener('click', function() {
        const cleanId = this.id.replace('room-', '');
        registerMotion(cleanId);
        selectRoom(cleanId);
    });
});

function selectRoom(roomId) {
    activeRoomId = roomId;
    const roomData = houseState.find(room => room.id === roomId);

    if (!roomData) {
        printLog("Кімнату не знайдено в даних!");
        return;
    }

    detailRoomName.innerText = roomData.name;
    detailTemp.innerText = roomData.currentTemperature; 
    detailHumidity.innerText = roomData.currentHumidity;

    targetTempSlider.value = roomData.targetTemperature;
    targetTempLabel.innerText = roomData.targetTemperature;

    targetHumidSlider.value = roomData.targetHumidity;
    targetHumidLabel.innerText = roomData.targetHumidity;
    updateDeviceStatus(roomData);
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
        roomIcons.classList.add('ligth-font');
        roomTitle.classList.add('ligth-font');
    }
    else {
        room.classList.remove('ligth');
        roomIcons.classList.remove('ligth-font');
        roomTitle.classList.remove('ligth-font');
    }
}

function updateRoomVisuals(roomId, temp, humid) {
    const roomDiv = document.getElementById('room-' + roomId);
    const tempSpan = roomDiv.querySelector('#temp');
    const humidSpan = roomDiv.querySelector('#humid');

    const roomData = houseState.find(r => r.id === roomId);
    if (roomData) 
        updateRoomLigth(roomData);
        

    tempSpan.innerText = `🌡️ ${temp}°`;
    humidSpan.innerText = `💧 ${humid}%`;
    selectRoom(activeRoomId);

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
        const status = room.ligthON ? "УВІМКНЕНО" : "ВИМКНЕНО";
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
    printLog('Симуляція розпочато.');
    const startBtn = document.getElementById('start-sim-btn');
    startBtn.disabled = true;
    startBtn.textContent = 'Симуляція...';

    selectRoom("living");

    setInterval(() => {
        houseState.forEach(room => {
           updateIndicators(room);
           checkStateChanges(room);
        });
    }, 1000);
}



