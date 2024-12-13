import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";
import { splitOnDoubleNewLines, splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {

    const cheapest = (machine: { 
        a: {x: number; y: number}, 
        b: {x: number; y: number}, 
        prize: {x: number; y: number} }, maxPresses: number, aTokens: number, bTokens: number) : number | null => {

        const combinations : {aPresses: number, bPresses: number}[] = [];
        
        for (let a = 0; a <= maxPresses; a++) {
            for (let b = 0; b <= maxPresses; b++) {
                combinations.push({aPresses: a, bPresses: b});
            }
        }

        const allButtonPresses = combinations.map(combination => ({
            aPresses: combination.aPresses,
            bPresses: combination.bPresses,
            sumX: combination.aPresses * machine.a.x + combination.bPresses * machine.b.x,
            sumY: combination.aPresses * machine.a.y + combination.bPresses * machine.b.y
        }));

        const winningCombinations = allButtonPresses.filter(presses => 
            presses.sumX === machine.prize.x && presses.sumY === machine.prize.y);

        let cheapest = null;
        for (const winningCombination of winningCombinations) {
            const spend = winningCombination.aPresses * aTokens + winningCombination.bPresses * bTokens;
            if (!cheapest || spend < cheapest) {
                cheapest = spend
            }
        }

        return cheapest;
    };

    return {
        first: function (input: string): string | number {
            const machines = splitOnDoubleNewLines(input).map(config => splitOnNewLines(config)).map(config => ({
                
                    a: {
                        x: parseInt([...config[0]!.matchAll(/X\+(\d+)/g)][0]![1]!),
                        y: parseInt([...config[0]!.matchAll(/Y\+(\d+)/g)][0]![1]!),
                    },
                    b: {
                        x: parseInt([...config[1]!.matchAll(/X\+(\d+)/g)][0]![1]!),
                        y: parseInt([...config[1]!.matchAll(/Y\+(\d+)/g)][0]![1]!),
                    },
                    prize: {
                        x: parseInt([...config[2]!.matchAll(/X\=(\d+)/g)][0]![1]!),
                        y: parseInt([...config[2]!.matchAll(/Y\=(\d+)/g)][0]![1]!),
                    }
                
            }));
            
            return sum(machines.map(machine => cheapest(machine, 100, 3, 1) ?? 0))
        },
        second: function (input: string): string | number {
            return 0;
        }
    }
};