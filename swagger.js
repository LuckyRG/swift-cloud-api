const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'SwiftCloud API',
        description: 'An API for keeping track of how many plays your fav Taylor Swift songs get! (by Stas Vas)'
    },
    host: 'localhost:3000',
    schemes: ['http'],
};
  
const outputFile = './swagger/swagger-output.json';
const endpointsFiles = ['./song/song.routes.config.ts', './song-play-counts/song-play-counts.routes.config.ts'];

/* NOTE: if you use the express Router, you must pass in the 
    'endpointsFiles' only the root file where the route starts,
    such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);