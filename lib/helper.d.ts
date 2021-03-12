import "cheerio";
export declare function getFieldName(header: string): any;
export declare function readTable<T>($: CheerioStatic, table: CheerioElement): T;
export declare function readTableWithHeader<T>($: CheerioStatic, table: CheerioElement, headerIndex?: number): T[];
