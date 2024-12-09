import Puzzle from "../../types/Puzzle";
import { sum } from "../../utils/collection";

export const puzzle = () : Puzzle => {
    
    const inputToBlocks = (input: string) => {
        let id = 0;
        const blocks = [];
        let isBlockFile = true;

        for(let i = 0; i < input.length; i++) {
            const currentChar = input.charAt(i);
            const num = parseInt(currentChar);

            if (isBlockFile) {
                for (let x = 0; x < num; x++) {
                    blocks.push(id.toString());
                }
                id++;
            } else {
                for (let x = 0; x < num; x++) {
                    blocks.push(".");
                }
            }

            isBlockFile = !isBlockFile;
        }

        return blocks;
    };

    const fragmentBlocks = (blocks: string[]) => {

        for (
            let index = blocks.length - 1, firstDotIndex = blocks.indexOf(".");  
            firstDotIndex < index; 
            index--, firstDotIndex = blocks.indexOf(".")) {
            const char = blocks[index]!;
            blocks[firstDotIndex] = char;
            blocks[index] = ".";
        }
        
        return blocks;
    };
    
    const move = (blocks: string[], file: string[], startIndex: number) => {
        let dotIndex = blocks.indexOf(".");
        let offset = 0;

        while (dotIndex !== -1) {
            let c = "";
            let dotCount = 0;
    
            while ( (c = blocks[dotIndex++]!) === ".") {
                dotCount++;
            }
    
            dotIndex = blocks.indexOf(".", offset);
    
            if (file.length <= dotCount && dotIndex <= startIndex) {
                let i = 0;
                while (i < file.length) {
                    blocks[dotIndex + i] = file[i]!;
                    blocks[startIndex + i] = ".";
                    i++;
                }

                break;
            } else {
                offset = dotIndex + dotCount;
                dotIndex = blocks.indexOf(".", offset);
            }
        }
    };

    const fragmentFiles = (blocks: string[]) => {
        const movedNumbers: string[] = [];

        for (
            let index = blocks.length - 1, firstDotIndex = blocks.indexOf(".");  
            firstDotIndex < index; 
            firstDotIndex = blocks.indexOf(".")) {
            
            const file = [];

            let char = blocks[index]!;

            let previous = blocks[index]!;
            
            while (char === previous) {
                file.push(char);
                previous = char;
                char = blocks[--index]!;
            }

            if (file[0] === ".") {
                continue;
            }  

            if (movedNumbers.includes(file[0]!)) {
                continue;
            }

            movedNumbers.push(file[0]!);

            const fileStartIndex = index + 1;
            move(blocks, file, fileStartIndex);
        }
        
        return blocks;
    };

    return {
        first: function (input: string): string | number {
            const blocks = inputToBlocks(input);
            const fragmentedBlocks = fragmentBlocks(blocks);

            return sum(fragmentedBlocks.filter(block => block !== ".").map((block, i) => parseInt(block) * i));
        },
        second: function (input: string): string | number {
            const blocks = inputToBlocks(input);
            const fragmentedFiles = fragmentFiles(blocks);
            
            return sum(fragmentedFiles.map((block, i) => block === "." ? 0 : parseInt(block) * i));
        }
    }
}