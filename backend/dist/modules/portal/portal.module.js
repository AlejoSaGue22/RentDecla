"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const portal_controller_1 = require("./portal.controller");
const portal_service_1 = require("./portal.service");
const client_entity_1 = require("../../database/entities/client.entity");
const tax_profile_entity_1 = require("../../database/entities/tax-profile.entity");
const document_entity_1 = require("../../database/entities/document.entity");
const document_request_entity_1 = require("../../database/entities/document-request.entity");
const workflow_entity_1 = require("../../database/entities/workflow.entity");
const notification_entity_1 = require("../../database/entities/notification.entity");
let PortalModule = class PortalModule {
};
exports.PortalModule = PortalModule;
exports.PortalModule = PortalModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                client_entity_1.Client,
                tax_profile_entity_1.TaxProfile,
                document_entity_1.Document,
                document_request_entity_1.DocumentRequest,
                workflow_entity_1.Workflow,
                notification_entity_1.Notification,
            ]),
            platform_express_1.MulterModule.register({ storage: (0, multer_1.memoryStorage)() }),
        ],
        controllers: [portal_controller_1.PortalController],
        providers: [portal_service_1.PortalService],
    })
], PortalModule);
//# sourceMappingURL=portal.module.js.map