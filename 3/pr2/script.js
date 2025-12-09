function calculate(num1Str, num2Str, operation) {

    let result;
    let num1 = parseFloat(num1Str);
    let num2 = parseFloat(num2Str);

    if (parseFloat(num2Str) == 0 && operation != undefined) return "Error: Division by Zero";

    switch (operation) {

        case "+":
            result = num1 + num2;
            break;
        case "-":
            result = num1 - num2;
            break;
        case "*":
            result = num1 * num2;
            break;
        case "/":
            result = num1 / num2;
            break;

        default: return "Error"; break;

    }



    return result;

};



function perform() {

    let num1Str = document.getElementById("num1").value;

    let num2Str = document.getElementById("num2").value;

    let operation = document.getElementById("operation").value;

    result = calculate(num1Str, num2Str, operation);

    document.getElementById("result").innerText = result;
}