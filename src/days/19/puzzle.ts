import Puzzle from "../../types/Puzzle";
import { cartesian, groupBy, permutations } from "../../utils/collection";
import { splitOnDoubleNewLines, splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const inputToPatternsAndDesigns = (input: string) : [string[], string[]] => {
        const [patterns, designs] = splitOnDoubleNewLines(input);
        return [patterns!.split(", "), splitOnNewLines(designs!)];
    };

    const designCanBeMadeFromPatterns = (design: string, patterns: string[]) => {
        let remainder = design;
 
        for (const pattern of patterns) {
            remainder = remainder.replaceAll(pattern, "");
        }

        return remainder === "";
    }

    const optimizePatterns = (patterns: string[]) => {
        let optimizedPatterns = [...patterns];

        const test = patterns.filter(p => designCanBeMadeFromPatterns(p, patterns));

        const groups = groupBy(patterns, (p) => p.length);
        const singleLetterPatterns = Object.values(groups[1]!);
        
        // remove all patterns that consist only of single letter patterns
        optimizedPatterns = optimizedPatterns.filter(pattern => pattern.length === 1 || (pattern.length > 1 && !pattern.split("").every(c => singleLetterPatterns.includes(c))));
        
        // remove all patterns that repeat themselves
        // optimizedPatterns = optimizedPatterns.filter(pattern => !optimizedPatterns.some(p => p === pattern+""+pattern));

 

        // const patternsToRemove = [];
        // // remove all patterns that consist only of double letter patterns
        // const pairs = Object.values(groups[2]!);
        // patternsToRemove.push(...permutations(pairs, 2));
        // patternsToRemove.push(...permutations(pairs, 3));
        
        // // remove all patterns that consist only of triple letter patterns
        // const triplets = Object.values(groups[3]!);
        // patternsToRemove.push(...permutations(triplets, 2));

        // // remove all patterns that consist only of triple letter patterns
        // const quads = Object.values(groups[4]!);
        // patternsToRemove.push(...permutations(quads, 2));

        // patternsToRemove.push(...cartesian([pairs, triplets]));
        // patternsToRemove.push(...cartesian([triplets, pairs]));

        // patternsToRemove.push(...cartesian([pairs, triplets, triplets]));
        // // patternsToRemove.push(...cartesian([triplets, pairs, triplets]));
        // // patternsToRemove.push(...cartesian([triplets, triplets, triplets]));

        // patternsToRemove.push(...cartesian([quads, triplets]));
        // patternsToRemove.push(...cartesian([triplets, quads]));

        // patternsToRemove.push(...cartesian([quads, pairs]));
        // patternsToRemove.push(...cartesian([pairs, quads]));

        // // patternsToRemove.push(...cartesian([quads, pairs, pairs]));

        // // patternsToRemove.push(...cartesian([pairs, quads, pairs]));
        // // patternsToRemove.push(...cartesian([pairs, pairs, quads]));
        // patternsToRemove.push(...cartesian([quads, quads]));

        // for (const patternToRemove of patternsToRemove) {
        //     optimizedPatterns = optimizedPatterns.filter(pattern => pattern !== patternToRemove.join(""));
        // }

        return optimizedPatterns;
    }

    return {
        first: function (input: string): string | number {
            const [patterns, designs] = inputToPatternsAndDesigns(input);
 
            const designsThatCanBeMade: string[] = [];

            const groups = groupBy(patterns, (p) => p.length);
            const singleLetterPatterns = Object.values(groups[1]!);

            let optimizedPatterns = patterns.filter(pattern => pattern.length === 1 || (pattern.length > 1 && !pattern.split("").every(c => singleLetterPatterns.includes(c))));
            optimizedPatterns = optimizedPatterns.filter(pattern => pattern.length === 1 || (pattern.length > 1 && !designCanBeMadeFromPatterns(pattern, patterns.filter(p => p !== pattern && pattern.length <= p.length))));

            for (const design of designs) {
                if (designCanBeMadeFromPatterns(design, optimizedPatterns)) {
                    designsThatCanBeMade.push(design);
                    continue;
                }
            }

            // 278 too low
            // 298 not right
            // 305 not right
            // 306 not right
            // 310 too high
            // 321 too high



            return designsThatCanBeMade.length;
        },
        second: function (input: string): string | number {
            return 0;
        }
    }
}; 