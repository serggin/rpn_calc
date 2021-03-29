import { BaseInput, Value } from './BaseInput.js';
/**
 * CalcInput widget class
 */
export declare class CalcInput extends BaseInput {
    private _valueElement;
    private rpn;
    private wrapperElement;
    constructor(parent: HTMLElement | string);
    /**
     * Create Widget elements
     * @param hostElement {DOM element}
     */
    protected createContent(hostElement: HTMLElement): void;
    protected getBorderedElement: () => HTMLElement;
    /**
     * Parse the input text
     */
    protected parse(): void;
    protected calcValue(): Value;
    private displayValue;
    /**
     * Widget read/write property
     *
     * @return {number | null | undefined}     the evaluated result of the formula entered to Widget
     */
    get value(): Value;
    set value(val: Value);
}
