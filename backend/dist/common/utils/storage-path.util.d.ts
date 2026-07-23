export interface StoragePathResult {
    clientDir: string;
    filePath: string;
    fileUrl: string;
}
export declare function getStoragePath(client: {
    id: string;
    tenantId?: string;
    tenant?: {
        slug?: string;
    };
}, fileName: string): StoragePathResult;
