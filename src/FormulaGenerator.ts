/**
 * Formulas Generator for testing RPN
 */
export class FormulaGenerator {
    static readonly THRESHOLDS = {
        infixSign: .2,
        depth0: {
            number: .1,
            arithmetic: .9,
            parenthesis: 1,
        },
        depth: {
            number: .5,
            arithmetic: 1,
            parenthesis: 1,
        },
    }
    static readonly NUMBER = 1;
    static readonly ARITHMETIC = 2;
    static readonly PARENTHESIS = 3;
    static readonly OPERATIONS = ['+', '-', '*', '/'];

    constructor(
        private maxOperands= 4,
        private maxDepth= 3,
        private maxNumber = 10,
        private fixedDigits = 0
    ) {
    }

    generate(depth: number = 0): string {
        if (depth >= this.maxDepth) {
            return this.generateNumber();
        }
        let formula;
        const type = this.randomType(depth);
        if (type === FormulaGenerator.NUMBER) {
            formula = (depth === 0 ? this.generateInfixSign() : '') + this.generateNumber();
        } else
        if (type === FormulaGenerator.ARITHMETIC) {
            formula = this.generateArithmetic(depth);
        } else {
            formula = this.generateParenthesis(depth);
        };

        return formula;
    }

    private generateNumber(): string {
        const random = Math.random();
        return (random * this.maxNumber).toFixed(this.fixedDigits);
    }

    private randomType(depth: number): number {
        const random = Math.random();
        const thresholds = depth === 0 ? FormulaGenerator.THRESHOLDS.depth0 : FormulaGenerator.THRESHOLDS.depth;
        if (random < thresholds.number) {
            return FormulaGenerator.NUMBER;
        } else
        if (random < thresholds.arithmetic) {
            return FormulaGenerator.ARITHMETIC;
        } else {
            return FormulaGenerator.PARENTHESIS;
        }
    }

    private generateInfixSign(): string {
        const random = Math.random();
        if (random < .5) {
            return '-';
        } else
        if (random < .6) {
            return '+'
        }
        return '';
    }

    private generateArithmetic(depth: number): string {
        const random = Math.random();
        const operands = 2 + Math.floor(random * (this.maxOperands - 1));
        let formula: string = (depth > 0 ? '(' : '') + this.generateInfixSign();
        for (let i = 0; i < operands; i += 1) {
            if (i) {
                formula += this.generateOperation();
            }
            formula += this.generate(depth + 1);
        }
        if (depth > 0) {
            formula += ')';
        }
        return formula;
    }

    private generateOperation(): string {
        const random = Math.random();
        let index: number;
        if (random < .3) {
            index = 0;
        } else
        if (random < .6) {
            index = 1;
        } else
        if (random < .8) {
            index = 2;
        } else {
            index = 3;
        }
        return FormulaGenerator.OPERATIONS[index];
    }

    private generateParenthesis (depth:number): string {
        let formula = '(' + this.generateInfixSign() + this.generate(depth + 1) + ')';
        return formula;
    }

}
