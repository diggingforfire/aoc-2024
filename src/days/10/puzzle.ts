import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";
import { splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const directions = [
        { x: 0, y: - 1},
        { x: 1, y: 0 },
        { x: 0, y: 1},
        { x: -1, y: 0}
    ];

    const ps = new Set<string>();

    const search = (pos: {x: number, y: number, c: number}, grid: number[][], ps: {x: number, y: number, c: number}[]) : void => {
        if (pos.c === 9) {
            ps.push(pos);
            return;
        }

        const nextPositions = directions.map(d => ({
            x: pos.x + d.x,
            y: pos.y + d.y
        }));

        const next = nextPositions.filter(p => 
            p.x >=0 && p.x < grid[0]!.length && 
            p.y >= 0 && p.y < grid.length)
            .map(p => ({
                x: p.x,
                y: p.y,
                c: grid[p.y]![p.x]!
            })).filter(p => !!p.c && p.c === pos.c + 1);

        if (!next.length) {
            return;
        }
        
        next.map(n => search(n, grid, ps));
    }

    return {
        first: function (input: string): string | number {
            const grid = splitOnNewLines(input).map(line => line.split("").map(c => parseInt(c)));
            const trailheads = grid.flatMap((line, y) => line.map((c, x) => ({
                x,
                y,
                c
              })).filter(p => p.c === 0));


            const test = trailheads.flatMap(t => {
                const hikes: {x: number, y: number, c: number}[] = [];
                search(t, grid, hikes);
                return hikes;
            });
            return 0;
        },
        second: function (input: string): string | number {
            return 0;
        }
    }

}