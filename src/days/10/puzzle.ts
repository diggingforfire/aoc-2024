import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const directions = [
        { x: 0, y: - 1},
        { x: 1, y: 0 },
        { x: 0, y: 1},
        { x: -1, y: 0}
    ];

    const inputToGrid = (input: string) => 
        splitOnNewLines(input).map(line => line.split("").map(char => parseInt(char)));

    const getTrailheads = (grid: number[][]) =>
        grid.flatMap((line, y) => 
            line.map((char, x) => ({ x, y, n: char })).filter(pos => pos.n === 0));

    const withinBounds = (position: {x: number, y: number}, grid: number[][]) => 
        position.y >= 0 && position.y < grid.length && position.x >= 0 && position.x < grid[0]!.length;

    const getNeighbourPositions = (position: {x: number, y: number}, directions: {x: number, y: number}[]) =>
        directions.map(direction => ({ x: position.x + direction.x, y: position.y + direction.y }));

    const getNeighbours = (positions: {x: number, y: number}[], grid: number[][], position: {x: number, y: number, n: number}) =>
        positions
            .filter(neighbour => withinBounds(neighbour, grid))
            .map(neighbour => ({x: neighbour.x, y: neighbour.y, n: grid[neighbour.y]![neighbour.x]!}))
            .filter(neighbour => neighbour.n && neighbour.n === position.n + 1);
    
    const getHikes = (startPosition: {x: number, y: number, n: number}, grid: number[][]) : {x: number, y: number, n: number}[] => {
        if (startPosition.n === 9) return [startPosition];
        
        const neighbourPositions = getNeighbourPositions(startPosition, directions);
        const neighbours = getNeighbours(neighbourPositions, grid, startPosition);        
       
        return neighbours.flatMap(neighbour => getHikes(neighbour, grid));
    }

    return {
        first: function (input: string): string | number {
            const grid = inputToGrid(input);
            const trailheads = getTrailheads(grid);
            const hikes = trailheads.flatMap(trailhead => [...new Set(getHikes(trailhead, grid).map(hike => `${hike.x},${hike.y}`))]);
            return hikes.length
        },
        second: function (input: string): string | number {
            const grid = inputToGrid(input);
            const trailheads = getTrailheads(grid);
            const hikes = trailheads.flatMap(trailhead => getHikes(trailhead, grid));
            return hikes.length;
        }
    }

}