import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";
import { splitOnNewLines } from "../../utils/input";
import { mod, modBig } from "../../utils/math";

export const puzzle = () : Puzzle => {

    const executeProgram = (program: number[], a: number, b: number, c: number) : number[] => {
        const registers: { [name: string]: number } = {
            "A": a,
            "B": b,
            "C": c,
        };

        const output: number[] = [];
        let instructionPointer = 0;
        let opcode = 0;

        const combo = (operand: number) : number | undefined => {
            if (operand >= (0) && operand <= 3) return operand;
            if (operand === 4) return registers["A"];
            if (operand === 5) return registers["B"];
            if (operand === 6) return registers["C"];
        };

        const instructions: { [opcode: number]: (operand: number) => boolean | void } = {
            0: (operand: number) => {
                const numerator = registers["A"]!;
                const denominator = 2 ** combo(operand)!;
                registers["A"] = Math.floor(numerator / denominator);
            },
            1: (operand: number) => {
                registers["B"] = (registers["B"]! ^ operand) >>> 0;
            },
            2: (operand: number) => {
                registers["B"] = mod(combo(operand)!, 8);
            },
            3: (operand: number) => {
                if (registers["A"] !== 0) {
                    instructionPointer = operand;
                    return true;
                }
                return false;
            },
            4: (_: number) => {
                registers["B"] = (registers["B"]! ^ registers["C"]!) >>> 0;;
            },
            5: (operand: number) => {
                output.push(mod(combo(operand)!, 8));
            },
            6: (operand: number) => {
                const numerator = registers["A"]!;
                const denominator = 2 ** combo(operand)!;
                registers["B"] = Math.floor(numerator / denominator);
            },
            7: (operand: number) => {
                const numerator = registers["A"]!;
                const denominator = 2 ** combo(operand)!;
                registers["C"] = Math.floor(numerator / denominator);
            }
        };

        while ((opcode = program[Number(instructionPointer)]!) !== undefined) {
            const operand = program[Number(instructionPointer) + 1]!;
            const skipInstructionPointerIncrement = instructions[Number(opcode)]!(operand);
            if (!skipInstructionPointerIncrement) {
                instructionPointer += 2;
            }
        }

        return output;
    };

    const inputToProgramAndRegisters = (input: string) : [number[], number, number, number] => {
        const lines = splitOnNewLines(input);
            
        let a = parseInt(lines[0]?.split(":")[1]!);
        let b = parseInt(lines[1]?.split(":")[1]!);
        let c = parseInt(lines[2]?.split(":")[1]!);

        const program = lines[3]?.split(":")[1]!.split(",").map(n => parseInt(n))!;

        return [program, a, b, c];
    };

    return {
        first: function (input: string): string | number {
            const [program, a, b, c] = inputToProgramAndRegisters(input);
            const output = executeProgram(program, a, b, c);
            return output.join(",");
        },
        second: function (input: string): string | number  {
            const [program, _, b, c] = inputToProgramAndRegisters(input);

            // for (let i = 0; i < 1000; i++) {
            //     const output = executeProgram(program, number(i), b, c);
            //     console.log(i + "\t" + output.join(","));
            // }

            const desiredA = sum(program.map((n, i) => (8 ** (i+1)) * n));

            // 14892336084115 too low
            // 119138688672528 too high
            return desiredA;
        }
    }
};