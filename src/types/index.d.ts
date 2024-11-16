export interface LoginResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data?: User | null;
}

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
    disabled: boolean;
    phone?: string;
    approve?: boolean;
    role?: "OWNER" | "TENANT";
    flatId?: string;
}

export interface Customer {
    flatId: string;
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    disabled: boolean;
    flatId: string | null;
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
    register_fees: number;
    service_tax: number;
    utility_tax: number;
    extra_charges: number;
    penalty_amount: number;
    gas_unit_rate: number;
    bill_due_date: string;
    cost_name: string;
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
    bill_due_date: string;
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
    wings: Wings[]
}

export interface WingPayload {
    name: string;
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
    name: string;
    wing_id: number;
}

export interface Floor {
    id: number;
    name: string;
    wing: Wing & { tower: Tower }; // Inherit Wing and add more properties
}

export interface FlatPayload {
    flat_no: string;
    address: string;
    floor_id: number;
    meter_id: number;
}

export interface Flat {
    id: number;
    flat_no: string;
    floor_id: number;
    meter_id: number | null;
    address: string;
    created_at: string;
    updated_at: string;
    customer: any | null;
    floor: Floor;
    meter: any | null;
}

export enum MeterStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface MeterPayload {
    meter_id: string;
    installation_at: string;
    status: MeterStatus;
}

export interface Meter {
    id: number;
    meter_id: string;
    total_units: number;
    installation_at: string;
    img_url?: string | null;
    gmsFlatId?: number | null;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    created_at: string;
    updated_at: string | null;
}

export interface MeterLogPayload {
    meter_id: number | string;
    current_reading: number | string;
    status?: ReadingStatus;
}

export enum ReadingStatus {
    VALID = "VALID",
    INVALID = "INVALID"
}

export enum InvoiceStatus {
    PAID = "PAID",
    UNPAID = "UNPAID",
    OVERDUE = "OVERDUE",
    PARTIALLY_PAID = "PARTIALLY_PAID"
}

export interface InvoicePayload {
    user_id?: number;
    gmsCustomerId: number;
    generatedByAgent?: boolean;
    status?: InvoiceStatus;
    unit_consumed: number;
    collected_by_agent_coin?: boolean;
}

export interface Invoice {
    id: number;
    user_id: number;
    gmsCustomerId: number;
    generatedByAgent: boolean;
    status: InvoiceStatus;
    unit_consumed: number;
    gas_unit_rate: number;
    amc_cost: number;
    utility_tax: number;
    app_charges: number;
    penalty_amount: number;
    overdue_penalty: number;
    bill_amount: number;
    collected_by_agent_coin: boolean;
    created_at?: string;
}

export enum PaymentStatus {
    UNPAID = "UNPAID",
    FAILED = "FAILED",
    SUCCESSFULL = "SUCCESSFULL"
}

export interface PaymentPayload {
    amount: number;
    method: string;
    invoice_id: number;
    penalty_amount: number;
    status?: PaymentStatus;
}

export interface Payment {
    id: number;
    amount: number;
    method: string;
    invoice_id: number;
    invoice: Invoice;
    penalty_amount: number;
    status: PaymentStatus;
}

export interface BillPayload {
    customerId: string;
    current_reading: number;
    image?: string;
}

export interface AgentPayload {
    agentId: string;
    amount: number; 
}