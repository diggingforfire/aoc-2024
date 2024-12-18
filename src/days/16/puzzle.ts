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
    //visitors?: Node[];
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

// const markShortestPaths = (start: Node, grid: Node[][]) => {
//     let t = start;
 
//     while (t.label !== "S") {
//         const next = grid[t.y]![t.x]!;
//         next.marked = true;

//         if (t.x === 3 && t.y === 9) {
//             console.log("hmm");
//         }

//         if (t.label !== "E" && t.visitors?.length! === 2 && (t.visitors![0]!.cost === t.visitors![1]!.cost || (Math.abs(t.visitors![0]!.cost - t.visitors![1]!.cost) === 1000))) {
//             markShortestPaths(t.visitors![0]!, grid);
//             markShortestPaths(t.visitors![1]!, grid);
//             break;
//         } else {
//             t = t.previous;
//         }
//     }

//     t.marked = true;
// }

const renderGrid = (grid: Node[][], grid2: Node[][]) => {
    let output = "";

    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0]!.length; x++) {
            const node = grid[y]![x]!;
            const node2 = grid2[y]![x]!;



            if (node.label === "#") {
                if (x > 0 && x < grid[0]!.length - 1) {
                    output += node.label.padStart(2, " ");
                } else {
                    output += node.label;
                }
            } else {
                output += `${(node.cost + node2.cost).toString().padStart(2, " ")}${""}`;
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

            for (const neighbour of neighbours) {
                // if (!neighbour.visitors) {
                //     neighbour.visitors = [];
                // }
                let cost = current.cost + 1;
                
                if (hasTurned(current.previous, neighbour)) {
                    current.turnPoint = true;
                    cost += 1000;
                }    

                // if (!neighbour.visited || cost <= neighbour.cost || Math.abs(neighbour.cost - cost) === 1000) {
                //     if (!neighbour.visitors.some(n => n.x === current.x && n.y === current.y)) {
                //         neighbour.visitors.push(current)
                //     }    
                // }

                if (!neighbour.visited || cost <= neighbour.cost) {

                    neighbour.visited = true;
                    neighbour.previous = current;
                    neighbour.cost = Math.min(neighbour.cost, cost);

                    queue.push(neighbour);
                }
            }
        }

        const end = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "E")[0]!;

        return end;
    }

    return {
        first: function (input: string): string | number {
            return 0;
            const grid = inputToGrid(input);

            const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            start.previous = grid[start.y]![start.x + 1]!;

            const end = search(start, grid);

            renderGrid(grid, grid);

            return end.cost;
        },
        second: function (input: string): string | number {
            //return 0;
            const grid = inputToGrid(input);
            const start = grid.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            start.previous = grid[start.y]![start.x + 1]!;
            const end = search(start, grid);

            const grid2 = inputToGrid(input);
            const end2 = grid2.flatMap(line => line.map(node => node)).filter(node => node.label === "E")[0]!;
            const start2 = grid2.flatMap(line => line.map(node => node)).filter(node => node.label === "S")[0]!;
            search(end2, grid2);
            start2.cost += 1000;

            renderGrid(grid, grid2);
            //renderGrid(grid2, grid2 );
            
           // markShortestPaths(end, grid);

            //renderGrid(grid2);

            //const nodes = grid.flatMap(line => line.map(n => n)).filter(node => node.marked);

            let i = 0;
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[0]!.length; x++) {
                    const node1 = grid[y]![x]!;
                    const node2 = grid2[y]![x]!;
                    if (node1.turnPoint && node1.cost + node2.cost !== end.cost) {
                        node1.cost += 1000;
                    }

                    if (node1.cost + node2.cost === end.cost) {
                        i++;
                    }
                }
            }
            
            // 607 too high
            // 608 too high
            return i;
        }
    };
};