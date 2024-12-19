import Puzzle from "../../types/Puzzle";
import { permutations } from "../../utils/collection";
import { splitOnDoubleNewLines, splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const inputToPatternsAndDesigns = (input: string) : [string[], string[]] => {
        const [patterns, designs] = splitOnDoubleNewLines(input);

        return [patterns!.split(", "), splitOnNewLines(designs!)];
    };
    return {
        first: function (input: string): string | number {
            const [patterns, designs] = inputToPatternsAndDesigns(input);

            return 0;
        },
        second: function (input: string): string | number {
            return 0;
        }
    }
}; 