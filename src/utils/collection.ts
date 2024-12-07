const zip = <T1, T2>(firstList: Array<T1>, secondList: Array<T2>) : Array<[T1, T2]> => 
    firstList.map((element, index) => [element, secondList[index]!]);

const sum = (nums: number[]) : number => nums.length ? nums.reduce((a, b) => a + b) : 0;

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

const combinations = <T>(array: T[]) => 
  array.flatMap((item1, index) => array.slice(index + 1).map(item2 => ({item1, item2})));

const permutations = <T>(xs: T[]) : T[][] => {
  if (!xs.length) return [[]];
  return xs.flatMap(x => {
    return permutations(xs.filter(v => v!==x)).map(vs => [x, ...vs]);
  });
};

function* cartesian<T>(items: T[][]): Generator<T[]> {
  const remainder = items.length > 1 ? cartesian(items.slice(1)) : [[]];
  for (let r of remainder) for (let h of items.at(0)!) yield [h, ...r];
}

export { zip, sum, groupBy, combinations, permutations, cartesian };