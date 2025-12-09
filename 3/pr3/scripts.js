
const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons-grid .btn');
let currentInput = '';

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        if (button.classList.contains('number') || button.classList.contains('dot')) {
            currentInput += value;
            display.value = currentInput;
        } else if (button.classList.contains('operator')) {
            if (currentInput !== '') {
                const lastChart = currentInput.slice(-1);
                if ('+-*/'.includes(lastChart))
                    currentInput = currentInput.slice(0, -1) + value;
                else
                    currentInput += value;
                display.value = currentInput;
            }
        } else if (value === 'C') {
            currentInput = '';
            display.value = '';
        } else if (value === '⌫') {
            currentInput = currentInput.slice(0, -1);
            display.value = currentInput;
        } else if (value === 'CE') {
            const parts = currentInput.match(/(\-?\d+\.?\d*|\-?\.\d+)([+\-*/])?(\-?\d+\.?\d*)?/);
            if (parts && parts[3]) {
                currentInput = parts[1] + parts[2];
            } else if (parts && parts[1]) {
                currentInput = '';
            }
            display.value = currentInput;
        } else if (value === '=') {
            try {
                const result = eval(currentInput);
                display.value = result;
                currentInput = result.toString();
            } catch (e) {
                display.value = 'Error';
                currentInput = '';
            }
        } else if (value === '%') {
            try {
                const result = eval(currentInput) / 100;
                display.value = result;
                currentInput = result.toString();
            } catch (e) {
                display.value = 'Error';
                currentInput = '';
            }
        } else if (value === '¹/ₓ') {
            try {
                const number = parseFloat(currentInput);
                if (number === 0) throw new Error('Division by zero');
                const result = 1 / number;
                display.value = result;
                currentInput = result.toString();
            } catch (e) {
                display.value = 'Error';
                currentInput = '';
            }
        } else if (value === 'x²') {
            try {
                const number = parseFloat(currentInput);
                const result = number * number;
                display.value = result;
                currentInput = result.toString();
            } catch (e) {
                display.value = 'Error';
                currentInput = '';
            }
        } else if (value === '²√x') {
            try {
                const number = parseFloat(currentInput);
                if (number < 0) throw new Error('Invalid input for square root');
                const result = Math.sqrt(number);
                display.value = result;
                currentInput = result.toString();
            } catch (e) {
                display.value = 'Error';
                currentInput = '';
            }
        } else if (value === '+/-') {
            try {
                const number = parseFloat(currentInput);
                const result = -number;
                display.value = result;
                currentInput = result.toString();
            } catch (e) {
                display.value = 'Error';
                currentInput = '';
            }
        }
    });
});

/**
 * @param {string} text
 * @returns {Array<Array<number>>}
 */
function parseMatrix(text) {
    return text.trim().split('\n').map(row => row.trim().split(/\s+/).map(Number));
}

window.calculateMatrix = function (operation) {
    const matrixAValue = document.getElementById('matrixA').value;
    const matrixBValue = document.getElementById('matrixB').value;
    const resultDisplay = document.getElementById('matrixResult');

    try {
        const A = parseMatrix(matrixAValue);
        const B = parseMatrix(matrixBValue);

        let resultMatrix;

        if (operation === 'transposeA') {
            if (!A[0]) throw new Error('Матриця A пуста.');
            resultMatrix = A.map((_, colIndex) => A.map(row => row[colIndex]));
        } else {
            const rowsA = A.length;
            const colsA = A[0].length;
            const rowsB = B.length;
            const colsB = B[0].length;

            if (operation === 'add' || operation === 'subtract') {
                if (rowsA !== rowsB || colsA !== colsB) {
                    throw new Error('Для додавання/різниці матриці мають бути однакового разміра.');
                }
                resultMatrix = A.map((row, i) => row.map((val, j) => {
                    if (operation === 'add') return val + B[i][j];
                    return val - B[i][j];
                }));
            } else if (operation === 'multiply') {
                if (colsA !== rowsB) {
                    throw new Error('Для множення число столбців A має бути = числу строк B.');
                }
                resultMatrix = Array.from({ length: rowsA }, () => Array(colsB).fill(0));
                for (let i = 0; i < rowsA; i++) {
                    for (let j = 0; j < colsB; j++) {
                        for (let k = 0; k < colsA; k++) {
                            resultMatrix[i][j] += A[i][k] * B[k][j];
                        }
                    }
                }
            }
        }

        resultDisplay.textContent = resultMatrix.map(row => row.join('\t')).join('\n');
    } catch (e) {
        resultDisplay.textContent = `Ошибка: ${e.message}`;
    }
};
