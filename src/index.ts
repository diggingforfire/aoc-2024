import Puzzle from "./types/Puzzle";
import { readInput } from "./utils/input";

const day = process.argv.slice(2)[0];

if (!day) {
    console.error("No day specified, add a day arg to the run script");
    process.exit(1);
}

console.log(`Running day ${day}`);

(async () => {
    const inputPath = `src/days/${day}/input.txt`;
    const input = await readInput(inputPath);
    const { puzzle } = await import(`./days/${day}/puzzle`) as { puzzle: () => Puzzle };
    
    console.log(`  Part 1: ${puzzle().first(input)}`);
    console.log(`  Part 2: ${puzzle().second(input)}`);
})();