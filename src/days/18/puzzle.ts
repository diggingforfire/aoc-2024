import Puzzle from "../../types/Puzzle"
import { splitOnNewLines } from "../../utils/input";

type Node = {
    x: number;
    y: number;
    cost: number;
    visited: boolean;
    label: string;
};

export const puzzle = () : Puzzle => {
    const inputToGridAndCoords = (input: string, numberOfBytes: number) : [Node[][], {x: number, y: number}[]] => {
        let coords = splitOnNewLines(input).map(line => ({ x : parseInt(line.split(",")[0]!), y: parseInt(line.split(",")[1]!) }));

        const maxX = Math.max(...coords.map(c => c.x)) + 1;
        const maxY = Math.max(...coords.map(c => c.y)) + 1;

        const grid: Node[][] = [];
        
        for (let y = 0; y < maxY; y++) {
            const arr = [];
            for (let x = 0; x < maxX; x++) {
                arr.push({
                    x: x,
                    y: y,
                    cost: Number.MAX_VALUE,
                    label: "",
                    visited: false,
                } as Node);
            }
            grid.push(arr);
        }

        for (const coord of coords.slice(0, numberOfBytes)) {
            grid[coord.y]![coord.x]!.label = "#";
        }

        return [grid, coords];
    }

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

    const search = (grid: Node[][]) => {
        const start = grid[0]![0]!;
        start.visited = true;
        start.cost = 0;
        const queue = [start];

        while (queue.length) {
            const current = queue.shift()!;
            const neighbours = getNeighbours(current, grid);

            for (const neighbour of neighbours) {
                if (!neighbour.visited) {
                    neighbour.visited = true;
                    const cost = current.cost + 1;
                    neighbour.cost = Math.min(neighbour.cost, cost);
                    queue.push(neighbour);
                }
            }
        }

        return grid[grid.length - 1]![grid[0]!.length - 1]!;
    };

    return {
        first: function (input: string): string | number {
            const [grid] = inputToGridAndCoords(input, 1024);
            const end = search(grid);
            return end.cost;
        },

        second: function (input: string): string | number {
            let i = 0;
            while (i < Number.MAX_VALUE) {
                const [grid, coords] = inputToGridAndCoords(input, i);
                const end = search(grid);
                if (end.cost === Number.MAX_VALUE) {
                    return `${coords[i - 1]!.x},${coords[i - 1]!.y}`;
                }
                i++;
            }

            return 0;
        }
    }
}