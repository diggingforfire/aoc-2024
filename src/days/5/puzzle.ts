import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";
import { splitOnDoubleNewLines, splitOnNewLines } from "../../utils/input";

type Rule = {
    page1: number;
    page2: number;
};

export const puzzle = () : Puzzle => {
    const inputToRulesAndUpdates = (input: string) : [Rule[], number[][]] => {
        const [rulesInput, updatesInput] = splitOnDoubleNewLines(input);
        
        const rules: Rule[] = splitOnNewLines(rulesInput!)
            .map(line => line.split('|')) .map(rule => ({
                page1: parseInt(rule[0]!), 
                page2: parseInt(rule[1]!) } as Rule)
            );
        
        const updates: number[][] = splitOnNewLines(updatesInput!)
            .map(line => line.split(',').map(num => parseInt(num)));

        return [rules, updates];
    };

    const updateIsCorrectlyOrdered = (update: number[], rules: Rule[]) => {
        const indices = rules.map(rule => ({
            page1Index: update.findIndex(u => u === rule.page1),
            page2Index: update.findIndex(u => u === rule.page2)
        })).filter(rule => rule.page1Index !== -1 && rule.page2Index !== -1);

        return indices.every(rule => rule.page1Index < rule.page2Index);
    }

    const sumMiddles = (updates: number[][]) : number => 
        sum(updates.map(update => update[Math.floor(update.length / 2)]!));

    return {
        first: function (input: string): string | number {
            const [rules, updates] = inputToRulesAndUpdates(input);

            const correctUpdates = updates.filter(update => 
                updateIsCorrectlyOrdered(update, rules)
            );

            return sumMiddles(correctUpdates);
        },

        second: function (input: string): string | number {
            const [rules, updates] = inputToRulesAndUpdates(input);

            const incorrectUpdates = updates.filter(update => 
                !updateIsCorrectlyOrdered(update, rules)
            );

            const sorter = (a: number, b: number) => {
                const rule = rules.filter(rule => 
                    (rule.page1 === a && rule.page2 === b))[0];
                return rule?.page1 === a ? -1 : 1;
            }

            const reorderedIncorrectUpdates = incorrectUpdates.map(update => update.toSorted(sorter));
            
            return sumMiddles(reorderedIncorrectUpdates);
        }
    };
};