import * as dotenv from 'dotenv'
dotenv.config()
import { DataSource } from 'typeorm'

export const DBDataSource = new DataSource({
    type: 'mysql',
    host: process.env.HOST,
    port: parseInt(`${process.env.DB_PORT}`),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE,
    synchronize: false,
    logging: true,
    entities: ['src/entities/*.ts'],
    migrations: ['src/migrations/*.ts'],
    subscribers: [],
})
