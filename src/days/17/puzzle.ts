import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const mod = (n: number, d: number) => ((n % d) + d) % d;
    return {
        first: function (input: string): string | number {
            const lines = splitOnNewLines(input);
            
            let A = parseInt(lines[0]?.split(":")[1]!);
            let B = parseInt(lines[1]?.split(":")[1]!);
            let C = parseInt(lines[2]?.split(":")[1]!);

            const combo = (op: number) => {
                if (op >= 0 && op <= 3) return op;
                if (op === 4) return A;
                if (op === 5) return B;
                if (op === 6) return C;
                return -1;
            };

            const program = lines[3]?.split(":")[1]!.split(",").map(c => parseInt(c))!;

            let i = 0;
            for (; i < Number.MAX_VALUE; i++) {
                if (i % 10000 === 0) {
                    console.log(i);
                }
    
                let output = "";
                let ip = 0;
                let opcode;
                let resolvedOperand = 0;
                let result = 0;

                A = i;
    
                while ((opcode = program[ip]) !== undefined) {
                    const operand = program[ip + 1]!;
    
                    switch (opcode) {
                        case 0:
                            resolvedOperand = combo(operand);
                            const numerator = A;
                            const denom = Math.pow(2, resolvedOperand);
                            result = Math.floor(numerator / denom);
                            A = result;
                            break;
                        case 1:
                            result = B ^ operand >>> 0;
                            B = result;
                            break;
                        case 2:
                            resolvedOperand = combo(operand);
                            result = mod(resolvedOperand, 8);
                            B = result;
                            break;
                        case 3:
                            if (A !== 0) {
                                ip = operand;
                                continue;
                            }
                            break;
                        case 4:
                            result = B ^ C >>> 0;
                            B = result;
                            break;
                        case 5:
                            resolvedOperand = combo(operand);
                            const modded = mod(resolvedOperand, 8);
                            output += modded;
                            break;
                        case 6:
                            resolvedOperand = combo(operand);
                            const numeratorr = A;
                            const denomr = Math.pow(2, resolvedOperand);
                            result = Math.floor(numeratorr / denomr);
                            B = result;
                            break;
                        case 7:
                            resolvedOperand = combo(operand);
                            const numeratorrr = A;
                            const denomrr = Math.pow(2, resolvedOperand);
                            result = Math.floor(numeratorrr / denomrr);
                            C = result;
                            break;
                    }
                    ip += 2;
                }

                if ([...output].join(",") === program.join(",")) {
                    break;
                }

            }


            return i
            //return [...output].join(",");
        },
        second: function (input: string): string | number {

            return 0;
        }
    }
};