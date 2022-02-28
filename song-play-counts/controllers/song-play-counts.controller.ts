import express from 'express';
import { SongPlayCountsListPaginated } from '../models/song-play-counts-paginated';
import { SongWithPlayCount } from '../models/song-with-play-counts';
import TopNSong from '../models/top-n-song';
import songPlayCountsService from '../services/song-play-counts.service';



class SongPlayCountsController {
    async getSongById(req: express.Request, res: express.Response) {
        const getSongPlayCountsByIdResult: SongWithPlayCount | string = 
            await songPlayCountsService.getSongPlayCountsById(req.body.songId);

            res.setHeader('Content-Type', 'application/json');

            if(typeof getSongPlayCountsByIdResult == 'string') {
                res.status(500).send(`Error getting song by id: ${getSongPlayCountsByIdResult}`);
            } else {
                res.status(200).send(getSongPlayCountsByIdResult);
            }
    }
    
    async getSongListPaginated(req: express.Request, res: express.Response) {
        const paginatedSongListResult: SongPlayCountsListPaginated | string = 
            await songPlayCountsService.getSongListPaginated(
                req.body.pageSize,
                req.body.pageNumber,
                req.body.offset,
                req.body.sortBy,
                req.body.sortOrder,
                req.body.songNameFilter,
                req.body.artistFilter,
                req.body.writerFilter,
                req.body.albumFilter,
                req.body.releaseYearFilter
            );
        
        res.setHeader('Content-Type', 'application/json');

        if(typeof paginatedSongListResult == 'string') {
            res.status(500).send(`Error getting song list: ${paginatedSongListResult}`);
        } else {
            res.status(200).send(paginatedSongListResult);
        }
    }

    async getTopN(req: express.Request, res: express.Response) {
        const topNResult: TopNSong[] | string = 
            await songPlayCountsService.getTopN(
                req.body.playYearFilter,
                req.body.sortByMonth,
                req.body.sortOrder,
                req.body.topNFilter
            );
        
        res.setHeader('Content-Type', 'application/json');

        if(typeof topNResult == 'string') {
            res.status(500).send(`Error getting top songs: ${topNResult}`);
        } else {
            res.status(200).send(topNResult);
        }
    }
}

export default new SongPlayCountsController();