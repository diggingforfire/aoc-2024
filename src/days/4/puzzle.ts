import Puzzle from "../../types/Puzzle";
import { groupBy } from "../../utils/collection";
import { splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const linesToGrid = (lines: string[]) => lines.map(line => line.split(""));

    const findWord = (grid: string[][], xIndex: number, yIndex: number, xDirection: number, yDirection: number, word: string) : Boolean => {
        let counter = 0;

        while (counter < word.length) {
            const nextX = xIndex + xDirection * counter;
            const nextY = yIndex + yDirection * counter;
            
            if (!grid[nextY]) {
                return false;
            }

            const next = grid[nextY][nextX];
            if (next !== word.charAt(counter)) {
                return false;
            }
            counter++;
        }

        return true;
    }

    const inputToMatches = (input: string, directions: {x: number, y: number}[], targetWord: string) => {
        const lines = splitOnNewLines(input);
        const grid = linesToGrid(lines);
        const regex = new RegExp(targetWord[0]!, 'g');
        
        const targetStartIndices = lines.flatMap((line, y) => [...line!.matchAll(regex)].map(match => ({ y, x: match.index })));

        const matches = targetStartIndices.flatMap(
            start => directions.filter(direction => findWord(grid, start.x, start.y, direction.x, direction.y, targetWord)).map(direction => ({
                indexX: start.x,
                indexY: start.y,
                directionX: direction.x,
                directionY: direction.y
            })));

        return matches;
    }

    return {
        first: function (input: string): string | number {
            const targetWord = "XMAS";
            const directions = [
                {x: -1, y: +1},
                {x: 0, y: +1},
                {x: 1, y: +1},
        
                {x: -1, y: 0},
                {x: 0, y: 0},
                {x: 1, y: 0},
        
                {x: -1, y: -1},
                {x: 0, y: -1},
                {x: 1, y: -1},
            ];

            const matches = inputToMatches(input, directions, targetWord);
            
            return matches.length.toString();
        },

        second: function (input: string): string | number {
            const targetWord = "MAS";
            const directions = [
                {x: -1, y: +1},
                {x: 1, y: +1},
                {x: -1, y: -1},
                {x: 1, y: -1},
            ];

            const matches = inputToMatches(input, directions, targetWord);
            const centerCoords = matches.map(mas => `${mas.indexY + mas.directionY * 1},${mas.indexX + mas.directionX * 1}`);
            const xmases = Object.values(groupBy(centerCoords, c => c)).filter(grp => grp.length === 2);
            
            return xmases.length.toString();
        }
    }
};