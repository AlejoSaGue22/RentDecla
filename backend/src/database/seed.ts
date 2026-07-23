import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Tenant } from './entities/tenant.entity';
import { User } from './entities/user.entity';
import { Client, ClientStatus } from './entities/client.entity';
import { UserRole } from '../common/decorators/roles.decorator';
import { TaxProfile } from './entities/tax-profile.entity';
import { Document } from './entities/document.entity';
import { DocumentRequest } from './entities/document-request.entity';
import { DocumentReview } from './entities/document-review.entity';
import { Workflow } from './entities/workflow.entity';
import { Notification } from './entities/notification.entity';
import { Subscription } from './entities/subscription.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'MySecr3tPassWord@as2',
  database: process.env.DB_DATABASE || 'nest_project_contable',
  entities: [
    Tenant,
    User,
    Client,
    TaxProfile,
    Document,
    DocumentRequest,
    DocumentReview,
    Workflow,
    Notification,
    Subscription,
  ],
  synchronize: true,
});

async function seed() {
  console.log('🌱 Starting database seed...');
  await AppDataSource.initialize();
  console.log('✅ Connected to database');

  const tenantRepository = AppDataSource.getRepository(Tenant);
  const userRepository = AppDataSource.getRepository(User);
  const clientRepository = AppDataSource.getRepository(Client);

  // 1. Create or get Demo Tenant
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

  // 2. Super Admin User
  let superAdmin = await userRepository.findOne({ where: { email: 'admin@rentdecla.com' } });
  if (!superAdmin) {
    superAdmin = userRepository.create({
      name: 'Super Admin',
      email: 'admin@rentdecla.com',
      password: defaultPasswordHash,
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    });
  } else {
    superAdmin.password = defaultPasswordHash;
    superAdmin.isActive = true;
  }
  await userRepository.save(superAdmin);
  console.log('👑 Super Admin user created: admin@rentdecla.com / Password123!');

  // 3. Contador User
  let contador = await userRepository.findOne({ where: { email: 'contador@rentdecla.com' } });
  if (!contador) {
    contador = userRepository.create({
      name: 'Carlos Contador',
      email: 'contador@rentdecla.com',
      password: defaultPasswordHash,
      role: UserRole.CONTADOR,
      tenantId: tenant.id,
      isActive: true,
    });
  } else {
    contador.password = defaultPasswordHash;
    contador.tenantId = tenant.id;
    contador.isActive = true;
  }
  await userRepository.save(contador);
  console.log('💼 Contador user created: contador@rentdecla.com / Password123!');

  // 4. Client Record & Client User
  let clientRecord = await clientRepository.findOne({ where: { email: 'cliente@rentdecla.com' } });
  if (!clientRecord) {
    clientRecord = clientRepository.create({
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'cliente@rentdecla.com',
      documentNumber: '1098765432',
      documentType: 'CC',
      status: ClientStatus.PENDING_DOCUMENTS,
      tenantId: tenant.id,
      assignedToId: contador.id,
    });
  } else {
    clientRecord.status = ClientStatus.PENDING_DOCUMENTS;
  }
  await clientRepository.save(clientRecord);
  console.log('📋 Client record updated for Juan Pérez.');

  let clientUser = await userRepository.findOne({ where: { email: 'cliente@rentdecla.com' } });
  if (!clientUser) {
    clientUser = userRepository.create({
      name: 'Juan Pérez (Cliente)',
      email: 'cliente@rentdecla.com',
      password: defaultPasswordHash,
      role: UserRole.CLIENT,
      tenantId: tenant.id,
      isActive: true,
    });
  } else {
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
