import { User } from "next-auth";

export interface ExtendedUser extends User {
    id: string | number;
    created_at: string;
    last_login: string;
    first_name: string;
    last_name: string;
    email_address: string;
    phone: string;
    role: "MASTER" | "ADMIN" | "AGENT";
}


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
    flatId?: number;
    meter_id?: string;
}

export interface Customer {
    flatId: number;
    id: number;
    first_name: string;
    last_name: string;
    email_address: string;
    disabled: boolean;
    meter_id: string | null;
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
    app_charges: number;
    register_fees: number;
    service_tax: number;
    utility_tax: number;
    extra_charges: number;
    penalty_amount: number;
    gas_unit_rate: number;
    bill_due_date: string;
    cost_name: string;
    app_charges_boolean: boolean;
    service_person_email: string;
    service_person_name: string;
    service_person_phone: string;
    service_person_whatsapp: string;
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
    towers: Tower[];
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
    floors: Floor[];
    tower: Tower;
}

export interface FloorPayload {
    name: string;
    wing_id: number;
}

export interface Floor {
    id: number;
    name: string;
    wing_id: number;
    wing: Wing & { tower: Tower }; // Inherit Wing and add more properties
}

export interface FlatPayload {
    flat_no: string;
    floor_id: number;
    meter_id: number | undefined;
}

export interface Flat {
    id: number;
    flat_no: string;
    floor_id: number;
    meter_id: number | null;
    created_at: string;
    updated_at: string;
    customer: Customer | null;
    floor: Floor;
    meter: Meter | null;
}

export enum MeterStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE"
}

export interface MeterPayload {
    id?: number | string;
    meter_id: string;
    installation_at: string;
    img_url?: string;
    status: MeterStatus;
    isExisting?: 'true' | 'false';
    old_meter_reading?: number;
}

export interface Meter {
    id: number;
    meter_id: string;
    gmsFlat: object | null;
    total_units: number;
    installation_at: string;
    img_url?: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
    isExisting?: 'true' | 'false';
    old_meter_reading?: number;
    created_at: string;
    updated_at: string | null;
}

export interface MeterLogPayload {
    meter_id: number | string;
    current_reading: number | string;
    status?: ReadingStatus;
    image?: File;
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
    amc_cost: number;
    utility_tax: number;
    app_charges: number;
    penalty_amount: number;
    overdue_penalty: number;
    gas_unit_rate: number;
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

export interface BillPayload extends FormData {
    customerId: string;
    current_reading: number;
    image?: string;
}

export interface AgentPayload {
    agentId: string;
    amount: number;
}

export enum SMSTypeEnum {
    BILLING = "billing",
    REGISTRATION = "registration",
    VERIFICATION = "verification",
    REMINDER = "reminder",
    PAYMENT = "payment",
    OTHER = "other"
}

export interface SmsPayload {
    identifier: string;
    description: string;
    message: string;
    type: SMSTypeEnum;
    variables: string;
}

export interface Sms {
    id: number;
    identifier: string;
    description: string;
    message: string;
    type: SMSTypeEnum;
    variables: string;
    createdAt: string;
    updatedAt: string;
}

export const SMS_TEMPLATE_VARIABLES = {
    billing: ['bill_amount', 'due_date', 'penalty_amount', 'gas_unit_rate'],
    registration: ['first_name', 'last_name', 'project_name', 'service_person_name', 'service_person_phone'],
    verification: ['first_name', 'phone', 'email_address'],
    reminder: ['first_name', 'bill_due_date', 'bill_amount'],
    payment: ['amount', 'payment_date', 'method', 'invoice_id'],
    other: ['first_name', 'last_name', 'email_address', 'phone', 'city', 'area']
};

export enum EMAILTypeEnum {
    BILLING = "billing",
    REGISTRATION = "registration",
    VERIFICATION = "verification",
    REMINDER = "reminder",
    PAYMENT = "payment",
    OTHER = "other",
    FORGOT_PASSWORD = "forgot_password",
    RESET_PASSWORD = "reset_password",
}

export interface EmailPayload {
    identifier: string;
    description: string;
    subject: string;
    body: string;
    htmlBody: string;
    type: EMAILTypeEnum;
    variables: string;
}

export interface Email {
    id: number;
    identifier: string;
    description: string;
    subject: string;
    body: string;
    htmlBody?: string;
    type: EMAILTypeEnum;
    variables: string;
}