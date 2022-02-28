import express from 'express';
import { SongListPaginated } from '../models/songs.paginated';
import { Song } from '../models/song';

// we import our newly created user services
import usersService from '../services/song.service';


class SongController {
    async getSongById(req: express.Request, res: express.Response) {
        const getSongByIdResult: Song | string = 
            await usersService.getSongById(req.body.songId);

            res.setHeader('Content-Type', 'application/json');

            if(typeof getSongByIdResult == 'string') {
                res.status(500).send(`Error getting song by id: ${getSongByIdResult}`);
            } else {
                res.status(200).send(getSongByIdResult);
            }
    }
    
    async getSongListPaginated(req: express.Request, res: express.Response) {
        const paginatedSongListResult: SongListPaginated | string = 
            await usersService.getSongListPaginated(
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
}

export default new SongController();