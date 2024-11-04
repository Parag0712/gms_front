export interface ApiResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: object | null;
    errors: string[];
}

export interface UserPayload {
    first_name: string;
    last_name: string;
    email_address: string;
    password?: string;
    phone?: string;
    role?: "MASTER" | "ADMIN" | "AGENT";
}

export interface CustomerPayload {
    first_name: string;
    last_name: string;
    email_address: string;
    password?: string;
    phone?: string;
    approve?: boolean;
    role?: "OWNER" | "TENANT";
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    phone: string;
    role: string;
    approved_by: number | null;
    approved_time: string | null;
}

export interface CityPayload {
    city: string;
}

export interface City {
    id: number;
    city: string;
    localities: Array<{
        id: number;
        area: string;
        city_id: number;
    }>;
}

export interface LocalityPayload {
    area: string;
    city_id: number;
}

export interface Locality {
    id: number;
    area: string;
    city_id: number;
    city: {
        id: number;
        city: string;
    };
}

export interface CostConfiguration {
    id: number;
    amc_cost: number;
    network_charges: number;
    society_maintenance: number;
    service_tax: number;
    utility_tax: number;
    extra_charges: number;
    penalty_amount: number;
    gas_unit_rate: number;
    created_at: string;
    updated_at: string;
}

export interface Project {
    id: number;
    project_name: string;
    locality_id: number;
    is_wing: boolean;
    cost_configuration_id: number | null;
    created_at: string;
    updated_at: string;
    locality: Locality;
    towers: any[];
    cost_configuration: CostConfiguration | null;
}

export interface ProjectPayload {
    project_name: string;
    is_wing: boolean;
    locality_id: number;
    cost_configuration_id: number | null;
}
export interface CostPayload {
    cost_name: string;
    app_charges: number;
    amc_cost: number;
    penalty_amount: number;
    gas_unit_rate: number;
    utility_tax: number; // Changed from float to number
}

export interface TowerPayload {
    tower_name: string;
    project_id: number;
}

export interface Tower {
    id: number;
    tower_name: string;
    project_id: number;
    project: Project;
}

export interface WingPayload {
    wing_name: string;
    tower_id: number;
}

export interface Wing {
    id: number;
    name: string;
    tower_id: number;
    created_at: string;
    updated_at: string;
    floors: any[];
    tower: Tower;
}

export interface FloorPayload {
    floor_name: string;
    wing_id: number;
}

export interface Floor {
    id: number;
    name: string;
    wing_id: number;
}

