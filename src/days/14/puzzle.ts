import { EOL } from "os";
import Puzzle from "../../types/Puzzle";
import { groupBy } from "../../utils/collection";
import { splitOnNewLines, writeOutput } from "../../utils/input";

type Position = {
    x: number;
    y: number;
};

export const puzzle = () : Puzzle => {

    const inputToPositionsAndVelocities = (input: string) => {
        const lines = splitOnNewLines(input);

        const positionsAndVelocities = lines.map(line => ({
            positionMatch: [...line.matchAll(/p\=(\d+),(\d+)/g)],
            velocityMatch: [...line.matchAll(/v\=(-?\d+),(-?\d+)/g)]
        })).map(matches => ({
            position: { x: parseInt(matches.positionMatch[0]![1]!), y: parseInt(matches.positionMatch[0]![2]!) } as Position,
            velocity: { x: parseInt(matches.velocityMatch[0]![1]!), y: parseInt(matches.velocityMatch[0]![2]!) } as Position
        }));

        return positionsAndVelocities;
    };

    const mod = (n: number, d: number) => ((n % d) + d) % d;

    const renderGrid = (grid: string[][], i: number) => {
        let output = "";
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0]!.length; x++) {
                if (y !== Math.floor(grid.length / 2) && x !== Math.floor(grid[0]!.length / 2)) {
                    if (grid[y]![x] === ".") {
                        output += " ";
                    } else {
                        output += "v"; 
                    }
                } else {
                    output += "+";
                }

            }
            output += EOL;
        }
        output += EOL;

        writeOutput(`${__dirname}/${i}.txt`, output);
    };

    return {
        first: function (input: string): string | number {
            const positionsAndVelocities = inputToPositionsAndVelocities(input);

            const width = 101;
            const height = 103;
            const grid = Array.from({length: height}, e => [...".".repeat(width).split("")]);
            
            for (let i = 0; i < 100; i++) {
                for (const pv of positionsAndVelocities) {
                    pv.position.x = mod(pv.position.x + pv.velocity.x, width);
                    pv.position.y = mod(pv.position.y + pv.velocity.y, height);
                    if (pv.position.y !== Math.floor(grid.length / 2) && pv.position.x !== Math.floor(grid[0]!.length / 2)) {
                        grid[pv.position.y]![pv.position.x] = grid[pv.position.y]![pv.position.x] === "." ? "1" : (parseInt(grid[pv.position.y]![pv.position.x]!) + 1).toString();
                    }
                }

                renderGrid(grid, i + 1);
                console.log("hi");
            }

            const filtered = positionsAndVelocities.filter(pv => pv.position.x !== Math.floor(width / 2) && pv.position.y !== Math.floor(height / 2));
            const quadrants = groupBy(filtered, p => `${Math.floor(p.position.x  / (Math.floor(width / 2) + 1))},${Math.floor(p.position.y / (Math.floor(height / 2) + 1))}`);
            return Object.values(quadrants).map(quadrant => quadrant.length).reduce((a, b) => a * b);
        },
        second: function (input: string): string | number {
            return 0;
        }
    };
};