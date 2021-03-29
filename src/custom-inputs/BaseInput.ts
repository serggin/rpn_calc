import {Notifier, Listener} from "./Notifier.js";

export type Value = number | null | undefined;
export interface ICustomInput {
    destroy: () => void;
    hostElement: Readonly<HTMLElement> | null;
};

/**
 * Parent class for NumericInput and CalcInput widget classes
 */
export abstract class BaseInput implements ICustomInput{
    /**
     * Event types supported
     */
    static readonly TEXT_CHANGED = 'textChanged';
    static readonly VALUE_CHANGED = 'valueChanged';
    static readonly IS_VALID_CHANGED = 'isValidChanged';

    static readonly LISTENER_TYPES = [BaseInput.TEXT_CHANGED, BaseInput.VALUE_CHANGED, BaseInput.IS_VALID_CHANGED];

    static readonly FOCUS_CLASS = 'custom-inputs_focus';
    static readonly INVALID_CLASS = 'custom-inputs_invalid';
    static readonly FOCUS_INVALID_CLASS = 'custom-inputs_focus-invalid';
    static readonly BORDER_CLASSES = [BaseInput.FOCUS_CLASS, BaseInput.FOCUS_INVALID_CLASS, BaseInput.INVALID_CLASS];

    protected _hostElement: HTMLElement | null = null;
    private _notifier: Notifier | null = null;
    protected _value: Value = null;
    protected _inputElement: HTMLInputElement | null = null;
    protected _focused: boolean = false;

    /**
     *
     * @param parent {DOM element | string}    Container element where the Widget is created in as a child
     * If parent is of string type it must be the value of ID attribute
     */
    constructor(parent: HTMLElement | string) {
        if (typeof parent === 'string') {
            this._hostElement = document.getElementById(parent);
        } else if (parent instanceof HTMLElement) {
            this._hostElement = parent;
        }
        if (this._hostElement) {
            while (this._hostElement.firstChild) {
                this._hostElement.removeChild(this._hostElement.firstChild);
            }
//            this.createContent(this._hostElement);
            this._notifier = new Notifier(BaseInput.LISTENER_TYPES);
        } else {
            throw new Error('Invalid parent');
        }
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onTextChanged = this.onTextChanged.bind(this);
    }

    protected abstract createContent(hostElement: HTMLElement): void;

    /**
     * Parse the input text
     */
    protected parse(): void {
        const oldIsValid = this.isValid;
        const value = this.calcValue();
        if (value !== this._value) {
            this._value = value;
            const event = new CustomEvent(BaseInput.VALUE_CHANGED, {
                detail: {value},
            });
            this._notifier!.dispatch(event);
        }
        if (oldIsValid !== this.isValid) {
            this._notifier!.dispatch(new CustomEvent(BaseInput.IS_VALID_CHANGED, {
                detail: this.isValid,
            }));
        }
        this.updateBorderStyle();
    }

    protected abstract calcValue(): Value;

    protected abstract getBorderedElement(): HTMLElement;

    protected updateBorderStyle(): void {
        let borderClass: string;
        if (this.isValid || this.text.length === 0) {
            borderClass = this._focused ? BaseInput.FOCUS_CLASS : '';
        } else {
            borderClass = this._focused ? BaseInput.FOCUS_INVALID_CLASS : BaseInput.INVALID_CLASS;
        }
        const borderedElement = this.getBorderedElement();
        borderedElement.classList.remove(...BaseInput.BORDER_CLASSES);
        if (borderClass.length) {
            borderedElement.classList.add(borderClass);
        }
    }

    /**
     * Widget read/only property
     *
     * @return {DOM element}    the element passed to the constuctor
     */
    get hostElement(): HTMLElement | null {
        return this._hostElement;
    }

    /**
     * Widget read/write property
     *
     * @return {string}     the entered text
     */
    get text(): string {
        return this._inputElement!.value;
    }
    set text(val: string) {
        if (val !== this.text) {
            this._inputElement!.value = val;
            this.onTextChanged();
        }
    }

    /**
     * Widget read/only property
     *
     * @return {boolean}    true if entered text represents a valid number / expression
     */
    get isValid(): boolean {
        return this._value !== undefined && this._value !== null;
    }

    /**
     * Widget read/write property
     *
     * @return {number | null | undefined}     the evaluated result of the text entered to Widget
     */
    abstract get value(): Value;
    abstract set value(val: Value);

    protected onTextChanged(): void {
        this.parse();
        this._notifier!.dispatch(new CustomEvent(BaseInput.TEXT_CHANGED, {
            detail: this._inputElement!.value,
        }));
    }

    protected onFocus(): void {
        this._focused = true;
        this.updateBorderStyle();
    }
    protected onBlur(): void {
        this._focused = false;
        this.updateBorderStyle();
    }

    /**
     * Add event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    addEventListener(type: string, listener: Listener):void {
        if (BaseInput.LISTENER_TYPES.indexOf(type) > -1) {
            this._notifier!.addEventListener(type, listener);
        }
    }

    /**
     * Remove event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    removeEventListener(type: string, listener: Listener): void {
        if (BaseInput.LISTENER_TYPES.indexOf(type) > -1) {
            this._notifier!.removeEventListener(type, listener);
        }
    }

    /**
     * Destroy Widget and Free resources
     */
    destroy(): void {
        this._notifier!.destroy();
        this._notifier = null;
        while (this._hostElement && this._hostElement.firstChild) {
            this._hostElement.removeChild(this._hostElement.firstChild);
        }
    }
}
