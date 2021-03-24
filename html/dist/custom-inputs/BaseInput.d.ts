import { Listener } from "./Notifier.js";
export declare type Value = number | null | undefined;
export interface ICustomInput {
    destroy: () => void;
    hostElement: Readonly<HTMLElement> | null;
}
/**
 * Parent class for NumericInput and CalcInput widget classes
 */
export declare abstract class BaseInput implements ICustomInput {
    /**
     * Event types supported
     */
    static readonly TEXT_CHANGED = "textChanged";
    static readonly VALUE_CHANGED = "valueChanged";
    static readonly IS_VALID_CHANGED = "isValidChanged";
    static readonly LISTENER_TYPES: string[];
    static readonly FOCUS_CLASS = "custom-inputs_focus";
    static readonly INVALID_CLASS = "custom-inputs_invalid";
    static readonly FOCUS_INVALID_CLASS = "custom-inputs_focus-invalid";
    static readonly BORDER_CLASSES: string[];
    protected _hostElement: HTMLElement | null;
    private _notifier;
    protected _value: Value;
    protected _inputElement: HTMLInputElement | null;
    protected _focused: boolean;
    /**
     *
     * @param parent {DOM element | string}    Container element where the Widget is created in as a child
     * If parent is of string type it must be the value of ID attribute
     */
    constructor(parent: HTMLElement | string);
    protected abstract createContent(hostElement: HTMLElement): void;
    /**
     * Parse the input text
     */
    protected parse: () => void;
    protected abstract calcValue(): Value;
    protected abstract getBorderedElement(): HTMLElement;
    protected updateBorderStyle: () => void;
    /**
     * Widget read/only property
     *
     * @return {DOM element}    the element passed to the constuctor
     */
    get hostElement(): HTMLElement | null;
    /**
     * Widget read/write property
     *
     * @return {string}     the entered text
     */
    get text(): string;
    set text(val: string);
    /**
     * Widget read/only property
     *
     * @return {boolean}    true if entered text represents a valid number / expression
     */
    get isValid(): boolean;
    protected onTextChanged: () => void;
    protected onFocus: () => void;
    protected onBlur: () => void;
    /**
     * Add event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    addEventListener: (type: string, listener: Listener) => void;
    /**
     * Remove event listener
     * @param type {string}     type of the Event
     * @param listener {function(value)}    listener function
     */
    removeEventListener: (type: string, listener: Listener) => void;
    /**
     * Destroy Widget and Free resources
     */
    destroy: () => void;
}
