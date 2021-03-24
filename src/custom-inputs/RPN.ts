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

type Token = number | string;
type Value = number | undefined

export class RPN {
    static getOperatorFunction = (char: string): ((x: number, y: number) => number) => {
        switch (char) {
            case  '+':
                return (x: number, y: number): number => x + y;
            case  '-':
                return (x: number, y: number): number => x - y;
            case  '*':
                return (x: number, y: number): number => x * y;
            case  '/':
                return (x: number, y: number): number => x / y;

            default: // "never" option
                return (x: number, y: number): number => 0;
        }
    }

    static getPriority = (char: string): number => {
       switch (char) {
           case '(':
           case ')':
               return 1;
           case '+':
           case '-':
           case '=':
               return 2;
           case '*':
           case '/':
               return 3;
           default: // "never" option
               return 0;
       }
    }

    static readonly numChars = '.0123456789';

    static readonly opChars = '-+*/()';

    static readonly binopChars = '-+*/';

    static isNumChar = (char: string): boolean => char.length === 1 && RPN.numChars.indexOf(char) > -1;

    static isOpChar = (char: string): boolean => char.length === 1 && RPN.opChars.indexOf(char) > -1;

    static isBinOpChar = (char: string): boolean => char.length === 1 && RPN.binopChars.indexOf(char) > -1;

    private stack: Token[] = [];
    private out:  Token[] = [];
    private tokens:  Token[] = [];
    private error: boolean = false;
    private text: string = '';
    private _value: Value = undefined;
    private index: number = 0;

    /**
     * Get calculation result
     *
     * @return {number | undefined}     undefined in case of invalid formula
     */
    get value(): Value {
        return this._value;
    }

    private clear = (): void => {
        this.stack = [];
        this.out = [];
        this.error = false;
        this.tokens = [];
    }

    /**
     * Provide formula for calculation
     *
     * @param text  formula
     */
    change = (text: string): void => {
        this.clear();
        this.text = text;
        this.parse();
    }

    private parse = (): void => {
        this._value = undefined;
        this.index = 0;
        let token: Token | false;
        try {
            do {
                token = this.getToken();
                if (token || token === 0) {
                    this.tokens.push(token);
                }
            } while (token || token === 0);
            this.parseInfix();
            this.calculate();
            if (this.stack.length === 1 && !Number.isNaN(this.stack[0])) {
                if (typeof this.stack[0] === 'number') {
                    this._value = this.stack[0];
                } else {
                    // option impossible
                }
            }
        } catch (err) {
        //    console.log('tokens=', this.tokens);
        //    console.error(err);
        }
    }

    private getToken = (): Token | false => {
        if (this.index > this.text.length - 1) {
            return false;
        }
        let lexeme = '';
        let lexemeClosed = false;
        let opChar = '';

        do {
            const char = this.text[this.index];
            switch (char) {
                case ' ':
                    lexemeClosed = lexeme.length > 0;
                    this.index += 1;
                    break;
                default:
                    if (RPN.isNumChar(char)) {
                        lexeme += char;
                        this.index += 1;
                    } else
                    if (RPN.isOpChar(char)) {
                        if (lexeme.length > 0) {
                            lexemeClosed = true;
                        } else {
                            opChar = char;
                            this.index += 1;
                        }
                    } else {
                        throw new SyntaxError(`Invalid character "${char}"`);
                    }
            }
            if (lexemeClosed || opChar.length > 0) {
                break;
            }
        } while (this.index < this.text.length);

        if (lexeme.length > 0) {
            const num = Number(lexeme);
            if (Number.isNaN(num)) {
                throw new SyntaxError(`Invalid number "${lexeme}"`);
            }
            return num;
        }
        if (opChar.length > 0) {
            return opChar;
        } else {
            return false;
        }
    }

    private parseInfix = (): void => {
        let prevToken: Token | undefined = undefined;
        let token: Token;

        for (let i = 0; i < this.tokens.length; i += 1) {
            token = this.tokens[i];
            if (typeof token === 'number') {
                this.out.push(token);
            } else if (token === '(') {
                this.stack.push(token);
            } else if (token === ')') {
                let valid = false;
                do {
                    const top = this.stack.pop();
                    if (top === '(') {
                        valid = true;
                        break;
                    }
                    this.out.push(top!);
                } while (this.stack.length > 0);
                if (!valid) {
                    throw new SyntaxError('"(" has not previos "("');
                }
            } else if (RPN.isBinOpChar(token)) {
                // test if operation is unary
                let opToken: string | undefined = undefined;
                if (prevToken === undefined || prevToken === '(') {
                    if (token === '-') {
                        opToken = '='; // unary "-"
                    } else if (token === '+') { // ignore unary "+"
                    } else {
                        throw new SyntaxError(`Invalid unary ${token}`);
                    }
                } else {
                    opToken = token;
                    do {
                        const top: string = this.stack[this.stack.length - 1] as string;
                        if (top === '=' || RPN.getPriority(top) >= RPN.getPriority(token)) {
                            this.stack.pop();
                            this.out.push(top);
                        } else {
                            break;
                        }
                    } while (this.stack.length > 0);
                }
                if (opToken) {
                    this.stack.push(opToken);
                }
            }
            prevToken = token;
        }
        if (this.stack.length > 0) {
            for (let i = this.stack.length - 1; i >= 0; i -= 1) {
                token = this.stack[i] as string;
                if (RPN.isBinOpChar(token) || token === '=') {
                    this.out.push(token);
                } else {
                    throw new SyntaxError(`Invalid ${token}`);
                }
            }
            this.stack = [];
        }
    }

    private calculate = (): void => {
        this.stack = [];
        let token: Token;
        let operand1: number;
        let operand2: number;
        for (let i = 0; i < this.out.length; i += 1) {
            token = this.out[i];
            if (typeof token === 'number') {
                this.stack.push(token);
            } else if (token === '=') {
                operand1 = this.stack.pop() as number;
                this.stack.push(-operand1);
            } else {
                operand2 = this.stack.pop() as number;
                operand1 = this.stack.pop() as number;
                this.stack.push(RPN.getOperatorFunction(token)(operand1, operand2));
            }
        }
    }
}
