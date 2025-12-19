let houseState = 
[
    {
        id: "living",
        name: " Вітальня",
        currentTemperature: 22.0,
        currentHumidity: 45,
        targetTemperature: 23.0,
        targetHumidity: 50,
        ligthON: false,
        heaterON: false,
        acON: false, 
        humidifierON: false,
        lastActivity: 0
    },
    {
        id: "kitchen",
        name: "Кухня",
        currentTemperature: 22.5,
        currentHumidity: 45,
        targetTemperature: 21.0,
        targetHumidity: 50,
        ligthON: false,
        heaterON: false,
        acON: false, 
        humidifierON: false,
        lastActivity: 0
    },
        {
        id: "bedroom",
        name: "Спальня",
        currentTemperature: 24.0,
        currentHumidity: 45,
        targetTemperature: 22.0,
        targetHumidity: 50,
        ligthON: false,
        heaterON: false,
        acON: false, 
        humidifierON: false,
        lastActivity: 0
    },
        {
        id: "bathroom",
        name: "Ванна",
        currentTemperature: 22.0,
        currentHumidity: 35,
        targetTemperature: 25.0,
        targetHumidity: 55,
        ligthON: false,
        heaterON: false,
        acON: false, 
        humidifierON: false,
        lastActivity: 0
    },
        {
        id: "hall",
        name: "Коридор",
        currentTemperature: 17.0,
        currentHumidity: 35,
        targetTemperature: 20.0,
        targetHumidity: 40,
        ligthON: false,
        heaterON: false,
        acON: false, 
        humidifierON: false,
        lastActivity: 0
    },
]

let isNight = false;      
let isArmed = false;      
let outsideTemp = 10;    
let simulationTime = 0;

function registerMotion(roomId) {
    const room = houseState.find(r => r.id === roomId);
    if (room) {
        room.lastActivity = Date.now();      
        if (isNight) 
            room.ligthON = true;
    }
}

function updateDayNightCycle() {
    simulationTime++;
    if (simulationTime % 20 === 0) {
        isNight = !isNight;
        if (isNight) {
            houseGrid.style.backgroundColor = '#252530';
            Select.value = 'night';
            printLog("Автоматичне перемикання на нічний режим");
        } else {
            houseGrid.style.backgroundColor = '#fff5d7';
            Select.value = 'day';
            printLog("Автоматичне перемикання на денний режим");
        }   
    }
}

function updateOutsideTemp() {
    let tempChange = 0;
    const isUp = Math.round(Math.random());
    if(isNight) {
        tempChange = isUp ? 0.1 : -0.2;
    }
    else {
        tempChange = isUp ? 0.2 : -0.1;
    }
    outsideTemp = parseFloat((outsideTemp + tempChange).toFixed(1));
    outsideTempLabel.innerText = outsideTemp;
}

function updateIndicators(room) {
    let tempChange = 0;
    if (room.currentTemperature < room.targetTemperature) {
        tempChange = 0.1;
        room.heaterON = true;
        room.acON = false;
    }
    else if (room.currentTemperature > room.targetTemperature) {
        tempChange = -0.1;
        room.heaterON = false;
        room.acON = true;
    }
    else {
        room.heaterON = false;
        room.acON = false;
    }
    room.currentTemperature = parseFloat((room.currentTemperature + tempChange).toFixed(1));

    let humidChange = 0;
    if (room.currentHumidity < room.targetHumidity) {
        humidChange = 1;
        room.humidifierON = true;
    }
    else if (room.currentHumidity > room.targetHumidity) {
        humidChange = -1;
        room.humidifierON = false;
    }
    else {
        room.humidifierON = false;
    }

    if (room.ligthON) {
        if (!isNight) 
            room.ligthON = false;
        if (Date.now() - room.lastActivity > 10000) 
            room.ligthON = false;
    }  
    room.currentHumidity = Math.min(100, Math.max(0, room.currentHumidity + humidChange));
    updateRoomVisuals(room.id, room.currentTemperature, room.currentHumidity);
}
