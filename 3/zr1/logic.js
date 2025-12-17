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

function updateTemperature(room) {
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
    updateRoomVisuals(room.id, room.currentTemperature);
}

function updateHumidity(room) {
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
    updateRoomVisuals(room.id, room.currentHumidity);
}
