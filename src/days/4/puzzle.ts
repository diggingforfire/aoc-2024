import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const find = (grid: string[][], xIndex: number, yIndex: number, xDirection: number, yDirection: number, target: string) => {
        let counter = 0;

        while (counter < target.length) {
            const nextX = xIndex + xDirection * counter;
            const nextY = yIndex + yDirection * counter;

            const next = grid[nextY]![nextX];
            if (next !== target.charAt(counter)) {
                return false;
            }
            counter++;
        }

        return true;
    }

    return {
        first: function (input: string): string | number {
            const lines = splitOnNewLines(input);
            const grid = lines.map(line => line.split(""));
            const indices = [...lines[3]!.matchAll(/X/g)].map(match => match.index);

            const output = indices.map(i => find(grid, i, 3, 1, 0, "XMAS"));
            return input;
        },

        second: function (input: string): string | number {
            return input;   
        }
    }
};