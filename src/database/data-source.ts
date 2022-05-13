import "reflect-metadata"
import { DataSource } from "typeorm"
import { User, Post } from "../entity"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "127.0.0.1",
    port: 5433,
    username: "postgres",
    password: "jamesbond007",
    database: "GQL-AUTH",
    synchronize: true,
    logging: false,
    entities: [User, Post],
    migrations: [],
    subscribers: [],
})
