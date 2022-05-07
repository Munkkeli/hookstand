export declare const deepDiff: (a: any, b: any, path?: string[]) => string[];
export declare const pickByGet: (obj: any, paths: readonly string[]) => any;
export declare const getPartial: (obj: any, paths: readonly string[]) => any;
export declare const compareByGet: (a: any, b: any, deps: readonly string[]) => [any, any];
