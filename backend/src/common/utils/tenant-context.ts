import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantContext {
  private readonly storage = new Map<string, any>();

  set(key: string, value: any) {
    this.storage.set(key, value);
  }

  get(key: string): any {
    return this.storage.get(key);
  }

  clear() {
    this.storage.clear();
  }
}
