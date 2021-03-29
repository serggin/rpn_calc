/**
 * Formulas Generator for testing RPN
 */
export declare class FormulaGenerator {
    private maxOperands;
    private maxDepth;
    private maxNumber;
    private fixedDigits;
    static readonly THRESHOLDS: {
        infixSign: number;
        depth0: {
            number: number;
            arithmetic: number;
            parenthesis: number;
        };
        depth: {
            number: number;
            arithmetic: number;
            parenthesis: number;
        };
    };
    static readonly NUMBER = 1;
    static readonly ARITHMETIC = 2;
    static readonly PARENTHESIS = 3;
    static readonly OPERATIONS: string[];
    constructor(maxOperands?: number, maxDepth?: number, maxNumber?: number, fixedDigits?: number);
    generate(depth?: number): string;
    private generateNumber;
    private randomType;
    private generateInfixSign;
    private generateArithmetic;
    private generateOperation;
    private generateParenthesis;
}
