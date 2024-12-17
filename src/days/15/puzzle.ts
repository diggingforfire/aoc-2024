import Puzzle from "../../types/Puzzle";
import { splitOnDoubleNewLines, splitOnNewLines } from "../../utils/input";
import { sum } from "../../utils/collection";

type Pos = {
    x: number;
    y: number;
};

const directions: Pos[] = [
    { x: 0, y: - 1},
    { x: 1, y: 0 },
    { x: 0, y: 1},
    { x: -1, y: 0}
];

type MoveDirection = Record<string, Pos>;

const moveToDirection: MoveDirection = {
    "^": directions[0]!,
    ">": directions[1]!,
    "v": directions[2]!,
    "<": directions[3]!
};

export const puzzle = () : Puzzle => {

    const linesToGrid = (lines: string[]) => lines.map(line => line.split(""));
    
    const gridValue = (grid: string[][], pos: Pos) : string | undefined => 
        grid[pos.y] && grid[pos.x] && grid[pos.y]![pos.x];

    const nextPosition = (currentPosition: Pos, move: string) => {
        const direction = moveToDirection[move];
        return { x: currentPosition.x + direction!.x, y: currentPosition.y + direction!.y}
    };

    const mark = (y: number, x: number, grid: string[][], marker: string) => grid[y]![x] = marker;

    const moveIt = (startPosition: Pos, moves: string, grid: string[][], boxMarker: string) => {
        let currentPosition = startPosition;

        for (const move of [...moves?.replaceAll("\r\n", "")!]) {
            const nextPos = nextPosition(currentPosition, move);
            const nextValue = gridValue(grid, nextPos);

            if (nextValue == "." || nextValue == "@") {
                currentPosition = nextPos;

            } else if (nextValue == boxMarker) {
                let nextNext = nextPosition(nextPos, move);
                let nextNextValue = gridValue(grid, nextNext);

                let poses = [nextNext];
                while (nextNextValue == boxMarker) {
                    nextNext = nextPosition(nextNext, move);
                    nextNextValue = gridValue(grid, nextNext);
                    poses.push(nextNext);
                }

                if (nextNextValue == "." || nextNextValue == "@") {
                    mark(nextPos.y, nextPos.x, grid, ".");
                    currentPosition = nextPos;
                    for (const pos of poses) {
                        mark(pos.y, pos.x, grid, boxMarker);
                    }
                }
            }
        }
    };

    return {
        first: function (input: string): string | number {
            const [gridPart, moves] = splitOnDoubleNewLines(input);

            const lines = splitOnNewLines(gridPart!);
            const grid = linesToGrid(lines);
            
            const startPosition: Pos = lines.flatMap((line, y) => [...line!.matchAll(/\@/g)].map(match => ({ y, x: match.index })))[0]!;

            moveIt(startPosition, moves!, grid, "O");

            const boxes = grid.flatMap((lines, y) => lines.map((line, x) => ({
                y,
                x,
                line
            }))).filter(l => l.line === "O");

            return sum(boxes.map(b => 100 * b.y + b.x));
        },
        second: function (input: string): string | number {
            const transformedInput = 
                input.replaceAll("#", "##").replaceAll("O", "[]").replaceAll(".", "..").replaceAll("@", "@.");
                
            const [gridPart, moves] = splitOnDoubleNewLines(transformedInput);

            const lines = splitOnNewLines(gridPart!);
            const grid = linesToGrid(lines);
            
            const startPosition: Pos = lines.flatMap((line, y) => [...line!.matchAll(/\@/g)].map(match => ({ y, x: match.index })))[0]!;

            moveIt(startPosition, moves!, grid, "O");

            const boxes = grid.flatMap((lines, y) => lines.map((line, x) => ({
                y,
                x,
                line
            }))).filter(l => l.line === "O");

            return sum(boxes.map(b => 100 * b.y + b.x));
        }
    };
};