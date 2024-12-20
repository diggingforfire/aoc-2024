import { EOL } from "os";
import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";

type Node = {
    x: number;
    y: number;
    cost: number;
    label: string;
    visited: boolean;
    marked: boolean;
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
        .map(pos => (grid[pos.y]![pos.x]!));

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

const renderGrid = (grid: Node[][]) => {
    let output = "";

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0]!.length; x++) {
            const node = grid[y]![x]!;

            if (node.label === "#") {
                if (x > 0 && x < grid[0]!.length - 1) {
                    output += node.label.padStart(2, " ");
                } else {
                    output += node.label;
                }

                if (node.marked) {
                    output += "*";
                }
            } else {
                output += `${(node.cost).toString().padStart(2, " ")}`;
            }

            output += "\t";
        }

        output += EOL;
        output += EOL;
        output += EOL;
    }

    output += EOL;

    console.log(output);
};

export const puzzle = () : Puzzle => {
    const search = (start: Node, grid: Node[][]) : [Node, Node[]] => {
        start.cost = 0;
        start.visited = true;
        
        const queue: Node[] = [start];
        const encounteredObstacles: Node[] = [];

        while (queue.length) {
            const current = queue.shift()!;
            const neighbourNodes = getNeighbours(current, grid);
            
            const neighbours = neighbourNodes.filter(n => n.label !== "#");
            const obstacles = neighbourNodes.filter(n => n.label === "#");
            
            for (const obstacle of obstacles) {
                if (!encounteredObstacles.some(o => o.x === obstacle.x && o.y === obstacle.y)) {
                    if (obstacle.x > 0 && obstacle.x < grid[0]!.length - 1 && obstacle.y > 0 && obstacle.y < grid.length - 1) {
                        encounteredObstacles.push(obstacle);
                    }
                }
            }

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

        return [end, encounteredObstacles];
    }

    return {
        first: function (input: string): string | number {
            const grid = inputToGrid(input); 
            const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            const [end, encounteredObstacles] = search(start, grid);

            let saves: number[] = [];

            renderGrid(grid);

            let i = 1;
            for (const o of encounteredObstacles){
                console.log(`${i++}/${encounteredObstacles.length}`);
                const gridCopy = inputToGrid(input); 
                gridCopy[o.y]![o.x]!.label = ".";
                const [newEnd, _] = search(start, gridCopy);
                saves.push(end.cost - newEnd.cost);
            }

            saves = saves.toSorted((a, b) => a - b);

            return saves.filter(cheat => cheat >= 100).length;
        },
        second: function (input: string): string | number {
            return 0;
        }
    }
};