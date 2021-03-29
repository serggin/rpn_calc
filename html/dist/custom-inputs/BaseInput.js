import { Notifier } from "./Notifier.js";
;
/**
 * Parent class for NumericInput and CalcInput widget classes
 */
export class BaseInput {
    /**
     *
     * @param parent {DOM element | string}    Container element where the Widget is created in as a child
     * If parent is of string type it must be the value of ID attribute
     */
    constructor(parent) {
        this._hostElement = null;
        this._notifier = null;
        this._value = null;
        this._inputElement = null;
        this._focused = false;
        this.updateBorderStyle = () => {
            let borderClass;
            if (this.isValid || this.text.length === 0) {
                borderClass = this._focused ? BaseInput.FOCUS_CLASS : '';
            }
            else {
                borderClass = this._focused ? BaseInput.FOCUS_INVALID_CLASS : BaseInput.INVALID_CLASS;
            }
            const borderedElement = this.getBorderedElement();
            borderedElement.classList.remove(...BaseInput.BORDER_CLASSES);
            if (borderClass.length) {
                borderedElement.classList.add(borderClass);
            }
        };
        this.onTextChanged = () => {
            this.parse();
            this._notifier.dispatch(new CustomEvent(BaseInput.TEXT_CHANGED, {
                detail: this._inputElement.value,
            }));
        };
        this.onFocus = () => {
            //console.log('onFocus()', this);
            //console.log('onFocus()', this, this.getBorderedElement());
            this._focused = true;
            this.updateBorderStyle();
        };
        this.onBlur = () => {
            this._focused = false;
            this.updateBorderStyle();
        };
        if (typeof parent === 'string') {
            this._hostElement = document.getElementById(parent);
        }
        else if (parent instanceof HTMLElement) {
            this._hostElement = parent;
        }
        if (this._hostElement) {
            while (this._hostElement.firstChild) {
                this._hostElement.removeChild(this._hostElement.firstChild);
            }
            //            this.createContent(this._hostElement);
            this._notifier = new Notifier(BaseInput.LISTENER_TYPES);
        }
        else {
            throw new Error('Invalid parent');
        }
    }
    /**
     * Parse the input text
     */
    parse() {
        const oldIsValid = this.isValid;
        const value = this.calcValue();
        if (value !== this._value) {
            this._value = value;
            const event = new CustomEvent(BaseInput.VALUE_CHANGED, {
                detail: { value },
            });
            this._notifier.dispatch(event);
        }
        if (oldIsValid !== this.isValid) {
            this._notifier.dispatch(new CustomEvent(BaseInput.IS_VALID_CHANGED, {
                detail: this.isValid,
            }));
        }
        this.updateBorderStyle();
    }
    /**
     * Widget read/only property
     *
     * @return {DOM element}    the element passed to the constuctor
     */
    get hostElement() {
        return this._hostElement;
    }
    /**
     * Widget read/write property
     *
     * @return {string}     the entered text
     */
    get text() {
        return this._inputElement.value;
    }
    set text(val) {
        if (val !== this.text) {
            this._inputElement.value = val;
            this.onTextChanged();
        }
    }
    /**
     * Widget read/only property
     *
     * @return {boolean}    true if entered text represents a valid number / expression
     */
    get isValid() {
        return this._value !== undefined && this._value !== null;
    }
    /**
     * Add event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    addEventListener(type, listener) {
        if (BaseInput.LISTENER_TYPES.indexOf(type) > -1) {
            this._notifier.addEventListener(type, listener);
        }
    }
    /**
     * Remove event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    removeEventListener(type, listener) {
        if (BaseInput.LISTENER_TYPES.indexOf(type) > -1) {
            this._notifier.removeEventListener(type, listener);
        }
    }
    /**
     * Destroy Widget and Free resources
     */
    destroy() {
        this._notifier.destroy();
        this._notifier = null;
        while (this._hostElement && this._hostElement.firstChild) {
            this._hostElement.removeChild(this._hostElement.firstChild);
        }
    }
}
/**
 * Event types supported
 */
BaseInput.TEXT_CHANGED = 'textChanged';
BaseInput.VALUE_CHANGED = 'valueChanged';
BaseInput.IS_VALID_CHANGED = 'isValidChanged';
BaseInput.LISTENER_TYPES = [BaseInput.TEXT_CHANGED, BaseInput.VALUE_CHANGED, BaseInput.IS_VALID_CHANGED];
BaseInput.FOCUS_CLASS = 'custom-inputs_focus';
BaseInput.INVALID_CLASS = 'custom-inputs_invalid';
BaseInput.FOCUS_INVALID_CLASS = 'custom-inputs_focus-invalid';
BaseInput.BORDER_CLASSES = [BaseInput.FOCUS_CLASS, BaseInput.FOCUS_INVALID_CLASS, BaseInput.INVALID_CLASS];
