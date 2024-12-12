import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";
import { memoize } from "../../utils/function";

export const puzzle = () : Puzzle => {

    let memoizedBlink: (stone: number, iteration: number, max: number) => number;
    
    const blink = (stone: number, iteration: number, max: number) : number  => {
        if (iteration === max) {
            return 1;
        }

        if (stone === 0) {
            return memoizedBlink(1, iteration + 1, max);
        } else if (stone.toString().length % 2 === 0) {
            const str = stone.toString();
            
            const s1 = parseInt(str.slice(0, str.length / 2))
            const s2 = parseInt(str.slice(str.length / 2, str.length));

            return memoizedBlink(s1, iteration + 1, max) + blink(s2, iteration + 1, max);
        }
        else {
            return memoizedBlink(stone * 2024, iteration + 1, max);
        }
    };

    memoizedBlink = memoize(blink) as (stone: number, iteration: number, max: number) => number;

    const inputToStones = (input: string) => input.split(" ").map(stone => parseInt(stone));
   
    return {
        first: function (input: string): string | number {
            return sum(inputToStones(input).map(stone => memoizedBlink(stone, 0, 25) ));
        },
        second: function (input: string): string | number {
            return sum(inputToStones(input).map(stone => memoizedBlink(stone, 0, 75) ));
        }
    }
}
