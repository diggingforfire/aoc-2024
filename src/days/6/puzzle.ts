import { Dir } from "fs";
import Puzzle from "../../types/Puzzle";
import { groupBy } from "../../utils/collection";
import { splitOnNewLines } from "../../utils/input";

type Pos = {
    x: number;
    y: number;
};

enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
};

type Directions = Record<Direction, Pos>;
 
export const puzzle = () : Puzzle => {
    const directions: Directions = {
        0: { x: 0, y: - 1},
        1: { x: 1, y: 0 },
        2: { x: 0, y: 1},
        3: { x: -1, y: 0}
    }

    const linesToGrid = (lines: string[]) => lines.map(line => line.split(""));

    const gridValue = (grid: string[][], pos: Pos) : string | undefined => 
        grid[pos.y] && grid[pos.x] && grid[pos.y]![pos.x];
    
    const turnRight = (direction: Direction) : Direction => (direction + 1) % Object.keys(directions).length;

    const willLoop = (grid: string[][], startPosition: Pos, startDirection: Direction) => {
        let currentPosition = startPosition;
        let currentDirection = startDirection;
        let currentValue : string | undefined = '' ;

        while ((currentValue = gridValue(grid, currentPosition))) {  
            if (currentValue === currentDirection.toString()) {
                return true;
            } else {
                if (currentValue === '#') {
                    console.log("not good");
                }
                grid[currentPosition.y]![currentPosition.x] = currentDirection.toString();
            }

            let nextPosition = { 
                x: currentPosition.x + directions[currentDirection].x, 
                y: currentPosition.y + directions[currentDirection].y 
            };

            while (gridValue(grid, nextPosition) === "#") {
                currentDirection = turnRight(currentDirection);
                nextPosition = { 
                    x: currentPosition.x + directions[currentDirection].x, 
                    y: currentPosition.y + directions[currentDirection].y 
                };
            };

            currentPosition.x += directions[currentDirection].x;
            currentPosition.y += directions[currentDirection].y;  
        }

        return false;
    };

    const renderGrid = (grid: string[][]) => {
        return;
        const str = grid.flatMap(g => g.join("")).join("\n");
        console.log("\n");
        console.log(str);
    }

    const traverseGrid = (grid: string[][], startPosition: Pos, startDirection: Direction) => {
        let currentPosition = {...startPosition};
        let currentDirection = startDirection;
        const possibleObstructions = new Set<string>();

        while (gridValue(grid, currentPosition)) {
            grid[currentPosition.y]![currentPosition.x] = currentDirection.toString();
            renderGrid(grid);
            
            let nextPosition = { 
                x: currentPosition.x + directions[currentDirection].x, 
                y: currentPosition.y + directions[currentDirection].y 
            };

            while (gridValue(grid, nextPosition) === "#") {
                currentDirection = turnRight(currentDirection);
                nextPosition = { 
                    x: currentPosition.x + directions[currentDirection].x, 
                    y: currentPosition.y + directions[currentDirection].y 
                };
            };

            currentPosition.x += directions[currentDirection].x;
            currentPosition.y += directions[currentDirection].y;

            if (willLoop(grid.map(l => l.slice()), {...currentPosition}, turnRight(currentDirection))) {

                const tmp = { 
                    x: currentPosition.x + directions[currentDirection].x, 
                    y: currentPosition.y + directions[currentDirection].y 
                };
                
                possibleObstructions.add(`${tmp.x},${tmp.y}`);   
            }
        }

        return possibleObstructions.size;
    };
 
    return {
        first: function (input: string): string | number {
            const lines = splitOnNewLines(input);
            const grid = linesToGrid(lines);
            const startPosition: Pos = lines.flatMap((line, y) => [...line!.matchAll(/\^/g)].map(match => ({ y, x: match.index })))[0]!;
 
            traverseGrid(grid, startPosition, Direction.North);

            return grid.flatMap(line => line.map(c => c)).filter(c => c === "X").length;
        },

        second: function (input: string): string | number {
            const lines = splitOnNewLines(input);
            const grid = linesToGrid(lines);
            const startPosition: Pos = lines.flatMap((line, y) => [...line!.matchAll(/\^/g)].map(match => ({ y, x: match.index })))[0]!;
 
            const possibleObstructions = traverseGrid(grid, startPosition, Direction.North);

            return possibleObstructions;
        }
    };
};