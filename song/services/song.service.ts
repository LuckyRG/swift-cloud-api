import Song from '../models/song';
import dbConnectionPool from '../../db-config';
import { SongListPaginated } from '../models/songs.paginated';

class SongService {
    async getSongById(songId: number): Promise<Song> {
        const sqlGetSongById = 'SELECT * FROM public.song WHERE songid = $1';

        const getSongById = dbConnectionPool.query(sqlGetSongById, [songId])
        .then(queryResult => queryResult.rows?.[0])
        .catch(queryError => queryError.message);

        if(typeof getSongById === 'string') {
            return getSongById;
        } else {
            return getSongById;
        }
    }
    
    async getSongListPaginated(pageSize: number | null, pageNumber: number | null, offset: number | null, sortBy: string | null, 
        sortOrder: string | null, songNameFilter: string | null, artistFilter: string | null, writerFilter: string | null,
        albumFilter: string | null, releaseYearFilter: string | null
    ): Promise<SongListPaginated | string> {
        let sortByFilter = 
            sortBy == 'songName' ? 'songname ': 
                sortBy == 'artist' ? 'artist ': 
                    sortBy == 'writer' ? 'writer ' : 
                        sortBy == 'album' ? 'album ' : 
                            sortBy == 'releaseYear' ? 'releaseyear ' : 
                            'songid ';

        let sortOrderFilter = 
            sortOrder == 'desc' ? 'desc ' : 'asc '

        const sqlGetSongsPaginated = 
            'select * ' + 
            'from public.song s ' + 
            'where ' +
            's.songname = coalesce( $3 , s.songname) and ' +
            's.artist = coalesce( $4 , s.artist) and ' +
            's.writer = coalesce( $5 , s.writer) and ' +
            's.album = coalesce( $6 , s.album) and ' +
            's.releaseyear = coalesce( $7 , s.releaseyear) ' +
            'order by ' + sortByFilter + sortOrderFilter +
            'limit $1 offset $2';
        
        const getSongListPaginated = await dbConnectionPool.query(
                sqlGetSongsPaginated, 
                [pageSize, offset, songNameFilter, artistFilter, writerFilter, albumFilter, releaseYearFilter]
        ).then(
            queryResult => queryResult.rows
        ).catch(
            queryError => queryError.message
        );

        if(typeof getSongListPaginated === 'string') {
            return getSongListPaginated;
        } else {
            const totalRows: string = await this.getTotalRows(songNameFilter, artistFilter, writerFilter, albumFilter, releaseYearFilter);
            const totalElements: number = parseInt(totalRows);
            const totalPages: number = pageSize ? Math.ceil(parseInt(totalRows)/pageSize) : 1;
            
            let songListPaginated: SongListPaginated = {
                pageSize: pageSize ? pageSize : 0,
                totalPages: totalPages,
                totalElements: totalElements,
                currentPage: pageNumber ? pageNumber : 0,
                results: getSongListPaginated
            }

            return songListPaginated;
        }
    }

    async getTotalRows(songNameFilter: string | null, artistFilter: string | null, writerFilter: string | null,
        albumFilter: string | null, releaseYearFilter: string | null): Promise<string> {
        const sqlGetTotalSongRows = 
            `select COUNT(*) ` +
            `FROM ( ` +
            `  SELECT ` +
            `    DISTINCT ON (songid) songid ` +
            `  FROM ` +
            `   public.song s ` +
            `  where ` +
            `  s.songname = coalesce( $1 , s.songname) and ` +
            `  s.artist = coalesce( $2 , s.artist) and ` +
            `  s.writer = coalesce( $3 , s.writer) and ` +
            `  s.album = coalesce( $4 , s.album) and ` +
            `  s.releaseyear = coalesce( $5 , s.releaseyear) ` +
            `) AS count;`;
        
        const getTotalSongRows = await dbConnectionPool.query(
            sqlGetTotalSongRows, 
            [songNameFilter, artistFilter, writerFilter, albumFilter, releaseYearFilter])
        .then(result => result.rows?.[0])
        .catch(error => error.message);

        if(typeof getTotalSongRows  != 'string') {
            let totalSongRows: any = getTotalSongRows?.count;
            return totalSongRows;
        } else {
           return '0';
        }
    }
}

export default new SongService();