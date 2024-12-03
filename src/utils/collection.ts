const zip = <T1, T2>(firstList: Array<T1>, secondList: Array<T2>) : Array<[T1, T2]> => 
    firstList.map((element, index) => [element, secondList[index]!]);

const sum = (nums: number[]) : number => nums.length ? nums.reduce((a, b) => a + b) : 0;

export { zip, sum};