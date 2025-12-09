const colors = ["Red", "Yellow", "Green"];

const trafficLights = {
    A: document.getElementById('traffic-light-A'),
    B: document.getElementById('traffic-light-B'),
    C: document.getElementById('traffic-light-C')
};

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
            state['A'] = colors[1];
        } else if (signal.includes("лікарня") || signal.includes("травма")) {
            state['B'] = colors[1];
        } else {
            state['C'] = colors[1];
        }
    } else {
        logMessage("Гей, особливо обдарований! Некоректний сигнал тривоги");
    }
}
// Функція для затримки часу
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const backRunButton = document.getElementById('start-button');

async function runFullSimulation() {
    document.getElementById('log-output').innerHTML = '';
    document.getElementById('final-results').innerHTML = '';


    backRunButton.disabled = true;
    backRunButton.textContent = 'Симуляція...';
    backRunButton.style.backgroundColor = '#555555ff';


    let state = { A: "", B: "", C: "" };
    let yellowCCount = 0;
    const totalDuration = 5 + 2 + 6;

    for (let i = 0; i < 100; i++) {

        await sleep(1000);

        const cyclPos = i % totalDuration;

        // A Светофор
        if (cyclPos < 5) {
            state['A'] = colors[0];
        } else if (cyclPos < 7) {
            state['A'] = colors[1];
        } else {
            state['A'] = colors[2];
        }

        // B Светофор
        if (state['A'] === colors[0]) {
            state['B'] = colors[2];
        } else if (state['A'] === colors[2]) {
            state['B'] = colors[0];
        } else {
            state['B'] = colors[1];
        }

        // C Светофор
        if (state['A'] === colors[2] && state['B'] === colors[0]) {
            state['C'] = colors[1];
        } else if (state['A'] === colors[2]) {
            state['C'] = colors[0];
        } else if (state['B'] === colors[0]) {
            state['C'] = colors[2];
        } else {
            state['C'] = colors[0];
        }

        if (i === 37) {
            handleEmergency("На перехресті пожежа", state);
        }
        if (i === 65) {
            handleEmergency(2, state);
        }

        if (state['C'] === 'Yellow') {
            yellowCCount++;
        }

        logMessage(`Цикл ${i + 1}: A: ${state.A}, B: ${state.B}, C: ${state.C}`);
        updateTrafficLights(state);

    }

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
