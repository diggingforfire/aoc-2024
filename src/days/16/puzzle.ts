import { EOL } from "os";
import Puzzle from "../../types/Puzzle";
import { splitOnNewLines } from "../../utils/input";

type Node = {
    x: number;
    y: number;
    cost: number;
    label: string;
    inShortestPath: boolean;
    visitors: Node[];
    previous?: Node;
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

const markShortestPaths = (start: Node, grid: Node[][], previous?: Node) => {
    let current = start;
    current.inShortestPath = true;

    if (current.label === "S") {
        return;
    }
 
    if (current.visitors.length > 1) {
        const lowerCostVisitors = current.visitors
            .filter(visitor => visitor.cost < current.cost || (previous && previous!.cost - visitor.cost === 2))!;

        for (const visitor of lowerCostVisitors) {
            markShortestPaths(visitor, grid, current);
        }
    } else {
        markShortestPaths(current.previous!, grid, current);
    }
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
            } else {
                output += `${(node.cost).toString().padStart(2, " ")}${node.marked ? "*" : ""}`;
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
    const inputToGrid = (input: string) => {
        const lines = splitOnNewLines(input);
        const grid = lines.map((line, y) => line.split("").map((char, x) => ({
            x,
            y,
            cost: Number.MAX_VALUE,
            label: char,
            visitors: [],
            inShortestPath: false
        }) as Node));

        return grid;
    }

    const search = (start: Node, grid: Node[][]) => {
        start.cost = 0;
        const queue: Node[] = [start];

        while (queue.length) {
            const current = queue.shift()!;
            const neighbours = getNeighbours(current, grid);

            for (const neighbour of neighbours) {
                let cost = current.cost + 1;
                
                if (hasTurned(current.previous!, neighbour)) {
                    cost += 1000;
                }    

                if (!neighbour.visitors.some(n => n.x === current.x && n.y === current.y)) {
                    neighbour.visitors.push(current);
                }  

                if (cost < neighbour.cost) {
                    neighbour.previous = current;
                    neighbour.cost = cost;
                    
                    queue.push(neighbour);
                }
            }
        }

        const end = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "E")[0]!;

        return end;
    }
    
    const getSearchResult = (input: string) : [Node, Node[][]] => {
        const grid = inputToGrid(input);

        const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
        start.previous = grid[start.y]![start.x + 1]!;

        const end = search(start, grid);

        return [end, grid];
    };

    return {
        first: function (input: string): string | number {
            const [end] = getSearchResult(input);
            return end.cost;
        },

        second: function (input: string): string | number {
            const [end, grid] = getSearchResult(input);
            markShortestPaths(end, grid);

            const inShortestPath = grid.flatMap(nodes => nodes.filter(node => node.inShortestPath));
            return inShortestPath.length;
        }
    };
};