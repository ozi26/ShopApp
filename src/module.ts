const dotenv = require("dotenv");
dotenv.config();
type Application = import("express").Application;
const cors = require("cors");
const { json, urlencoded } = require("body-parser");
const cookieSession = require("cookie-session");
const mongoose = require("mongoose");
import { errorHandler , currentUser } from "@mainshopapp/common";
import { authRouter } from "./Auth/auth.routers";
import { sellerRouters } from "./seller/seller.router";
import { buyerRouters } from "./buyer/buyer.routers";
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

     // ====================== Routers ======================

    this.app.use(morgan("dev"));
    this.app.use(currentUser(process.env.JWT_KEY!) as any);
    this.app.use(authRouter);
    this.app.use(sellerRouters);
    this.app.use(buyerRouters);
    this.app.use(errorHandler as any); // errorHandler is an error-handling middleware; cast to any to satisfy TypeScript overloads
    

    const PORT = process.env.PORT || 8080;

    this.app.listen(PORT, () =>
      console.log("🔸 Server is running on port: " + PORT),
    );
  }
}

export = AppModule;


