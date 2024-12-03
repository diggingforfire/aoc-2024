import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";

export const puzzle = () : Puzzle => {
    const regex = /mul\((\d+)\,(\d+)\)/g;
    const doFlag = "do()";
    const dontFlag = "don't()";

    return {
        first: function (input: string): string | number {
            return sum([...input.matchAll(regex)].map(grp => parseInt(grp[1]!) * parseInt(grp[2]!)));
        },
        second: function (input: string): string | number {
            let memory: string = input;
            let nextDoIndex: number = 0;
            let totalSum: number = 0;
            
            while (nextDoIndex !== -1) {
                let nextDont = memory.indexOf(dontFlag);
                const enabledInstructions = memory.slice(nextDoIndex + doFlag.length, nextDont);
                const muls = [...enabledInstructions.matchAll(regex)].map(grp => parseInt(grp[1]!) * parseInt(grp[2]!));
                
                totalSum += sum(muls);
                
                if (nextDont === -1) {
                    break;
                }

                memory = memory.slice(nextDont + dontFlag.length);
                nextDoIndex = memory.indexOf(doFlag);
            }

            return totalSum;
        }
    };
}