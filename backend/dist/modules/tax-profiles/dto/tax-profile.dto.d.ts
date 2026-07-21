export declare class CreateTaxProfileDto {
    clientId: string;
    rut?: string;
    hasIngresosLaborales?: boolean;
    hasIngresosIndependientes?: boolean;
    hasRendimientosFinancieros?: boolean;
    hasPropiedades?: boolean;
    hasVehiculos?: boolean;
    hasInversiones?: boolean;
    hasDependientes?: boolean;
    hasMedicinaPrepaga?: boolean;
    hasCreditoHipotecario?: boolean;
    ingresosAnuales?: number;
    patrimonioBruto?: number;
    taxYear?: number;
}
export declare class UpdateTaxProfileDto {
    rut?: string;
    hasIngresosLaborales?: boolean;
    hasIngresosIndependientes?: boolean;
    hasRendimientosFinancieros?: boolean;
    hasPropiedades?: boolean;
    hasVehiculos?: boolean;
    hasInversiones?: boolean;
    hasDependientes?: boolean;
    hasMedicinaPrepaga?: boolean;
    hasCreditoHipotecario?: boolean;
    ingresosAnuales?: number;
    patrimonioBruto?: number;
    taxYear?: number;
}
