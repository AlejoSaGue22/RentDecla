"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV ?? 'development',
    port: parseInt(process.env.PORT ?? '3000', 10),
    appName: process.env.APP_NAME ?? 'RentDecla API',
    corsOrigin: process.env.CORS_ORIGIN ?? 'http://192.168.1.77:4200'
}));
//# sourceMappingURL=app.config.js.map