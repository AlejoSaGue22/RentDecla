import { AppBaseEntity } from './base.entity';
import { Client } from './client.entity';
export declare class TaxProfile extends AppBaseEntity {
    rut?: string;
    hasIngresosLaborales: boolean;
    hasIngresosIndependientes: boolean;
    hasRendimientosFinancieros: boolean;
    hasPropiedades: boolean;
    hasVehiculos: boolean;
    hasInversiones: boolean;
    hasDependientes: boolean;
    hasMedicinaPrepaga: boolean;
    hasAportesVoluntarios: boolean;
    hasCreditoHipotecario: boolean;
    ingresosAnuales?: number;
    patrimonioBruto?: number;
    propiedades?: Record<string, any>[];
    inversiones?: Record<string, any>[];
    dependientes?: Record<string, any>[];
    taxYear?: number;
    metadata?: Record<string, any>;
    client: Client;
    clientId: string;
}
