import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      await this.dataSource.runMigrations({ transaction: 'each' });
    }
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}
