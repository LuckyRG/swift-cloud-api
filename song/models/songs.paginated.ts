import Song from "./song";

export interface SongListPaginated {
    pageSize: number;
    totalPages: number;
    totalElements: number;
    currentPage: number;
    results: Song[];
}

export default SongListPaginated;