const express = require("express");
// import express from "express";
import dotenv from "dotenv";
import { createConnection } from "typeorm";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import "reflect-metadata";
// Own
import errorHandler from "./utils/errorHandler";
// ENTITIES
import Rajal from "./entities/rajal";
// ROUTER
import rajalRouter from "./routes/rajal.routes";
dotenv.config();

// Router
// Error Handler

const main = async (): Promise<void> => {
  try {
    await createConnection({
      type: "mysql",
      host: process.env.DB_HOST,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      synchronize: true,
      logging: true,
      entities: [Rajal],
    });
    console.log("Database Connected");

    const app = express();

    if (process.env.NODE_ENV !== "production") {
      app.use(morgan("dev"));
    }
    app.use(cors());
    app.use(helmet());
    app.use(express.json());

    //   ROUTE
    app.use("/api/v1/rajal", rajalRouter);
    app.use(errorHandler);
    const port = process.env.PORT;

    app.listen(port, () => {
      console.log(`App Running in Port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};
main();
