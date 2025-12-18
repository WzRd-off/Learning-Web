
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
const roomElements = document.querySelectorAll('.room');

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
    }
    else if (Select.value == 'night') {
        isNight = true;
        houseGrid.style.backgroundColor = '#252530';
    }
    else{
        alert("Помиклка вибору часу");
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
        console.error("Кімнату не знайдено в даних!");
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
    const room = document.getElementById('room-' + roomData.id)
    if(roomData.ligthON) {
        room.classList.add('ligth');
    }
    else {
        room.classList.remove('ligth');
    }
}

function updateRoomVisuals(roomId, temp, humid) {
    const roomDiv = document.getElementById('room-' + roomId);
    const tempSpan = roomDiv.querySelector('#temp');
    const humidSpan = roomDiv.querySelector('#humid');

    const roomData = houseState.find(r => r.id === roomId);
    if (roomData) {
        updateRoomLigth(roomData);
        
        if (activeRoomId === roomId) {
             updateDeviceStatus(roomData); 
        }
    }

    tempSpan.innerText = `🌡️ ${temp}°`;
    humidSpan.innerText = `💧 ${humid}%`;
    selectRoom(activeRoomId);

}

function startSimulation() {
    
    const startBtn = document.getElementById('start-sim-btn');
    startBtn.disabled = true;
    startBtn.textContent = 'Симуляція...';

    selectRoom("living");

    setInterval(() => {
        houseState.forEach(room => {
           updateIndicators(room);
        });
    }, 1000);

}


