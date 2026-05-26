const dotenv = require("dotenv");
dotenv.config();
type Application = import("express").Application;
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
import { errorHandler } from "@mainshopapp/common";
import { authRouter } from "./Auth/auth.routers";
const morgan = require("morgan");

class AppModule {
  constructor(public app: Application) {

    // ====================== Middlewares ======================

    app.set("trust-proxy", true);
    app.use(
      cors({
        credentials: true,
        optionsSuccessStatus: 200,
        origin: "*",
      }),
    );
    app.use(urlencoded({ extended: false }));
    app.use(json());
    app.use(
      cookieSession({
        signed: false,
        secure: false,
      }));


    // ====================== Routers ======================

    app.use(morgan("dev"));
    app.use(authRouter);
    app.use(errorHandler as any); // errorHandler is an error-handling middleware; cast to any to satisfy TypeScript overloads
    
    Object.setPrototypeOf(this, AppModule.prototype);
  }


  // ====================== Database Connection =======================  
  async start() {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI must be defined");
    }

    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }

    if (!process.env.STRIPE_KEY) {
      throw new Error("STRIPE_KEY must be defined");
    }

    try {
      await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
      throw new Error("  database connection error");
    }

    const PORT = process.env.PORT;

    this.app.listen(PORT, () =>
      console.log("🔸 Server is running on port: " + PORT),
    );
  }
}

export = AppModule;


