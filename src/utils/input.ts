import { readFile, writeFileSync } from "fs";
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

const writeOutput = (outputPath: string, contents: string) => writeFileSync(outputPath, contents);
const splitOn = (input: string, separator: string | RegExp) : string[] => input.split(separator).filter(Boolean);
const splitOnNewLines = (input: string) : string[] => splitOn(input, EOL);
const splitOnDoubleNewLines = (input: string) : string[] => splitOn(input, `${EOL}${EOL}`);
const splitOnWhiteSpace = (input: string) : string[] => splitOn(input, /\s+/);

export { readInput, writeOutput, splitOnNewLines, splitOnDoubleNewLines, splitOnWhiteSpace };