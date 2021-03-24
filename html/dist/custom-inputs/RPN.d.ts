/**
 * Arithmetic formula calculator
 * Based on Reverse Polish notation Algorithm
 * See https://en.wikipedia.org/wiki/Reverse_Polish_notation
 *
 * Restictions:
 * Allowed numbers, operators "+", "-", "*", "/" (included infix "+", "-") and parentheses
 *
 * Usage:
 * const rpn = new RPN();
 * const formula = "-2*(3+4)+5/6";
 * rpn.change(formula);
 * const value = rpn.value; //value of the calculation
 *
 * @author serggin <serggin1@yandex.ru>
 */
declare type Value = number | undefined;
export declare class RPN {
    static getOperatorFunction: (char: string) => (x: number, y: number) => number;
    static getPriority: (char: string) => number;
    static readonly numChars = ".0123456789";
    static readonly opChars = "-+*/()";
    static readonly binopChars = "-+*/";
    static isNumChar: (char: string) => boolean;
    static isOpChar: (char: string) => boolean;
    static isBinOpChar: (char: string) => boolean;
    private stack;
    private out;
    private tokens;
    private error;
    private text;
    private _value;
    private index;
    /**
     * Get calculation result
     *
     * @return {number | undefined}     undefined in case of invalid formula
     */
    get value(): Value;
    private clear;
    /**
     * Provide formula for calculation
     *
     * @param text  formula
     */
    change: (text: string) => void;
    private parse;
    private getToken;
    private parseInfix;
    private calculate;
}
export {};
