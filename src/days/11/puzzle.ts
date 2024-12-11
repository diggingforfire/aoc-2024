import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";

export const puzzle = () : Puzzle => {

    const blink = (stone: number)  => {
        if (stone === 0) {
            return [1];
        } else if (stone.toString().length % 2 === 0) {
            const str = stone.toString();
            
            const s1 = parseInt(str.slice(0, str.length / 2))
            const s2 = parseInt(str.slice(str.length / 2, str.length));

            return [s1, s2];
        }
        else {
            return [stone * 2024];
        }
    };

    return {
        first: function (input: string): string | number {
            const stonesInput = input.split(" ").map(n => parseInt(n));

            let sum = 0;
    
            for (const stone of stonesInput) {
                let result = [stone];

                for (let i = 0; i < 25; i++) {
                    result = result.flatMap(r => blink(r));
                }
                
                sum += result.length;
            }

            

            return sum;
        },
        second: function (input: string): string | number {
            return 0
        }
    }
}
