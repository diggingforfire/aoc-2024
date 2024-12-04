const zip = <T1, T2>(firstList: Array<T1>, secondList: Array<T2>) : Array<[T1, T2]> => 
    firstList.map((element, index) => [element, secondList[index]!]);

const sum = (nums: number[]) : number => nums.length ? nums.reduce((a, b) => a + b) : 0;

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

export { zip, sum, groupBy };