"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const tenants_module_1 = require("./modules/tenants/tenants.module");
const users_module_1 = require("./modules/users/users.module");
const clients_module_1 = require("./modules/clients/clients.module");
const tax_profiles_module_1 = require("./modules/tax-profiles/tax-profiles.module");
const documents_module_1 = require("./modules/documents/documents.module");
const document_requests_module_1 = require("./modules/document-requests/document-requests.module");
const document_reviews_module_1 = require("./modules/document-reviews/document-reviews.module");
const workflows_module_1 = require("./modules/workflows/workflows.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const mailer_module_1 = require("./modules/mailer/mailer.module");
const portal_module_1 = require("./modules/portal/portal.module");
const billing_module_1 = require("./modules/billing/billing.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const tenant_guard_1 = require("./common/guards/tenant.guard");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const app_config_1 = __importDefault(require("./config/app.config"));
const database_config_1 = __importDefault(require("./config/database.config"));
const jwt_config_1 = __importDefault(require("./config/jwt.config"));
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, database_config_1.default, jwt_config_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
                    limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
                }]),
            database_module_1.DatabaseModule,
            mailer_module_1.MailerModule,
            auth_module_1.AuthModule,
            tenants_module_1.TenantsModule,
            users_module_1.UsersModule,
            clients_module_1.ClientsModule,
            tax_profiles_module_1.TaxProfilesModule,
            documents_module_1.DocumentsModule,
            document_requests_module_1.DocumentRequestsModule,
            document_reviews_module_1.DocumentReviewsModule,
            workflows_module_1.WorkflowsModule,
            notifications_module_1.NotificationsModule,
            portal_module_1.PortalModule,
            billing_module_1.BillingModule,
            dashboard_module_1.DashboardModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: tenant_guard_1.TenantGuard },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.AllExceptionsFilter },
            { provide: core_1.APP_INTERCEPTOR, useClass: transform_interceptor_1.TransformInterceptor },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map