import YearPlayCount from "./year-play-count";

export interface SongWithPlayCount {
    songid?: number;
    songname?: string;
    artist?: string;
    writer?: string;
    album?: string;
    releaseyear?: number;
    totalPlayCount?: number;
    playcounts?: YearPlayCount[];
}

export default SongWithPlayCount;