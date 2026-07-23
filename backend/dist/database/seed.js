"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const bcrypt = __importStar(require("bcryptjs"));
const tenant_entity_1 = require("./entities/tenant.entity");
const user_entity_1 = require("./entities/user.entity");
const client_entity_1 = require("./entities/client.entity");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const tax_profile_entity_1 = require("./entities/tax-profile.entity");
const document_entity_1 = require("./entities/document.entity");
const document_request_entity_1 = require("./entities/document-request.entity");
const document_review_entity_1 = require("./entities/document-review.entity");
const workflow_entity_1 = require("./entities/workflow.entity");
const notification_entity_1 = require("./entities/notification.entity");
const subscription_entity_1 = require("./entities/subscription.entity");
const AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'MySecr3tPassWord@as2',
    database: process.env.DB_DATABASE || 'nest_project_contable',
    entities: [
        tenant_entity_1.Tenant,
        user_entity_1.User,
        client_entity_1.Client,
        tax_profile_entity_1.TaxProfile,
        document_entity_1.Document,
        document_request_entity_1.DocumentRequest,
        document_review_entity_1.DocumentReview,
        workflow_entity_1.Workflow,
        notification_entity_1.Notification,
        subscription_entity_1.Subscription,
    ],
    synchronize: true,
});
async function seed() {
    console.log('🌱 Starting database seed...');
    await AppDataSource.initialize();
    console.log('✅ Connected to database');
    const tenantRepository = AppDataSource.getRepository(tenant_entity_1.Tenant);
    const userRepository = AppDataSource.getRepository(user_entity_1.User);
    const clientRepository = AppDataSource.getRepository(client_entity_1.Client);
    let tenant = await tenantRepository.findOne({ where: { slug: 'demo-firm' } });
    if (!tenant) {
        tenant = tenantRepository.create({
            name: 'Firma Contable Demo',
            slug: 'demo-firm',
            isActive: true,
        });
        await tenantRepository.save(tenant);
        console.log('🏢 Tenant "Firma Contable Demo" created.');
    }
    const defaultPasswordHash = await bcrypt.hash('Password123!', 10);
    let superAdmin = await userRepository.findOne({ where: { email: 'admin@rentdecla.com' } });
    if (!superAdmin) {
        superAdmin = userRepository.create({
            name: 'Super Admin',
            email: 'admin@rentdecla.com',
            password: defaultPasswordHash,
            role: roles_decorator_1.UserRole.SUPER_ADMIN,
            isActive: true,
        });
    }
    else {
        superAdmin.password = defaultPasswordHash;
        superAdmin.isActive = true;
    }
    await userRepository.save(superAdmin);
    console.log('👑 Super Admin user created: admin@rentdecla.com / Password123!');
    let contador = await userRepository.findOne({ where: { email: 'contador@rentdecla.com' } });
    if (!contador) {
        contador = userRepository.create({
            name: 'Carlos Contador',
            email: 'contador@rentdecla.com',
            password: defaultPasswordHash,
            role: roles_decorator_1.UserRole.CONTADOR,
            tenantId: tenant.id,
            isActive: true,
        });
    }
    else {
        contador.password = defaultPasswordHash;
        contador.tenantId = tenant.id;
        contador.isActive = true;
    }
    await userRepository.save(contador);
    console.log('💼 Contador user created: contador@rentdecla.com / Password123!');
    let clientRecord = await clientRepository.findOne({ where: { email: 'cliente@rentdecla.com' } });
    if (!clientRecord) {
        clientRecord = clientRepository.create({
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'cliente@rentdecla.com',
            documentNumber: '1098765432',
            documentType: 'CC',
            status: client_entity_1.ClientStatus.PENDING_DOCUMENTS,
            tenantId: tenant.id,
            assignedToId: contador.id,
        });
    }
    else {
        clientRecord.status = client_entity_1.ClientStatus.PENDING_DOCUMENTS;
    }
    await clientRepository.save(clientRecord);
    console.log('📋 Client record updated for Juan Pérez.');
    let clientUser = await userRepository.findOne({ where: { email: 'cliente@rentdecla.com' } });
    if (!clientUser) {
        clientUser = userRepository.create({
            name: 'Juan Pérez (Cliente)',
            email: 'cliente@rentdecla.com',
            password: defaultPasswordHash,
            role: roles_decorator_1.UserRole.CLIENT,
            tenantId: tenant.id,
            isActive: true,
        });
    }
    else {
        clientUser.password = defaultPasswordHash;
        clientUser.tenantId = tenant.id;
        clientUser.isActive = true;
    }
    await userRepository.save(clientUser);
    console.log('👤 Client user created: cliente@rentdecla.com / Password123!');
    console.log('🎉 Database seeding completed successfully!');
    await AppDataSource.destroy();
}
seed().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map