import Puzzle from "../../types/Puzzle";

export const puzzle = () : Puzzle => {
    return {
        first: function (input: string): string | number {
            const stones = input.split(" ").map(n => parseInt(n));
            
            let i = 0;
            const blinkCount = 25;

            const cache = new Map<number, number>();
            const cache2 = new Map<number, number[]>();

            while (i < blinkCount) {
                console.log(i+1 + " " + stones.length);
                let stoneCount = stones.length;
                
                for (let j = 0; j < stones.length; j++) {
                    const stone = stones[j]!;

                    if (stone === 0) {
                        stones[j] = 1;
                    } else if (stone.toString().length % 2 === 0) {
                        const str = stone.toString();
                        const s1 = parseInt(str.slice(0, str.length / 2))
                        const s2 = parseInt(str.slice(str.length / 2, str.length));

                        if (cache2.has(stone)) {
                            const nums = cache2.get(stone)!;
                            stones[j] = nums[0]!;
                            stones.splice(j + 1, 0, nums[1]!);
                        } else {
                            stones[j] = s1;
                            stones.splice(j + 1, 0, s2);
                            cache2.set(stone, [s1, s2]);
                        }

                        stoneCount = stones.length;
                        j++;
                    } else {
                        if (cache.has(stones[j]!)) {
                            stones[j] = cache.get(stones[j]!)!;
                        } else {
                            const n = stones[j]! * 2024;
                            cache.set(stones[j]!, n);
                            stones[j] = n;
                        }
                    }
                }

                i++;
            }
            
            return stones.length;
        },
        second: function (input: string): string | number {
            return 0
        }
    }
}
