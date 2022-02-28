import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import songPlayCountsMiddleware from './middleware/song-play-counts.middleware';
import songPlayCountsController from './controllers/song-play-counts.controller';

export class SongPlayCountsRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SongPlayCountsRoutes');
    }

    configureRoutes() {
        this.app.route(`/song-play-counts`)
            .get(
                //  #swagger.parameters['pageSize'] = { description: 'pageSize', type: 'number' }    
                //  #swagger.parameters['pageNumber'] = { description: 'pageNumber', type: 'number' }    
                //  #swagger.parameters['sortBy'] = { description: 'sortBy', type: 'string'  }   
                //  #swagger.parameters['sortOrder'] = { description: 'sortOrder', type: 'string'  }    
                //  #swagger.parameters['songName'] = { description: 'songName' , type: 'string' }    
                //  #swagger.parameters['artist'] = { description: 'artist' , type: 'string' }  
                //  #swagger.parameters['writer'] = { description: 'writer', type: 'string'  }    
                //  #swagger.parameters['album'] = { description: 'album', type: 'string'}    
                //  #swagger.parameters['releaseYear'] = { description: 'releaseYear', type: 'number' }     
                songPlayCountsMiddleware.validatePlayCountsParams,
                songPlayCountsMiddleware.sanitisePlayCountsParams,
                songPlayCountsController.getSongListPaginated
            );

        this.app.route(`/song-play-counts/top`)
            .get(
                //  #swagger.parameters['playYear'] = { description: 'playYear', type: 'number' }    
                //  #swagger.parameters['topN'] = { description: 'topN', type: 'number' }    
                //  #swagger.parameters['sortByMonth'] = { description: 'sortByMonth', type: 'string'  }   
                //  #swagger.parameters['sortOrder'] = { description: 'sortOrder', type: 'string'  }
                songPlayCountsMiddleware.validateGetTopNParams,
                songPlayCountsMiddleware.sanitiseGetTopNParams,
                songPlayCountsController.getTopN
            );

        this.app.route(`/song-play-counts/:songId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                next();
            })

            .get(
                //  #swagger.parameters['songId'] = { description: 'songId', type: 'number' }    
                songPlayCountsMiddleware.validateSongId,
                songPlayCountsMiddleware.moveSongIdToReqBody,
                songPlayCountsController.getSongById
            );

        return this.app;
    }
}