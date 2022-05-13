import "reflect-metadata";
import { DataSource } from "typeorm";
import { Audiance } from "../entity/Audiance";

export const MongoDataSource = new DataSource({
  type: "mongodb",
  url: "mongodb+srv://thorosol:Thorosol12%21@cluster0.4m2xs.mongodb.net/GQL-AUTH?authSource=admin&replicaSet=atlas-81s0qc-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true",
  useNewUrlParser: true,
  synchronize: true,
  logging: true,
  entities: [Audiance],
});
