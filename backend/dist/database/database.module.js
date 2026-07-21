"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const database_service_1 = require("./database.service");
const entities_1 = require("./entities");
const entities = [
    entities_1.Tenant, entities_1.User, entities_1.Client, entities_1.TaxProfile, entities_1.Document,
    entities_1.DocumentRequest, entities_1.DocumentReview, entities_1.Workflow,
    entities_1.Notification, entities_1.Subscription,
];
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'postgres',
                    host: config.get('DB_HOST', 'localhost'),
                    port: config.get('DB_PORT', 5432),
                    username: config.get('DB_USERNAME', 'postgres'),
                    password: config.get('DB_PASSWORD', 'postgres'),
                    database: config.get('DB_DATABASE', 'rentdecla'),
                    entities,
                    synchronize: config.get('NODE_ENV') === 'development',
                    logging: config.get('NODE_ENV') === 'development',
                }),
            }),
            typeorm_1.TypeOrmModule.forFeature(entities),
        ],
        providers: [database_service_1.DatabaseService],
        exports: [typeorm_1.TypeOrmModule, database_service_1.DatabaseService],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map