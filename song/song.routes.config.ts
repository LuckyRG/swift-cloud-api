import { CommonRoutesConfig } from '../common/common.routes.config';
import express from 'express';
import songController from './controllers/song.controller';
import songMiddleware from './middleware/song.middleware';

export class SongRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'SongRoutes');
    }

    configureRoutes() {
        this.app.route(`/songs`)
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
                songMiddleware.validateRequestParams,
                songMiddleware.sanitiseQuertyParams,
                songController.getSongListPaginated
            )

        this.app.route(`/songs/:songId`)
            .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
                // this middleware function runs before any request to /songs/:songId
                // currently, using next(), it simply passes control to the next function below
                next();
            })

            .get(
                //  #swagger.parameters['songId'] = { description: 'songId', type: 'number' }  
                songMiddleware.validateSongId,
                songMiddleware.moveSongIdToReqBody,
                songController.getSongById
            );

        return this.app;
    }
}