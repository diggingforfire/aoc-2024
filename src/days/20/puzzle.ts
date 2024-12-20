import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";

type Node = {
    x: number;
    y: number;
    cost: number;
    label: string;
    visited: boolean;
};

const directions: {x: number, y: number}[] = [
    { x: 0, y: - 1},
    { x: 1, y: 0 },
    { x: 0, y: 1},
    { x: -1, y: 0}
];

const getNeighbours = (node: Node, grid: Node[][]) : Node[] => {
    const neighbours = directions
        .map(direction => ({x: node.x + direction.x, y: node.y + direction.y}))
        .filter(pos => pos.y >= 0 && pos.y < grid.length && pos.x >= 0 && pos.x < grid[0]?.length!)
        .map(pos => (grid[pos.y]![pos.x]!))
        .filter(node => node.label !== "#");

    return neighbours;
};

const inputToGrid = (input: string) => {
    const lines = splitOnNewLines(input);
    const grid = lines.map((line, y) => line.split("").map((char, x) => ({
        x,
        y,
        cost: Number.MAX_VALUE,
        label: char,
        visited: false
    }) as Node));

    return grid;
}

export const puzzle = () : Puzzle => {
    const search = (start: Node, grid: Node[][]) => {
        start.cost = 0;
        start.visited = true;
        
        const queue: Node[] = [start];

        while (queue.length) {
            const current = queue.shift()!;
            const neighbours = getNeighbours(current, grid);

            for (const neighbour of neighbours) {

                if (!neighbour.visited) {
                    neighbour.visited = true;
                    queue.push(neighbour);
                    
                    let cost = current.cost + 1;
                    neighbour.cost = Math.min(neighbour.cost, cost);          
                }
            }
        }

        const end = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "E")[0]!;

        return end;
    }

    return {
        first: function (input: string): string | number {
            const grid = inputToGrid(input); 
            const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            const end = search(start,   grid);
            return 0;
        },
        second: function (input: string): string | number {
            return 0;
        }
    }
};