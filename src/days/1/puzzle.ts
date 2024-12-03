import Puzzle from "../../types/Puzzle";
import { zip, sum } from "../../utils/collection";
import { splitOnNewLines, splitOnWhiteSpace } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const inputTofirstsAndSeconds = (input: string): [number[], number[]] => {
        const lines = splitOnNewLines(input);
        const pairs = lines.map(splitOnWhiteSpace);
        
        const firsts = pairs.flatMap(pair => parseInt(pair[0]!)).toSorted();
        const seconds = pairs.flatMap(pair => parseInt(pair[1]!)).toSorted();

        return [firsts, seconds];
    };

    return {
        first: function (input: string): string | number {
            const [firsts, seconds] = inputTofirstsAndSeconds(input);
            const diffs = zip(firsts, seconds).map(zipped => Math.abs(zipped[0] - zipped[1]));
            return sum(diffs);
        },
    
        second: function (input: string): string | number  {
            const [firsts, seconds] = inputTofirstsAndSeconds(input);           
            const counts = firsts.map(first => first * seconds.filter(second => second === first).length);
            return sum(counts);
        }
    };
}; 