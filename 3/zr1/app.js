
const targetTempSlider = document.getElementById('target-temp-slider');
const targetTempLabel = document.getElementById('target-temp-val');
const targetHumidSlider = document.getElementById('target-humid-slider');
const targetHumidLabel = document.getElementById('target-humid-val');
const outsideTempSlider = document.getElementById('outside-temp-slider');
const outsideTempLabel = document.getElementById('outside-temp-val');
const detailRoomName = document.getElementById('detail-room-name');
const detailTemp = document.getElementById('detail-temp');
const detailHumidity = document.getElementById('detail-humidity');
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


roomElements.forEach(roomElem => {
    roomElem.addEventListener('click', function() {
        const cleanId = this.id.replace('room-', '');
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

}

function updateRoomVisuals(roomId, temp, humid) {
    const roomDiv = document.getElementById('room-' + roomId);
    const tempSpan = roomDiv.querySelector('#temp');
    const humidSpan = roomDiv.querySelector('#humid');

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


