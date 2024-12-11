import Puzzle from "../../types/Puzzle";
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
    const visitedMarker = "X";
    const obstacleMarker = "#";

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

    const markAsVisited = (y: number, x: number, grid: string[][]) => grid[y]![x] = visitedMarker;

    const turnAwayFromObstacle = (direction: Direction, position: Pos, grid: string[][]) : Direction => {
        let nextPosition = { x: position.x + directions[direction].x, y: position.y + directions[direction].y };

        while (gridValue(grid, nextPosition) === obstacleMarker) {
            direction = turnRight(direction);
            nextPosition = { x: position.x + directions[direction].x, y: position.y + directions[direction].y };
        };

        return direction;
    }

    const move = (position: Pos, direction: Direction) => ({ x: position.x + directions[direction].x, y: position.y + directions[direction].y });

    const traverseGridGetsStuck = (grid: string[][], startPosition: Pos, startDirection: Direction) => {
        let currentPosition = {...startPosition};
        let currentDirection = startDirection;

        const maxCycleTreshold = grid.length * grid[0]!.length;
        let loopIndex = 0;

        for (; gridValue(grid, currentPosition); loopIndex++) {
            if (loopIndex === maxCycleTreshold)  return true; // TODO: actual cycle detection

            markAsVisited(currentPosition.y, currentPosition.x, grid);
            currentDirection = turnAwayFromObstacle(currentDirection, currentPosition, grid);
            currentPosition = move(currentPosition, currentDirection);
        }

        return false;
    };
 
    return {
        first: function (input: string): string | number {
            const lines = splitOnNewLines(input);
            const grid = linesToGrid(lines);
            const startPosition: Pos = lines.flatMap((line, y) => [...line!.matchAll(/\^/g)].map(match => ({ y, x: match.index })))[0]!;
 
            traverseGridGetsStuck(grid, startPosition, Direction.North);

            return grid.flatMap(line => line.map(char => char)).filter(char => char === visitedMarker).length;
        },

        second: function (input: string): string | number {
            const lines = splitOnNewLines(input);
            const grid = linesToGrid(lines);
            const startPosition: Pos = lines.flatMap((line, y) => [...line!.matchAll(/\^/g)].map(match => ({ y, x: match.index })))[0]!;
 
            const distinctObstacleCoordinates = new Set<string>();

            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y]!.length; x++) {

                    if (gridValue(grid, { x:x, y:y}) !== obstacleMarker && !(x === startPosition.x && y === startPosition.y) ) {
                        const gridCopy = grid.map(l => l.slice());
                        gridCopy[y]![x] = obstacleMarker;
                        
                        if (traverseGridGetsStuck(gridCopy, startPosition, Direction.North)) {
                            distinctObstacleCoordinates.add(`${x},${y}`);
                        }
                    }
                }
            }

            return distinctObstacleCoordinates.size;
        }
    };
};