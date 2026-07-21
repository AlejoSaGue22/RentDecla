export declare class TenantContext {
    private readonly storage;
    set(key: string, value: any): void;
    get(key: string): any;
    clear(): void;
}
