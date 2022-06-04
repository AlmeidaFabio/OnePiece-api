import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.TYPEORM_HOST,
    port: Number(process.env.TYPEORM_PORT),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    logging: Boolean(process.env.TYPEORM_SYNCHRONIZE),
    synchronize: Boolean(process.env.TYPEORM_LOGGING),
    entities: [
        "src/entities/**{.ts,.js}"
    ],
    migrations: [
        "src/database/migrations/**{.ts,.js}"
    ]
})