import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { UsersModule } from './modules/users/users.module';
import { ClientsModule } from './modules/clients/clients.module';
import { TaxProfilesModule } from './modules/tax-profiles/tax-profiles.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { DocumentRequestsModule } from './modules/document-requests/document-requests.module';
import { DocumentReviewsModule } from './modules/document-reviews/document-reviews.module';
import { WorkflowsModule } from './modules/workflows/workflows.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { PortalModule } from './modules/portal/portal.module';
import { BillingModule } from './modules/billing/billing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { TenantGuard } from './common/guards/tenant.guard';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL ?? '60', 10),
      limit: parseInt(process.env.THROTTLE_LIMIT ?? '100', 10),
    }]),
    DatabaseModule,
    MailerModule,
    AuthModule,
    TenantsModule,
    UsersModule,
    ClientsModule,
    TaxProfilesModule,
    DocumentsModule,
    DocumentRequestsModule,
    DocumentReviewsModule,
    WorkflowsModule,
    NotificationsModule,
    PortalModule,
    BillingModule,
    DashboardModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: TenantGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
  ],
})
export class AppModule { }
