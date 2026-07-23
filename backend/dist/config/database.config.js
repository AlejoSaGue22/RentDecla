"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD ?? '2201',
    database: process.env.DB_DATABASE ?? 'sql_curso',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: (process.env.NODE_ENV ?? 'development') === 'development',
    logging: (process.env.NODE_ENV ?? 'development') === 'development',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
}));
//# sourceMappingURL=database.config.js.map