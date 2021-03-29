import {BaseInput, Value} from './BaseInput.js';
import {RPN} from './RPN.js';

/**
 * CalcInput widget class
 */
export class CalcInput extends BaseInput {
    private _valueElement: HTMLSpanElement | null = null;
    private rpn: RPN = new RPN();
    private wrapperElement: HTMLElement | null = null;

    constructor(parent: HTMLElement | string) {
        super(parent);
        if (this._hostElement) {
            this.createContent(this._hostElement);
            this.rpn = new RPN();
        }
    }

    /**
     * Create Widget elements
     * @param hostElement {DOM element}
     */
    protected createContent (hostElement: HTMLElement): void {
        let wrapperElement = document.createElement("DIV") as HTMLElement;
        wrapperElement.className = 'calc-input-wrapper';

        let inputElement = document.createElement("INPUT") as HTMLInputElement;
        inputElement.type = 'text';
        inputElement.placeholder = 'Formula value';
        inputElement.className = 'calc-input';
        inputElement.oninput = this.onTextChanged;
        inputElement.onfocus = this.onFocus;
        inputElement.onblur = this.onBlur;
        this._inputElement = inputElement;
        wrapperElement.appendChild(inputElement);

        const valueWrapper = document.createElement("DIV") as HTMLDivElement;
        valueWrapper.className = 'calc-value-wrapper';
        let valueElement = document.createElement("SPAN") as HTMLSpanElement;
        valueElement.className = 'calc-value';
        this._valueElement = valueElement;
        valueWrapper.appendChild(valueElement);
        wrapperElement.appendChild(valueWrapper);

        hostElement.appendChild(wrapperElement);

        this.wrapperElement = wrapperElement;
    }

    protected getBorderedElement = (): HTMLElement => {
        return this.wrapperElement!;
    }

    /**
     * Parse the input text
     */
    protected parse(): void {
        super.parse();
        this.displayValue(this.value);
    }

    protected calcValue(): Value {
        let value: Value;
        if (this.text.length === 0) {
            value = null;
        } else {
            this.rpn.change(this.text);
            value = this.rpn.value;
            if (value === Infinity || value === -Infinity) {
                value = undefined;
            }
        }
        return value;
    }

    private displayValue(value: Value): void {
        const content = value || value === 0 ? value.toString() : (value === undefined ? '?' : '\u00A0');
        this._valueElement!.textContent = content;
    }

    /**
     * Widget read/write property
     *
     * @return {number | null | undefined}     the evaluated result of the formula entered to Widget
     */
    get value():Value {
        return this._value;
    }
    set value(val: Value) {
        if (typeof val === "number") {
            if (val !== this._value) {
                this.text = val.toString();
            }
        } else {
            throw new Error(`Invalid number value ${val}`);
        }
    }

}
