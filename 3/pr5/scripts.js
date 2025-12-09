let lightInstruction = [
    [5, "Red", "Green", "Red"],
    [2, "Yellow", "Yellow", "Yellow"],
    [6, "Green", "Red", "Green"]
]

const trafficLights = {
    A: document.getElementById('traffic-light-A'),
    B: document.getElementById('traffic-light-B'),
    C: document.getElementById('traffic-light-C')
};

const pauseButton = document.getElementById('pause-button');
const continueButton = document.getElementById('continue-button');
const backRunButton = document.getElementById('start-button');
let signalInputValue = null;

let flagPause = false;
let startIndex = 0;

function logMessage(message) {
    const logOutput = document.getElementById('log-output');
    const p = document.createElement('p');
    p.textContent = message;
    logOutput.appendChild(p);
    logOutput.scrollTop = logOutput.scrollHeight;
}

function updateTrafficLights(state) {

    for (const lightName in state) {
        const lightElement = trafficLights[lightName];
        if (lightElement) {
            lightElement.querySelectorAll('.light').forEach(light => {
                light.classList.remove('on');
            });

            const color = state[lightName].toLowerCase();
            const activeLight = lightElement.querySelector(`.${color}`);
            if (activeLight) {
                activeLight.classList.add('on');
            }
        }
    }
}

function handleEmergency(signal, state) {
    if (signal && typeof (signal) == "string") {
        if (signal.includes("пожежа") || signal.includes("вогонь")) {
            state['A'] = "Yellow";
        } else if (signal.includes("лікарня") || signal.includes("травма")) {
            state['B'] = "Yellow";
        } else {
            state['C'] = "Yellow";
        }
    } else {
        logMessage("Некоректний сигнал тривоги");
    }
}

function getUserConfig() {
    const text = document.getElementById('user-config').value;

    lightInstruction = [];

    const lines = text.split('\n');
    let addedCount = 0;

    for (const line of lines) {
        const cleanedLine = line.trim();

        if (cleanedLine.length > 0) {
            const words = cleanedLine.split(' ');

            if (words.length === 4) {
                words[0] = parseInt(words[0]);
                lightInstruction.push(words);
                addedCount++;
            } else {
                logMessage(`Пропущена некорректная строка: "${cleanedLine}". Ожидается 4 элемента.`);
            }
        }
    }

    logMessage(`Загружено ${addedCount} новых фаз. Общее количество фаз: ${lightInstruction.length}.`);
    console.log("Новая lightInstruction:", lightInstruction);
}

// Функція для затримки часу
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function pauseSimulation() {
    pauseButton.disabled = true;
    continueButton.disabled = false;
    pauseButton.style.backgroundColor = '#555555ff';
    flagPause = true;
}

function continueSimulation() {
    pauseButton.style.backgroundColor = '#f0ad4e';
    pauseButton.disabled = false;
    flagPause = false;
    runSimulationLoop();
}

function emergencySignal() {
    signalInputValue = document.getElementById('emergency-input').value.trim().toLowerCase();
    const signalInputElement = document.getElementById('emergency-input');
    signalInputElement.value = '';

}

async function runSimulationLoop() {

    let state = { A: "", B: "", C: "" };
    let yellowCCount = 0;
    const totalDuration = lightInstruction[0][0] + lightInstruction[1][0] + lightInstruction[2][0];

    for (let i = startIndex; i < 100; i++) {
        if (flagPause) {
            startIndex = i;
            break
        }

        await sleep(1000);

        const cyclPos = i % totalDuration;

        let cumDur = 0;
        let currentPhase = null;

        for (const phase of lightInstruction) {
            const phaseDuration = phase[0]
            if (cyclPos >= cumDur && cyclPos < cumDur + phaseDuration) {
                currentPhase = phase;
                break;
            }
            cumDur += phaseDuration
        }

        if (currentPhase) {
            state['A'] = currentPhase[1]
            state['B'] = currentPhase[2]
            state['C'] = currentPhase[3]
        }

        if (signalInputValue != null) {
            handleEmergency(signalInputValue, state);
            signalInputValue = null;
        }

        logMessage(`Цикл ${i + 1}: A: ${state.A}, B: ${state.B}, C: ${state.C}`);
        updateTrafficLights(state);

    }

    if (flagPause) return;

    const finalResults = document.getElementById('final-results');
    finalResults.innerHTML = `
        <h3>Результаты симуляции:</h3>
        <p>Кінець симуляції</p>
        <p>Світлофор С був жовтим ${yellowCCount} разів.</p>
    `;

    backRunButton.disabled = false;
    backRunButton.textContent = 'Запустити симуляцію';
    backRunButton.style.backgroundColor = '#4CAF50';
}

function startSimulation() {
    document.getElementById('log-output').innerHTML = '';
    document.getElementById('final-results').innerHTML = '';

    backRunButton.disabled = true;
    backRunButton.textContent = 'Симуляція...';
    backRunButton.style.backgroundColor = '#555555ff';

    startIndex = 0;
    flagPause = false;

    runSimulationLoop();
}