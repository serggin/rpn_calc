import { BaseInput, Value } from "./BaseInput.js";
/**
 * NumirecInput widget class
 */
export declare class NumericInput extends BaseInput {
    /**
     *
     * @param parent {DOM element | string}    Container element where the Widget is created in as a child
     * If parent is of string type it must be the value of ID attribute
     */
    constructor(parent: HTMLElement | string);
    /**
     * Create Widget elements
     * @param hostElement {DOM element}
     */
    protected createContent: (hostElement: HTMLElement) => void;
    protected getBorderedElement: () => HTMLElement;
    protected calcValue: () => Value;
    /**
     * Widget read/write property
     *
     * @return {number | null | undefined}     the evaluated result of the text entered to Widget
     */
    get value(): Value;
    set value(val: Value);
}
