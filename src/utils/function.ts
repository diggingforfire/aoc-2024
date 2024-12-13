const memoize = <T = any>(fn: (...args: any) => T) => {
    const cache = new Map<string, T>();

    return (...args: any) => {
        const stringifiedArgs = JSON.stringify(args);
        if (cache.has(stringifiedArgs)) {
            return cache.get(stringifiedArgs);
        } else {
            const result = fn(...args);
            cache.set(stringifiedArgs, result);
            return result;
        }
    };
};

export { memoize }