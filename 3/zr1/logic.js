let houseState = 
[
    {
        id: "living",
        name: "Вітальня",
        currentTemperature: 22.0,
        currentHumidity: 45,
        targetTemperature: 23.0,
        targetHumidity: 50,
        ligthON: false,
        heaterON: false,
        acON: false, 
        humidifierON: false,
        lastActivity: 0,
        specialDevices: [
            { id: 'tv', name: 'Smart TV 📺', active: false },
            { id: 'audio', name: 'Аудіо 🎵', active: false }
        ]
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
        lastActivity: 0,
        specialDevices: [
            { id: 'coffee', name: 'Кавомашина ☕', active: false },
            { id: 'fridge', name: 'Режим Super Freeze ❄️', active: false }
        ]
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
        lastActivity: 0,
        specialDevices: [
            { id: 'blinds', name: 'Розумні Жалюзі 🪟', active: false }
        ]
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
        lastActivity: 0,
        specialDevices: [
            { id: 'towel', name: 'Сушарка рушників 🧣', active: false }
        ]
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
        lastActivity: 0,
        specialDevices: []
    },
]

let isNight = false;      
let isArmed = false; 
let isAlarmTriggered = false;     
let outsideTemp = 10;    
let simulationTime = 0;
let simulationMode = 'auto'; 

function registerMotion(roomId) {
    // Якщо увімкнена охорона - спрацьовує тривога
    if (isArmed) {
        isAlarmTriggered = true;
        return; // Далі нічого не робимо, тривога блокує звичайну роботу
    }

    const room = houseState.find(r => r.id === roomId);
    if (room) {
        room.lastActivity = Date.now();      
        if (isNight) 
            room.ligthON = true;
    }
}

function toggleSpecialDevice(roomId, deviceId) {
    const room = houseState.find(r => r.id === roomId);
    if (room && room.specialDevices) {
        const device = room.specialDevices.find(d => d.id === deviceId);
        if (device) {
            device.active = !device.active;
            return device; // Повертаємо змінений девайс для логування
        }
    }
    return null;
}

function updateDayNightCycle() {
    simulationTime++;
    // Зміна дня і ночі кожні 20 "тіків" таймера
    if (simulationTime % 20 === 0) {
        isNight = !isNight;
        // Повертаємо об'єкт для обробки в app.js (щоб не лізти в DOM тут)
        return { changed: true, isNight: isNight }; 
    }
    return { changed: false };
}

function updateOutsideTemp() {
    // Якщо режим ручний - температуру не міняємо програмно
    if (simulationMode === 'manual') return;

    let tempChange = 0;
    const isUp = Math.round(Math.random());
    
    // Вночі холодніше, вдень тепліше
    if(isNight) {
        tempChange = isUp ? 0.1 : -0.2;
    }
    else {
        tempChange = isUp ? 0.2 : -0.1;
    }
    outsideTemp = parseFloat((outsideTemp + tempChange).toFixed(1));
}

function updateIndicators(room) {
    // Температура
    
    let tempChange = 0;

    if (room.currentTemperature > outsideTemp) tempChange -= 0.02;
    if (room.currentTemperature < outsideTemp) tempChange += 0.02;

    if (room.currentTemperature < room.targetTemperature) {
        tempChange += 0.1; 
        room.heaterON = true;
        room.acON = false;
    }
    else if (room.currentTemperature > room.targetTemperature) {
        tempChange -= 0.1; 
        room.heaterON = false;
        room.acON = true;
    }
    else {
        room.heaterON = false;
        room.acON = false;
    }
    room.currentTemperature = parseFloat((room.currentTemperature + tempChange).toFixed(1));

    // Вологость
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
    room.currentHumidity = Math.min(100, Math.max(0, room.currentHumidity + humidChange));

    // Світло
    if (room.ligthON) {
        if (!isNight) 
            room.ligthON = false; // Вдень світло не потрібне
        if (Date.now() - room.lastActivity > 10000) 
            room.ligthON = false; // Таймер 10 сек
    }  
    
    // Повертаємо дані для візуалізації
    updateRoomVisuals(room.id, room.currentTemperature, room.currentHumidity);
}