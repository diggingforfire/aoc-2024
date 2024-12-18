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
    marked?: boolean;
    turnPoint?: boolean;
    visitors?: Node[];
    visiteds?: {node: Node, afterTurn: boolean}[]
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

const markShortestPaths = (start: Node, previous: Node | null, grid: Node[][]) => {
    let next = start;
 
    while (next.label !== "S") {
        next.marked = true;

        if (next.x === 5 && next.y === 7) {
            console.log("hmm");
        }

        if (next.label !== "E" && 
            next.visitors?.length! > 1
        ) {

            // only consider turn cost for those visitors that came from a turn
            const visitorsToFollow = next.visitors?.filter(v => v.cost < next.cost || (previous && previous!.cost - v.cost === 2))!;

            for (const v of visitorsToFollow) {
                markShortestPaths(v, next, grid);
            }

            break;
        } else {
            next = next.previous;
        }
    }

    next.marked = true;
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
            visited: false,

        }) as Node));

        return grid;
    }

    const search = (start: Node, grid: Node[][]) => {
        start.cost = 0;

        start.visited = true;

        const queue: Node[] = [start];

        while (queue.length) {
            const current = queue.shift()!;
            const neighbours = getNeighbours(current, grid);

            if (current.x === 5 && current.y === 7) {
                console.log("hm");
            }

            if (current.x === 1 && current.y === 11) {
                console.log("hmm");
            }

            for (const neighbour of neighbours) {
                if (!neighbour.visitors) {
                    neighbour.visitors = [];
                }

                if (!current.visiteds) {
                    current.visiteds = [];
                }

                let cost = current.cost + 1;
                
                if (hasTurned(current.previous, neighbour)) {
                    cost += 1000;
                }    

                if (neighbour.y === 7 && neighbour.x === 5) {
                    console.log("hm");
                }

                if (!neighbour.visitors.some(n => n.x === current.x && n.y === current.y)) {
                    neighbour.visitors.push(current);
                    current.visiteds!.push({node: neighbour, afterTurn: hasTurned(current.previous, neighbour)});
                }  

                if (cost < neighbour.cost) {
                    neighbour.visited = true;
                    neighbour.previous = current;
                    neighbour.cost = cost;
                    
                    queue.push(neighbour);
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
            start.previous = grid[start.y]![start.x + 1]!;

            const end = search(start, grid);
            
            return end.cost;
        },
        second: function (input: string): string | number {
            
            const grid = inputToGrid(input);

            const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            start.previous = grid[start.y]![start.x + 1]!;

            const end = search(start, grid);
            markShortestPaths(end, null, grid);
            renderGrid(grid);

            const marked = grid.flatMap(line => line.filter(c => c.marked));
            return marked.length;

            //return 0;
            // const grid = inputToGrid(input);
            // const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            // start.previous = grid[start.y]![start.x + 1]!;
            // const end = search(start, grid);

            // const grid2 = inputToGrid(input);
            // const end2 = grid2.flatMap(line => line.map(node => node)).filter(node => node.label === "E")[0]!;
            // const start2 = grid2.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            // search(end2, grid2);
            // start2.cost += 1000;

            // renderGrid(grid, grid2);
            //renderGrid(grid2, grid2 );
            
           // markShortestPaths(end, grid);

            //renderGrid(grid2);

            //const nodes = grid.flatMap(line => line.map(n => n)).filter(node => node.marked);

            // let i = 0;
            // for (let y = 0; y < grid.length; y++) {
            //     for (let x = 0; x < grid[0]!.length; x++) {
            //         const node1 = grid[y]![x]!;
            //         const node2 = grid2[y]![x]!;
            //         if (node1.turnPoint && node1.cost + node2.cost !== end.cost) {
            //             node1.cost += 1000;
            //         }

            //         if (node1.cost + node2.cost === end.cost) {
            //             i++;
            //         }
            //     }
            // }
            
            // 607 too high
            // 608 too high
            return 0;
        }
    };
};