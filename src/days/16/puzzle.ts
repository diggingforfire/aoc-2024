import { EOL } from "os";
import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";

type Node = {
    x: number;
    y: number;
    visited: boolean;
    cost: number;
    label: string;
    previous: Node;
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

const hasTurned = (previous: Node, current: Node) => 
    previous && previous.x !== current.x && previous.y !== current.y;

const renderGrid = (grid: Node[][], end: Node) => {
    let t = end;
 
    let i = 0;
    while (t.label !== "S") {
        const next = grid[t.y]![t.x]!;
        next.label = "O";
        t = t.previous;
        i++;
    }

    console.log(i);

    let output = "";
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0]!.length; x++) {
            output += grid[y]![x]?.label;
        }
        output += EOL;
    }
    output += EOL;

    console.log(output);
};

export const puzzle = () : Puzzle => {
    return {
        first: function (input: string): string | number {
            const lines = splitOnNewLines(input);
            const grid = lines.map((line, y) => line.split("").map((char, x) => ({
                x,
                y,
                cost: Number.MAX_VALUE,
                label: char,
                visited: false,

            }) as Node));

            const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            start.cost = 0;

            start.visited = true;
            start.previous = grid[start.y]![start.x + 1]!;

            let current = null;

            const queue: Node[] = [start];

            while (queue.length) {
                current = queue.shift()!;
                const neighbours = getNeighbours(current, grid);

                for (const neighbour of neighbours) {
                    let cost = current.cost + 1;
                    
                    if (hasTurned(current.previous, neighbour)) {
                        cost += 1000;
                    }    

                    if (!neighbour.visited || cost < neighbour.cost) {
                        neighbour.visited = true;
                        neighbour.previous = current;

                        neighbour.cost = Math.min(neighbour.cost, cost);

                        queue.push(neighbour);
                    }
                }

            }

            const end = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "E")[0]!;

            renderGrid(grid, end);

            return end.cost;
        },
        second: function (input: string): string | number {
            return 0;
        }
    };
};