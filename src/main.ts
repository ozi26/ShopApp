import { JwtPayload } from "@mainshopapp/common";
import express = require("express");
const AppModule = require("./module");


declare global { 
  namespace Express {
    export interface Request {
      currentUser?: JwtPayload ;
      uploaderError?: Error;
    }
  }
}

const bootstrap = async () => {
  const app = new AppModule(express());
 
  await app.start();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});