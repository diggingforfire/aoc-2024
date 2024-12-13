import { dir } from "console";
import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";
import { splitOnNewLines } from "../../utils/input";

type Plot = {
    x: number;
    y: number;
    letter: string;
    neighbours: Plot[];
};

const directions = [
    { x: 0, y: - 1},
    { x: 1, y: 0 },
    { x: 0, y: 1},
    { x: -1, y: 0}
];

export const puzzle = () : Puzzle => {

    const inputToRegions = (input: string) : Plot[][] => {
        const plots = splitOnNewLines(input).map((line, y) => line.split("").map((c, x) => ({  x: x, y: y , letter: c} as Plot)));
        let regions: Plot[][] = [];
       
        for (const plot of plots.flatMap(p => p)) {
            if (!regions.flatMap(region => region).some(otherPlot => otherPlot.x === plot.x && otherPlot.y === plot.y)) {
                const region = bfs(plot, plots);
                regions.push(region);
            }
        }

        return regions;
    }
    
    const getNeighbours = (plot: Plot, plots: Plot[][], letter: string) => directions
        .map(direction => ({ x: plot.x + direction.x, y: plot.y + direction.y } as Plot))
        .filter(plot => plot.y >= 0 && plot.y < plots.length && plot.x >= 0 && plot.x < plots[0]!.length)
        .map(plot => ({ x: plot.x, y: plot.y, letter: plots[plot.y]![plot.x]?.letter! } as Plot))
        .filter(plot => plot.letter === letter);

    const bfs = (plot: Plot, plots: Plot[][]) : Plot[] => {
        const result: Plot[] = [];
        const queue = [plot];
        const visited = new Set<string>();

        while (queue.length) {
            const plot = queue.shift()!;
            const key = `${plot.x},${plot.y}`;
            if (!visited.has(key)) {
                visited.add(key);
                result.push(plot);

                const neighbours = getNeighbours(plot, plots, plot.letter);
                plot.neighbours = neighbours;
                queue.push(...neighbours);
            }
        }
    
        return result;
    };

    const priceByPerimeter = (region: Plot[]) => {
        const area = region.length;
        const perimeter = (region.length * 4) - sum(region.map(plot => plot.neighbours.length));
        return area * perimeter;
    }


    const priceBySides = (region: Plot[]) => {
        const area = region.length;




        const sides = 0;
        return area * sides;
    }

    return {
        first: function (input: string): string | number {
            return sum(inputToRegions(input).map(priceByPerimeter));
        },
        second: function (input: string): string | number {
            return sum(inputToRegions(input).map(priceBySides));
        }
    }

};