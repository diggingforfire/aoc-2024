import Puzzle from "../../types/Puzzle";
import { groupBy } from "../../utils/collection";
import { splitOnNewLines } from "../../utils/input";

export const puzzle = () : Puzzle => {

    const delta = (a: {x: number, y: number}, b: {x: number, y: number}) => 
        ({x: a.x - b.x, y: a.y - b.y});

    const withinBounds = (a: {x: number, y: number}, grid: string[][]) =>
        a.y >= 0 && a.y < grid.length && a.x >=0 && a.x < grid[0]!.length;

    const generateAntinodes = (
        antenna: {x: number, y: number}, 
        delta: {x: number, y: number}, 
        grid: string[][],
        justOne: boolean) : {x: number, y: number}[]  => {
        
        if (justOne) {
            return [
                { x: antenna.x + delta.x, y: antenna.y + delta.y}
            ];
        }

        let antinodes = [];
        
        let startX = antenna.x;
        let startY = antenna.y;
        let counter = 1;
        
        while (startY >= 0 && startY < grid.length && startX >= 0 && startX < grid[0]!.length) {
            const antinode = { x: antenna.x + delta.x * counter, y: antenna.y + delta.y * counter};
            antinodes.push(antinode);
            startX = antinode.x;
            startY = antinode.y;
            counter++;
        }

        return antinodes;
    };
    
    const gridToAntinodeGroups = (grid: string[][]) => {
        const antennas = grid.flatMap((line, y) => line.map((char, x) => ({
            x, 
            y,
            char
        })).filter(a => a.char !== '.'));
        
        const groups = groupBy(antennas, a => a.char);

        const antinodeGroups = Object.values(groups).map(grp => grp.flatMap(antenna => grp.filter(o => o !== antenna).map(otherAntenna => ({
            antenna,
            otherAntenna,
            delta: delta(antenna, otherAntenna)
        }))));

        return antinodeGroups;
    };

    const antinodesWithinBounds = (antinodes: {x: number, y: number}[], grid: string[][]) =>
        antinodes.filter(a => withinBounds(a, grid));
 
    return {
        first: function (input: string): string | number {
            const grid = splitOnNewLines(input).map(line => line.split(""));
            
            const antinodeGroups = gridToAntinodeGroups(grid);
            const antinodes = antinodeGroups.flatMap(grp => grp.flatMap(pair => generateAntinodes(pair.antenna, pair.delta, grid, true))).map(a => a);
            
            const withinBounds = antinodesWithinBounds(antinodes, grid);
            const uniques = new Set(withinBounds.map(a => `${a.x}${a.y}`));

            return uniques.size;
        },

        second: function (input: string): string | number {
            const grid = splitOnNewLines(input).map(line => line.split(""));
            
            const antinodeGroups = gridToAntinodeGroups(grid);
            const antinodes = antinodeGroups.flatMap(grp => grp.flatMap(pair => generateAntinodes(pair.antenna, pair.delta, grid, false))).map(a => a);

            const withinBounds = antinodesWithinBounds(antinodes, grid);

            const uniqueAntinodes = new Set(withinBounds.map(a => `${a.x},${a.y}`));

            for (const aGrp of antinodeGroups) {
                for (const pair of aGrp) {
                    uniqueAntinodes.add(`${pair.antenna.x},${pair.antenna.y}`)
                }
            }

            return uniqueAntinodes.size;
        }
    }
};