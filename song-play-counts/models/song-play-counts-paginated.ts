import { SongWithPlayCount } from "./song-with-play-counts";


export interface SongPlayCountsListPaginated {
    pageSize: number;
    totalPages: number;
    totalElements: number;
    currentPage: number;
    results: SongWithPlayCount[];
}

export default SongPlayCountsListPaginated;