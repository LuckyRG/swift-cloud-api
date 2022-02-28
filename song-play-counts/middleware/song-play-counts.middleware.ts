import express from 'express';
import { ValidationResult } from 'joi';
import paginationValidator from '../../common/validators/pagination.validator';
import songPlayCountsValidator from '../validators/song-play-counts.validator';
import topNValidator from '../validators/top-n-validator';

class SongPlayCountsMiddleware {
    async validateSongId(   
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const validateSongId: ValidationResult = songPlayCountsValidator.validate({
            songid: req.params.songId
        })

        if(validateSongId.error == null) {
            next();
        } else {
            res.status(400).send(`Invalid song id ${req.params.songId}: ${validateSongId.error}`);
        }
    }    

    async validatePlayCountsParams(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const validatePagination: ValidationResult = paginationValidator.validate({
            pageSize: req.query.pageSize ? req.query.pageSize : 0,
            pageNumber: req.query.pageNumber ? req.query.pageNumber : 0,
            sortBy: req.query.sortBy ? req.query.sortBy : 'songId',
            sortOrder: req.query.sortOrder ? req.query.sortOrder : 'asc',
            songName: req.query.songName,
            artist: req.query.artist,
            writer: req.query.writer,
            album: req.query.album,
            releaseYear: req.query.releaseYear
        });

        if(validatePagination.error == null) {
            next();
        } else {
            res.status(400).send(`Invalid pagination parameters: ${validatePagination.error}`);
        }
    }

    async moveSongIdToReqBody(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        let songId: number = parseInt(req.params.songId);
        req.body.songId = songId;
        
        next();
    }

    async sanitisePlayCountsParams( 
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        let pageSize: number | null = req.query.pageSize ? parseInt(req.query.pageSize.toString()) : null;
        let pageNumber:  number | null =  req.query.pageNumber ? parseInt(req.query.pageNumber.toString()) : null;

        pageNumber = pageNumber == 0 ? null : pageNumber;

        // offset formula = (pageSize - 1) * pageNumber
        let offset: number | null = 
            pageSize != null && pageSize != undefined && pageNumber != null && pageNumber != undefined ?
            (pageNumber - 1) * pageSize
            : null;

        let sortBy: string | null = req.query.sortBy ? req.query.sortBy.toString() : null;
        let sortOrder: string | null = req.query.sortOrder ? req.query.sortOrder.toString() : null;

        let songNameFilter: string | null = req.query.songName ? req.query.songName.toString() : null;
        let artistFilter: string | null = req.query.artist ? req.query.artist.toString() : null;
        let writerFilter: string | null = req.query.writer ? req.query.writer.toString() : null;
        let albumFilter: string | null = req.query.album ? req.query.album.toString() : null;
        let releaseYearFilter: string | null = req.query.releaseYear ? req.query.releaseYear.toString() : null;

        // Add params to body for easier extraction later
        req.body.pageSize = pageSize;
        req.body.pageNumber = pageNumber;
        req.body.offset = offset;
        req.body.sortBy = sortBy;
        req.body.sortOrder = sortOrder;
        req.body.songNameFilter = songNameFilter;
        req.body.artistFilter = artistFilter;
        req.body.writerFilter = writerFilter;
        req.body.albumFilter = albumFilter;
        req.body.releaseYearFilter = releaseYearFilter;

        next();
    }

    async validateGetTopNParams(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const validatePagination: ValidationResult = topNValidator.validate({
            playYear: req.query.playYear ? req.query.playYear : (new Date().getFullYear()) - 1,
            topN: req.query.topN ? req.query.topN : 10,
            sortByMonth: req.body.sortByMonth,
            sortOrder: req.body.sortOrder
        });

        if(validatePagination.error == null) {
            next();
        } else {
            res.status(400).send(`Invalid parameters: ${validatePagination.error}`);
        }
    }

    async sanitiseGetTopNParams( 
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        let topNFilter: string | null = req.query.topN ? req.query.topN.toString() : (10).toString();
        let playYearFilter: string | null = req.query.playYear ? req.query.playYear.toString() : ((new Date().getFullYear()) - 1).toString();
        let sortByMonth: string | null = req.query.sortByMonth ? req.query.sortByMonth.toString() : null;
        let sortOrder: string | null = req.query.sortOrder ? req.query.sortOrder.toString() : null;

        req.body.playYearFilter = playYearFilter;
        req.body.sortByMonth = sortByMonth;
        req.body.sortOrder = sortOrder;     
        req.body.topNFilter = topNFilter;

        next();
    }
}

export default new SongPlayCountsMiddleware();