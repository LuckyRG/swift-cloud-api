import express from 'express';
import * as http from 'http';
import 'dotenv/config';

import cors from 'cors';
import { CommonRoutesConfig } from './common/common.routes.config';
import { SongRoutes } from './song/song.routes.config';
import { SongPlayCountsRoutes } from './song-play-counts/song-play-counts.routes.config';

import swaggerUi from 'swagger-ui-express';
import swaggerFile from './swagger/swagger-output.json';

const app: express.Application = express();
const server: http.Server = http.createServer(app);
const port = process.env.PORT;

/** Debugging purposes **/
const routes: Array<CommonRoutesConfig> = [];

// adding middleware to parse all incoming requests as JSON 
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(cors());

// Swagger Doc
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// adding the SongRoutes to routes array,
// after sending the Express.js application object to have the routes added to the app
routes.push(new SongRoutes(app));
routes.push(new SongPlayCountsRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;

app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
});

server.listen(port, () => {
    // routes.forEach((route: CommonRoutesConfig) => {
    //     console.log(`Routes configured for ${route.getName()}`);
    // });

    console.log(runningMessage);
});

