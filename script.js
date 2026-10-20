// 1. Select the HTML elements
const calculatorButtons = document.querySelector("#calculator-buttons");
const resultDisplay = document.querySelector("#result-display");
const expressionDisplay = document.querySelector("#expression-display");
const calculatorMessage = document.querySelector("#calculator-message");

// 2. Create variables to store the calculator's state
let currentInput = "0";
let previousInput = null;
let operator = null;
let shouldResetScreen = false;

// 3. Display a number in a clean format
function formatNumber(number) {
  if (!Number.isFinite(number)) {
    return "Error";
  }

  return String(Number(number.toPrecision(12)));
}

// 4. Update the calculator display
function updateDisplay() {
  resultDisplay.textContent = currentInput;
}

// 5. Add a number to the current input
function inputNumber(number) {
  if (currentInput === "Error") {
    clearCalculator();
  }

  if (shouldResetScreen) {
    currentInput = number;
    shouldResetScreen = false;
  } else if (currentInput === "0") {
    currentInput = number;
  } else if (currentInput.length < 15) {
    currentInput += number;
  }

  calculatorMessage.textContent = "Entering number...";
  updateDisplay();
}

// 6. Add a decimal point
function inputDecimal() {
  if (currentInput === "Error") {
    clearCalculator();
  }

  if (shouldResetScreen) {
    currentInput = "0.";
    shouldResetScreen = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }

  updateDisplay();
}

// 7. Choose a mathematical operator
function chooseOperator(selectedOperator) {
  if (currentInput === "Error") {
    clearCalculator();
  }

  if (operator !== null && !shouldResetScreen) {
    calculate();
  }

  previousInput = currentInput;
  operator = selectedOperator;
  shouldResetScreen = true;

  const symbol = getOperatorSymbol(operator);

  expressionDisplay.textContent =
    `${previousInput} ${symbol}`;

  calculatorMessage.textContent = "Choose the next number";
}

// 8. Convert operator symbols for the display
function getOperatorSymbol(selectedOperator) {
  const symbols = {
    "+": "+",
    "-": "−",
    "*": "×",
    "/": "÷"
  };

  return symbols[selectedOperator];
}

// 9. Perform the calculation
function calculate() {
  if (operator === null || previousInput === null) {
    return;
  }

  const firstNumber = Number(previousInput);
  const secondNumber = Number(currentInput);
  const selectedOperator = operator;

  let result;

  if (selectedOperator === "+") {
    result = firstNumber + secondNumber;
  } else if (selectedOperator === "-") {
    result = firstNumber - secondNumber;
  } else if (selectedOperator === "*") {
    result = firstNumber * secondNumber;
  } else if (selectedOperator === "/") {
    if (secondNumber === 0) {
      currentInput = "Error";
      resultDisplay.textContent = currentInput;
      expressionDisplay.textContent = "Cannot divide by zero";
      calculatorMessage.textContent = "Try another calculation";

      previousInput = null;
      operator = null;
      shouldResetScreen = true;
      return;
    }

    result = firstNumber / secondNumber;
  }

  const formattedResult = formatNumber(result);

  expressionDisplay.textContent =
    `${previousInput} ${getOperatorSymbol(selectedOperator)} ${currentInput} =`;

  currentInput = formattedResult;
  previousInput = null;
  operator = null;
  shouldResetScreen = true;

  calculatorMessage.textContent = "Calculation complete";
  updateDisplay();
}

// 10. Clear everything and start again
function clearCalculator() {
  currentInput = "0";
  previousInput = null;
  operator = null;
  shouldResetScreen = false;

  expressionDisplay.textContent = "";
  calculatorMessage.textContent = "Ready for your calculation";

  updateDisplay();
}

// 11. Delete the last digit
function deleteDigit() {
  if (currentInput === "Error") {
    clearCalculator();
    return;
  }

  if (shouldResetScreen) {
    return;
  }

  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);

    if (currentInput === "-") {
      currentInput = "0";
    }
  } else {
    currentInput = "0";
  }

  updateDisplay();
}

// 12. Change the number's positive or negative sign
function changeSign() {
  if (currentInput === "Error") {
    clearCalculator();
  }

  if (currentInput !== "0") {
    currentInput = String(Number(currentInput) * -1);
  }

  shouldResetScreen = false;
  updateDisplay();
}

// 13. Convert the current number into a percentage
function calculatePercentage() {
  if (currentInput === "Error") {
    clearCalculator();
  }

  currentInput = formatNumber(Number(currentInput) / 100);
  shouldResetScreen = false;

  updateDisplay();
  calculatorMessage.textContent = "Percentage calculated";
}

// 14. Listen for calculator button clicks
calculatorButtons.addEventListener("click", function (event) {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  // Handle number buttons
  if (button.dataset.number !== undefined) {
    inputNumber(button.dataset.number);
    return;
  }

  // Handle action buttons
  const action = button.dataset.action;

  if (action === "clear") {
    clearCalculator();
  } else if (action === "delete") {
    deleteDigit();
  } else if (action === "decimal") {
    inputDecimal();
  } else if (action === "sign") {
    changeSign();
  } else if (action === "percent") {
    calculatePercentage();
  } else if (action === "equals") {
    calculate();
  } else if (action === "operator") {
    chooseOperator(button.dataset.operator);
  }
});

// 15. Allow keyboard input as well
document.addEventListener("keydown", function (event) {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    inputNumber(key);
  } else if (key === ".") {
    inputDecimal();
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "Enter" || key === "=") {
    event.preventDefault();
    calculate();
  } else if (key === "Backspace") {
    deleteDigit();
  } else if (key === "Escape") {
    clearCalculator();
  } else if (key === "%") {
    calculatePercentage();
  }
});

// 16. Initialize the calculator
updateDisplay();