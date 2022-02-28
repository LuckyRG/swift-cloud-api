import express from 'express';
import bodyParser from 'body-parser';

export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;

        this.configureRoutes();

        bodyParser.json();
        bodyParser.urlencoded({ extended: true });
    }

    abstract configureRoutes(): express.Application;
    
    getName() {
        return this.name;
    }
}