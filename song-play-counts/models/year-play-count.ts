import { MonthPlayCount } from "./month-play-count";

export interface YearPlayCount {
    year: string;
    yearPlayCount: number;
    monthPlayCounts: MonthPlayCount[];
}

export default  YearPlayCount;