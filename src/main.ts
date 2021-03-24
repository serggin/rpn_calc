import {NumericInput, CalcInput, ICustomInput, RPN} from "./custom-inputs/index.js";
//import {FormulaGenerator} from "./FormulaGenerator.js";

const buttons: HTMLButtonElement[]= [];
const customInputs: ICustomInput[] = [];
try {
    let numInput = new NumericInput('numInput');
    customInputs.push(numInput);

    numInput.addEventListener('textChanged', function (text) {
        //console.log('*** NumericInput In listener: text=', text);
        //console.log('numInput .text, .value, .isValid = ', numInput.text, numInput.value, numInput.isValid);
        updateNodeText('numInputText', text);
    })
    numInput.addEventListener('valueChanged', function ({value}) {
        //console.log('*** NumericInput In listener: value=', value);
        const content = value ? value.toString() : (value === undefined ? 'undefined' : 'null');
        updateNodeText('numInputValue', content);
    });
    numInput.addEventListener('isValidChanged', function (isValid) {
        //console.log('*** NumericInput In listener: isValid=', isValid);
        updateNodeText('numInputValid', isValid.toString());
    });

    let button: HTMLButtonElement = document.getElementById('numInputValueButton') as HTMLButtonElement;
    if (button) {
        button.onclick = () => {
            const input: HTMLInputElement = document.getElementById('numInputSetValue') as HTMLInputElement;
            if (input && input.value.length) {
                const value: number = Number(input.value);
                if (Number.isNaN(value)) {
                    alert(`${input.value} is not a number!`);
                } else {
                    numInput.value = value;
                }
            }
        };
        buttons.push(button);
    }

    button = document.getElementById('numInputTextButton') as HTMLButtonElement;
    if (button) {
        button.onclick = () => {
            const input: HTMLInputElement = document.getElementById('numInputSetText') as HTMLInputElement;
            if (input) {
                numInput.text = input.value;
            }
        };
        buttons.push(button);
    }
} catch (e) {
    console.error(e.message);
}

try {
    let calcInput = new CalcInput('calcInput');
    customInputs.push(calcInput);

    calcInput.addEventListener('textChanged', function (text) {
        //console.log('*** CalcInput In listener: text=', text);
        //console.log('calcInput .text, .value, .isValid = ', calcInput.text, calcInput.value, calcInput.isValid);
        updateNodeText('calcInputText', text);
    })
    calcInput.addEventListener('valueChanged', function ({value}) {
        //console.log('*** CalcInput In listener: value=', value);
        const content = value ? value.toString() : (value === undefined ? 'undefined' : 'null');
        updateNodeText('calcInputValue', content);
    });
    calcInput.addEventListener('isValidChanged', function (isValid) {
        //console.log('*** CalcInput In listener: isValid=', isValid);
        updateNodeText('calcInputValid', isValid.toString());
    });

    let button: HTMLButtonElement = document.getElementById('calcInputValueButton') as HTMLButtonElement;
    if (button) {
        button.onclick = () => {
            const input: HTMLInputElement = document.getElementById('calcInputSetValue') as HTMLInputElement;
            if (input && input.value.length) {
                const value: number = Number(input.value);
                if (Number.isNaN(value)) {
                    alert(`${input.value} is not a number!`);
                } else {
                    calcInput.value = value;
                }
            }
        };
        buttons.push(button);
    }

    button = document.getElementById('calcInputTextButton') as HTMLButtonElement;
    if (button) {
        button.onclick = () => {
            const input: HTMLInputElement = document.getElementById('calcInputSetText') as HTMLInputElement;
            if (input) {
                calcInput.text = input.value;
            }
        };
        buttons.push(button);
    }


} catch (e) {
    console.error(e.message);
}

try {
    let numInput = new NumericInput('numInputCS');
    customInputs.push(numInput);
} catch (e) {
    console.error(e.message);
}
try {
    let calcInput = new CalcInput('calcInputCS');
    customInputs.push(calcInput);
} catch (e) {
    console.error(e.message);
}

const destroyButton: HTMLButtonElement = document.getElementById('destroyButton') as HTMLButtonElement;
if (destroyButton) {
    destroyButton.onclick = function() {
        buttons.forEach((button) => {
            button.onclick = null;
        });
        buttons.splice(0, buttons.length);

        customInputs.forEach((customInput) => {
            const hostElement = customInput.hostElement;
            customInput.destroy();
            while (hostElement!.firstChild) {
                hostElement!.removeChild(hostElement!.firstChild);
            }
        });
        customInputs.splice(0, customInputs.length);
    }
}

function updateNodeText(id: string, text: string): void {
    const node = document.getElementById(id);
    if (node) {
        node.textContent = text;
    }
}

/**
 * FormulaGenerator & RPN demo
 */
/*
const formulaGenerator = new FormulaGenerator(3, 3, 10, 0);
const rpn = new RPN();
const total = 10;
let passed = 0;
console.log('================== Generated formulas test started =======================');
for (let i = 0; i < total; i += 1) {
    const formula = formulaGenerator.generate();
    rpn.change(formula);
    const value = rpn.value;
    const ev = eval(formula);
    if (ev === value) {
        passed ++;
        console.log(formula, value, ev);
    } else {
        console.error(formula, value, ev);
    }
}
console.log('================== Generated formulas test ended =======================');
const node = document.createTextNode(`${passed} of ${total}`);
const resultElement = document.getElementById('result');
resultElement!.appendChild(node);
*/
