import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";
import { mod } from "../../utils/math";

export const puzzle = () : Puzzle => {

    const executeProgram = (program: number[], a: number, b: number, c: number) : number[] => {
        const registers: { [name: string]: number } = {
            "A": a,
            "B": b,
            "C": c,
        };

        const output: number[] = [];
        let instructionPointer = 0;
        let opcode;

        const combo = (operand: number) => {
            if (operand >= 0 && operand <= 3) return operand;
            if (operand === 4) return registers["A"];
            if (operand === 5) return registers["B"];
            if (operand === 6) return registers["C"];
        };

        const instructions: { [opcode: number]: (operand: number) => boolean | void } = {
            0: (operand: number) => {
                const numerator = registers["A"]!;
                const denominator = Math.pow(2, combo(operand)!);
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
                registers["B"] = (registers["B"]! ^ registers["C"]!) >>> 0;
            },
            5: (operand: number) => {
                output.push(mod(combo(operand)!, 8));
            },
            6: (operand: number) => {
                const numerator = registers["A"]!;
                const denominator = Math.pow(2, combo(operand)!);
                registers["B"] = Math.floor(numerator / denominator);
            },
            7: (operand: number) => {
                const numerator = registers["A"]!;
                const denominator = Math.pow(2, combo(operand)!);
                registers["C"] = Math.floor(numerator / denominator);
            }
        };

        while ((opcode = program[instructionPointer]) !== undefined) {
            const operand = program[instructionPointer + 1]!;
            const skipInstructionPointerIncrement = instructions[opcode]!(operand);
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
        second: function (input: string): string | number {
            const [program, a, b, c] = inputToProgramAndRegisters(input);

            for (let i = Math.pow(8, program.length - 1); i <= Math.pow(8, program.length); i += 1) {
                const output = executeProgram(program, i, b, c);
                if (i % 100000 === 0) {
                    console.log(`${i}/${Math.pow(8, program.length)}`);
                }

                if (output.join(",") === program.join(",")) {
                    console.log(i);
                    break;
                }                
            }

            return 0;
        }
    }
};