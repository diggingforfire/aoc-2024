import Puzzle from "../../types/Puzzle";
import { groupBy, permutations } from "../../utils/collection";
import { splitOnDoubleNewLines, splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const inputToPatternsAndDesigns = (input: string) : [string[], string[]] => {
        const [patterns, designs] = splitOnDoubleNewLines(input);
        return [patterns!.split(", "), splitOnNewLines(designs!)];
    };

    const canBeMade = (design: string, patterns: string[]) => {
        let d = design;

        for (const p of patterns) {
            d = d.replaceAll(p, "");
        }

        return d === "";
    }

    const optimizePatterns = (patterns: string[]) => {
        let optimizedPatterns = [...patterns];
        const groups = groupBy(patterns, (p) => p.length);
        const keys = Object.keys(groups);

        const min = parseInt(keys[0]!);
        const max = parseInt(keys[keys.length - 1]!);

        for (let i = min; i <= max; i++) {
            if (groups[i]) {
                const values = Object.values(groups[i]!);
                if (values.length > 1) {
                    const patternsToRemove = permutations(values, i +1);
                    for (const patternToRemove of patternsToRemove) {
                        optimizedPatterns = optimizedPatterns.filter(pattern => pattern !== patternToRemove.join(""));
                    }
                }
            }

        }

        return optimizedPatterns;
    }

    return {
        first: function (input: string): string | number {
            const [patterns, designs] = inputToPatternsAndDesigns(input);

            const patternsThatCanBeMade: {design: string, pattern: string[]}[] = [];

            designs: for (const design of designs) {
                const relevantPatterns = patterns.filter(pattern => design.includes(pattern));
                const optimizedPatterns = optimizePatterns(relevantPatterns);
                //const patternsToCheck = permutations(optimizedPatterns, optimizedPatterns.length);
                
                if (canBeMade(design, optimizedPatterns)) {
                    patternsThatCanBeMade.push({design, pattern: optimizedPatterns});
                    continue designs;
                }
            }



            return patternsThatCanBeMade.length;
        },
        second: function (input: string): string | number {
            return 0;
        }
    }
}; 