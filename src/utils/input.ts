import { readFile } from "fs";
import { EOL } from "os";

const readInput = (inputPath: string) : Promise<string> => 
    new Promise<string>((resolve, reject) => {
        readFile(inputPath, 'utf-8', (error, data) => {
          if (error) {
            reject(error);
          }
          resolve(data);
        });
      });
;

const splitOn = (input: string, separator: string | RegExp) : string[] => input.split(separator).filter(Boolean);
const splitOnNewLines = (input: string) : string[] => splitOn(input, EOL);
const splitOnWhiteSpace = (input: string) : string[] => splitOn(input, /\s+/);

export { readInput, splitOnNewLines, splitOnWhiteSpace };