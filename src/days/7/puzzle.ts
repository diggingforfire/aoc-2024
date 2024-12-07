import Puzzle from "../../types/Puzzle";
import { cartesian, sum } from "../../utils/collection" ;
import { splitOnNewLines } from "../../utils/input";

type Equation = {
    test: number,
    numbers: number[],
    possibleEquations: string[]
};

export const puzzle = () : Puzzle => {
    const evaluateFromLeftToRight = (eq: string) : number => {
        const operands = eq.split(/\+|\*|\|\|/g);
        const operators = [...eq.matchAll(/\+|\*|\|\|/g)].map(match => match[0]);

        let result = operands.shift();
        while (operands.length) {
            const expression = `${result}${operators.shift()?.replace("||", "")}${operands.shift()}`;
            result = eval(expression);
        }

        return parseInt(result!);
    };

    const possibleEquations = (numbers: number[], operators: string[]) => {
        const pqs = [...cartesian(numbers.map((n, i) => operators.map(o => `${n}${i === numbers.length -1 ? "" : o}`)))].map(eq => eq.join(""));
        return [...new Set(pqs)];
    }

    const inputToEquations = (input: string, operators: string[]) => {
        const equations: Equation[] = 
        splitOnNewLines(input).map(line => [...line.matchAll(/\d+/g)].map(match => parseInt(match[0])))
        .map(line => 
        ({
            test: line[0],
            numbers: line.slice(1)
        } as Equation))
        .map(equation => ({
            ...equation,
            possibleEquations: possibleEquations(equation.numbers, operators)
        } as Equation));

        return equations;
    };

    return {
        first: function (input: string): string | number {
            const equations: Equation[] = inputToEquations(input, ["+", "*"]);
            const possibilities = equations.filter(eq => eq.possibleEquations.some(pe => evaluateFromLeftToRight(pe) == eq.test))
            return sum(possibilities.map(p => p.test!));
        },

        second: function (input: string): string | number {
            const equations: Equation[] = inputToEquations(input, ["+", "*", "||"]);
            const possibilities = equations.filter(eq => eq.possibleEquations.some(pe => evaluateFromLeftToRight(pe) == eq.test));
            return sum(possibilities.map(p => p.test!));
        }
    }
};