import Puzzle from "../../types/Puzzle";
import { splitOnNewLines, splitOnWhiteSpace } from "../../utils/input";

export const puzzle = () : Puzzle => {
    const isSafe = (reportSteps: number[][]) => 
        reportSteps.some(allLevelsIncreaseOrDecrease) &&
        reportSteps.some(report => allLevelsDiffBy(report))

    const allLevelsIncreaseOrDecrease = (report: number[]) => 
        report.every(level => level < 0) || report.every(level => level > 0);
    
    const allLevelsDiffBy = (report: number[], min: number = 1, max: number = 3) => 
        report.every(level => Math.abs(level) >= min && Math.abs(level) <= max);

    const inputToReports = (input: string) : number[][] => splitOnNewLines(input)
        .map(splitOnWhiteSpace)
        .map(line => line.map(num => parseInt(num)));

    const reportsToSteps = (allPossibleReports: number[][][]) => {
        return allPossibleReports.map(all => all.map(report => report.slice(0, -1).map((level, i) => 
        ({
            level, 
            nextLevel: report[i + 1]
        })).map(s => s.nextLevel! - s.level)));
    };
    
    return {
        first: function (input: string): string | number {
            const reports = inputToReports(input).map(report => [report]);
            return reportsToSteps(reports).filter(isSafe).length;
        },
    
        second: function (input: string): string | number  {
            const reports = inputToReports(input);
            const allPossibleReports = reports.map(nums => [nums, ...nums.map((_, i) => nums.filter((_, y) => i !== y))]);
            return reportsToSteps(allPossibleReports).filter(isSafe).length;
        }
    };
}; 