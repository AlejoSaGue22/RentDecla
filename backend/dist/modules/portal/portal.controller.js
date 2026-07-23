"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const portal_service_1 = require("./portal.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const update_personal_info_dto_1 = require("./dto/update-personal-info.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_decorator_2 = require("../../common/decorators/roles.decorator");
let PortalController = class PortalController {
    portalService;
    constructor(portalService) {
        this.portalService = portalService;
    }
    getProfile(user) {
        return this.portalService.getProfile(user);
    }
    updatePersonalInfo(user, dto) {
        return this.portalService.updatePersonalInfo(user, dto);
    }
    changePassword(user, dto) {
        return this.portalService.changePassword(user, dto);
    }
    getDocuments(user) {
        return this.portalService.getDocuments(user);
    }
    async downloadDocument(id, user, res) {
        const { stream, mimeType, originalName } = await this.portalService.getDocumentStream(id, user);
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
        stream.pipe(res);
    }
    uploadDocument(file, user, category, documentRequestId) {
        return this.portalService.uploadDocument(file, user, category, documentRequestId);
    }
    getDocumentRequests(user) {
        return this.portalService.getDocumentRequests(user);
    }
    getWorkflows(user) {
        return this.portalService.getWorkflows(user);
    }
    getNotifications(user) {
        return this.portalService.getNotifications(user);
    }
    markNotificationRead(id) {
        return this.portalService.markNotificationRead(id);
    }
    markAllNotificationsRead(user) {
        return this.portalService.markAllNotificationsRead(user);
    }
    updateProfile(user, dto) {
        return this.portalService.updateProfile(user, dto);
    }
};
exports.PortalController = PortalController;
__decorate([
    (0, common_1.Get)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client own profile with summary' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('me'),
    (0, swagger_1.ApiOperation)({ summary: 'Update client personal info' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_personal_info_dto_1.UpdatePersonalInfoDto]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "updatePersonalInfo", null);
__decorate([
    (0, common_1.Patch)('password'),
    (0, swagger_1.ApiOperation)({ summary: 'Change client password' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('documents'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client own documents' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getDocuments", null);
__decorate([
    (0, common_1.Get)('documents/:id/download'),
    (0, swagger_1.ApiOperation)({ summary: 'Download a document' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PortalController.prototype, "downloadDocument", null);
__decorate([
    (0, common_1.Post)('documents/upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiOperation)({ summary: 'Upload a document from client portal' }),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)('category')),
    __param(3, (0, common_1.Body)('documentRequestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String, String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "uploadDocument", null);
__decorate([
    (0, common_1.Get)('document-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client document requests (checklist)' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getDocumentRequests", null);
__decorate([
    (0, common_1.Get)('workflows'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client workflows' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getWorkflows", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get client notifications' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Patch)('notifications/:id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark notification as read' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "markNotificationRead", null);
__decorate([
    (0, common_1.Patch)('notifications/read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "markAllNotificationsRead", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update client tax profile' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdatePortalProfileDto]),
    __metadata("design:returntype", void 0)
], PortalController.prototype, "updateProfile", null);
exports.PortalController = PortalController = __decorate([
    (0, swagger_1.ApiTags)('Portal del Cliente'),
    (0, common_1.Controller)('portal'),
    (0, roles_decorator_1.Roles)(roles_decorator_2.UserRole.CLIENT),
    __metadata("design:paramtypes", [portal_service_1.PortalService])
], PortalController);
//# sourceMappingURL=portal.controller.js.map