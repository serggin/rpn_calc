import { BaseInput } from "./BaseInput.js";
/**
 * NumirecInput widget class
 */
export class NumericInput extends BaseInput {
    /**
     *
     * @param parent {DOM element | string}    Container element where the Widget is created in as a child
     * If parent is of string type it must be the value of ID attribute
     */
    constructor(parent) {
        super(parent);
        if (this._hostElement) {
            this.createContent(this._hostElement);
        }
    }
    /**
     * Create Widget elements
     * @param hostElement {DOM element}
     */
    createContent(hostElement) {
        let inputElement = document.createElement("INPUT");
        inputElement.type = 'text';
        inputElement.placeholder = 'Number value';
        inputElement.className = 'numeric-input';
        inputElement.oninput = this.onTextChanged;
        inputElement.onfocus = this.onFocus;
        inputElement.onblur = this.onBlur;
        this._inputElement = inputElement;
        hostElement.appendChild(this._inputElement);
    }
    getBorderedElement() {
        return this._inputElement;
    }
    calcValue() {
        if (this._inputElement.value.length === 0) {
            return null;
        }
        let value = Number(this._inputElement.value);
        if (Number.isNaN(value)) {
            value = undefined;
        }
        return value;
    }
    /**
     * Widget read/write property
     *
     * @return {number | null | undefined}     the evaluated result of the text entered to Widget
     */
    get value() {
        return this._value;
    }
    set value(val) {
        if (typeof val === 'number' && val !== this._value) {
            this.text = val.toString();
        }
    }
}
