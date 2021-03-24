# "rpn_calc" Test Task

## Requirements
https://docviewer.yandex.ru/view/15785387/?page=1&*=Ol1JYEL5taJm78auC3G0GosIeuR7InVybCI6InlhLW1haWw6Ly8xNzUzNTg5MTA0OTA3NzAwMTIvMS4yIiwidGl0bGUiOiJJbnB1dENvbnRyb2xzVGVzdC5kb2N4Iiwibm9pZnJhbWUiOmZhbHNlLCJ1aWQiOiIxNTc4NTM4NyIsInRzIjoxNjE1Nzk1MTk4MDI1LCJ5dSI6IjE5NzI2Mzk4MjE1Mzk4ODQ0MzgifQ%3D%3D

## Install and Run
In the project folder execute to install:

$ npm install

Execute to run test server:

$ npm run serve

## Live demo

https://serggin.github.io/rpn_calc.demo/

## Formula generator
In order to test formulas calculations I've developed the FormulaGenerator class.

To utilize it, add this sample to the index.html:
```html
    <h2>Automated test using Formula Generator</h2>
    <p>Passed <span id="result" /> </p>
    <p>See console log for details</p>
```
and this snippet to main.ts:
```typescript
import {FormulaGenerator} from "./FormulaGenerator.js";

/**
 * FormulaGenerator & RPN demo
 */
const formulaGenerator = new FormulaGenerator(3, 3, 10, 0);
const rpn = new RPN();
const total = 10;
let passed = 0;
console.log('================== Generated formulas test started =======================');
for (let i = 0; i < total; i += 1) {
    const formula = formulaGenerator.generate();
    rpn.change(formula);
    const value = rpn.value;
    const ev = eval(formula);
    if (ev === value) {
        passed ++;
        console.log(formula, value, ev);
    } else {
        console.error(formula, value, ev);
    }
}
console.log('================== Generated formulas test ended =======================');
const node = document.createTextNode(`${passed} of ${total}`);
const resultElement = document.getElementById('result');
resultElement!.appendChild(node);
```

It will display results in the browser's console as
```text
9-(2/(+10-3+1)+(2+4+6)) -3.25 -3.25 main.js:159:17
-1/4 -0.25 -0.25 main.js:159:17
(+((-6/1/3)-(-5-1))) 4 4 main.js:159:17
-6+(7-1) 0 0 main.js:159:17
+10-4-7 -1 -1 main.js:159:17
(-(-7-6)/10-4)+(-(-3*9/8)-(-6-2*3)*7) 84.675 84.675 main.js:159:17
3*(-2-(4+8)) -42 -42 main.js:159:17
-(-8*7)-1-((3-2)-(-9+8)) 53 53 main.js:159:17
-0/0+0 undefined NaN main.js:162:17
-(8/4)*(-5*(4-5/1))+((+7-8)*5+3) -12 -12 main.js:159:17
```

The result of formula calculation by means of the RPN class is compared to the result produced by script eval() function.
You can see the example of rare inconsistence with formula "-0/0+0". eval() produces NaN while RPN converts NaN to undefined due to the task requirements.
