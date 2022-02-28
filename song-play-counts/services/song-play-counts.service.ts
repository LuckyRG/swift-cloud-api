import dbConnectionPool from '../../db-config';
import SongWithPlayCount from '../models/song-with-play-counts';
import { SongPlayCountsListPaginated } from '../models/song-play-counts-paginated';
import YearPlayCount from '../models/year-play-count';
import { MonthPlayCount } from '../models/month-play-count';
import Song from '../../song/models/song';
import TopNSong from '../models/top-n-song';

class SongPlayCountsService {
    async getSongPlayCountsById(songId: number): Promise<SongWithPlayCount> {
        const sqlGetSongPlayCountsById = 
            'select s.*, spc.* ' +
            'from public.song s ' +
            'inner join public.songplaycount spc on s.songid = spc.songid ' +
            'where s.songid = $1 ';

        const getSongById = dbConnectionPool.query(sqlGetSongPlayCountsById, [songId])
        .then(queryResult => queryResult.rows)
        .catch(queryError => queryError.message);

        if(typeof getSongById === 'string') {
            return getSongById;
        } else {
            let songPlayCountRows: any[] = await getSongById;

            let songPlayCountYears: YearPlayCount[] = [];

            let songPlayCountTotal: number = 0;
            
            songPlayCountRows?.forEach(songPlayCountRow => {
                let playCountYear: string = songPlayCountRow.playyear;

                if(playCountYear) {
                    let playCountMonthsArray: MonthPlayCount[] = [];

                    let playCountMonthJan: MonthPlayCount = { month: 'January', playcount: songPlayCountRow.january ? parseInt(songPlayCountRow.january) : 0 };
                    let playCountMonthFeb: MonthPlayCount = { month: 'February', playcount: songPlayCountRow.february ? parseInt(songPlayCountRow.february) : 0 };
                    let playCountMonthMar: MonthPlayCount = { month: 'March', playcount: songPlayCountRow.march ? parseInt(songPlayCountRow.march) : 0 };
                    let playCountMonthApr: MonthPlayCount = { month: 'April', playcount: songPlayCountRow.april ? parseInt(songPlayCountRow.april) : 0 };
                    let playCountMonthMay: MonthPlayCount = { month: 'May', playcount: songPlayCountRow.may ? parseInt(songPlayCountRow.may): 0 };
                    let playCountMonthJune: MonthPlayCount = { month: 'June', playcount: songPlayCountRow.june ? parseInt(songPlayCountRow.june) : 0 };
                    let playCountMonthJuly: MonthPlayCount = { month: 'July', playcount: songPlayCountRow.july ? parseInt(songPlayCountRow.july) : 0 };
                    let playCountMonthAug: MonthPlayCount = { month: 'August', playcount: songPlayCountRow.august ? parseInt(songPlayCountRow.august) : 0 }; 
                    let playCountMonthSept: MonthPlayCount = { month: 'September', playcount: songPlayCountRow.september ? parseInt(songPlayCountRow.september): 0 };
                    let playCountMonthOct: MonthPlayCount = { month: 'October', playcount: songPlayCountRow.october ? parseInt(songPlayCountRow.october) : 0 };
                    let playCountMonthNov: MonthPlayCount = { month: 'November', playcount: songPlayCountRow.november ? parseInt(songPlayCountRow.november) : 0 };
                    let playCountMonthDec: MonthPlayCount = { month: 'December', playcount: songPlayCountRow.december ? parseInt(songPlayCountRow.december) : 0 };
    
                    playCountMonthsArray.push(playCountMonthJan, playCountMonthFeb, playCountMonthMar, playCountMonthApr,
                        playCountMonthMay, playCountMonthJune, playCountMonthJuly, playCountMonthAug, playCountMonthSept,
                        playCountMonthOct, playCountMonthNov, playCountMonthDec);
                    
                    let yearPlayCount: number = 0;
                    playCountMonthsArray.forEach(monthPlayCount => {
                        yearPlayCount += monthPlayCount.playcount;
                    })

                    let yearPlayCounts: YearPlayCount = {
                        year: playCountYear,
                        yearPlayCount: yearPlayCount,
                        monthPlayCounts: playCountMonthsArray
                    }

                    songPlayCountTotal += yearPlayCount;
    
                    songPlayCountYears.push(yearPlayCounts)
                }
            });

            let songPlayCounts: SongWithPlayCount = {
                songid: songPlayCountRows?.[0].songid,
                songname: songPlayCountRows?.[0].songname,
                artist: songPlayCountRows?.[0].artist,
                writer: songPlayCountRows?.[0].writer,
                album: songPlayCountRows?.[0].album,
                releaseyear: songPlayCountRows?.[0].releaseyear,
                totalPlayCount: songPlayCountTotal,
                playcounts: songPlayCountYears
            };

            return songPlayCounts;
        }
    }
    
