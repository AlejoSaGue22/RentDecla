export declare class CreateTenantDto {
    name: string;
    slug: string;
    logoUrl?: string;
    primaryColor?: string;
    documentPrefix?: string;
}
export declare class UpdateTenantDto {
    name?: string;
    logoUrl?: string;
    primaryColor?: string;
    isActive?: boolean;
}
export declare class UpdateMyTenantDto {
    name?: string;
    logoUrl?: string;
    primaryColor?: string;
    documentPrefix?: string;
}