    async getSongListPaginated(pageSize: number | null, pageNumber: number | null, offset: number | null, sortBy: string | null, 
        sortOrder: string | null, songNameFilter: string | null, artistFilter: string | null, writerFilter: string | null,
        albumFilter: string | null, releaseYearFilter: string | null
    ): Promise<SongPlayCountsListPaginated | string> {
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
            
            let returnedRows: Song[] = getSongListPaginated;

            let songsWithPlayCounts: SongWithPlayCount[] = [];

            for(let returnedRow of returnedRows) {
                if(returnedRow.songid) {
                    let songId: number = returnedRow.songid;
                    const songPlayCounts = await this.getSongPlayCountsById(songId);

                    songsWithPlayCounts.push(songPlayCounts);
                }
            }
            
            let songListPaginated: SongPlayCountsListPaginated = {
                pageSize: pageSize ? pageSize : 0,
                totalPages: totalPages,
                totalElements: totalElements,
                currentPage: pageNumber ? pageNumber : 0,
                results: songsWithPlayCounts
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

    async getTopN(playYearFilter: string | null, sortByMonth: string | null, sortOrder: string | null, topNFilter: string | null)
        :Promise<SongWithPlayCount[] | string> {
            let sortByFilter = 
                sortByMonth == 'january' ? 'january ': 
                sortByMonth == 'february' ? 'february ': 
                sortByMonth == 'march' ? 'march ' : 
                sortByMonth == 'april' ? 'april ' : 
                sortByMonth == 'may' ? 'may ' : 
                sortByMonth == 'june' ? 'june ' : 
                sortByMonth == 'july' ? 'july ' : 
                sortByMonth == 'august' ? 'august ' : 
                sortByMonth == 'september' ? 'september ' : 
                sortByMonth == 'october' ? 'october ' : 
                sortByMonth == 'november' ? 'november ' : 
                sortByMonth == 'december' ? 'december ' : 
                'YearPlayCount ';

            let sortOrderFilter = 
                sortOrder == 'asc' ? 'asc ' : 'desc '
            
            const sqlGetTopNPlayCount = 
            `select s.*, spc.*, ` +
            `(coalesce(spc.january , 0) + coalesce(spc.february, 0) + coalesce(spc.march, 0) + ` +
            ` coalesce(spc.april, 0) + coalesce(spc.may, 0) + coalesce(spc.june, 0) + ` +
            ` coalesce(spc.july, 0) + coalesce(spc.august, 0) + coalesce(spc.september, 0) + coalesce(spc.october, 0) + ` +
            ` coalesce(spc.november, 0) + coalesce(spc.december, 0)) as YearPlayCount ` +
            `from public.song s ` +
            `inner join public.songplaycount spc on s.songid = spc.songid ` +
            `where spc.playyear = $1 ` +
            `order by ` + sortByFilter  + sortOrderFilter +
            `limit $2`;

            const getTopNPlayCountRows = await dbConnectionPool.query(
                sqlGetTopNPlayCount, 
                [playYearFilter, topNFilter])
            .then(result => result.rows)
            .catch(error => error.message);

            if(typeof getTopNPlayCountRows  != 'string') {
                let topNRows: any[] = getTopNPlayCountRows;

                let topNSongs: TopNSong[] = [];

                topNRows.forEach(topNRow => {  
                    let songPlayCounts: TopNSong = {
                        songid: topNRow.songid,
                        songname: topNRow.songname,
                        artist: topNRow.artist,
                        writer: topNRow.writer,
                        album: topNRow.album,
                        releaseyear: topNRow.releaseyear,
                        yearPlayCount: parseInt(topNRow.yearplaycount),
                        january: parseInt(topNRow.january),
                        february: parseInt(topNRow.february),
                        march: parseInt(topNRow.march),
                        april: parseInt(topNRow.april),
                        may: parseInt(topNRow.may),
                        june: parseInt(topNRow.june),
                        july: parseInt(topNRow.july),
                        august: parseInt(topNRow.august),
                        september: parseInt(topNRow.september),
                        october: parseInt(topNRow.october),
                        november: parseInt(topNRow.november),
                        december: parseInt(topNRow.december)
                    };

                    topNSongs.push(songPlayCounts);
                })

                return topNSongs;
            } else {
               return getTopNPlayCountRows;
            }
    }
}

export default new SongPlayCountsService();