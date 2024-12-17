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
  data?: RazorpayOrdersResponse | object | null;
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
  wings: Wings[];
  created_at: string;
  updated_at: string;
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
  wing: Wing & { tower: Tower };
  created_at: string;
  updated_at: string;
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
  INACTIVE = "INACTIVE",
}

export interface MeterPayload {
  id?: number | string;
  meter_id: string;
  installation_at: string;
  img_url?: string;
  status: MeterStatus;
  isExisting?: "true" | "false";
  old_meter_reading?: number;
}

export interface Meter {
  id: number;
  meter_id: string;
  gmsFlat: object | null;
  total_units: number;
  installation_at: string;
  img_url?: string | null;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE";
  isExisting?: "true" | "false";
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
  INVALID = "INVALID",
}

export enum InvoiceStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  OVERDUE = "OVERDUE",
  PARTIALLY_PAID = "PARTIALLY_PAID",
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
  SUCCESSFULL = "SUCCESSFULL",
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
  USER_REG_001 = "user_reg_001",
  USER_VERIFIED = "user_verified",
  BILL_001 = "bill_001",
  BILL_002 = "bill_002",
  BILL_003 = "bill_003",
  BILL_004 = "bill_004",
  BILL_005 = "bill_005",
  BILL_006 = "bill_006",
  BILL_GEN_001 = "bill_gen_001",
  BILL_GEN_002 = "bill_gen_002",
  BILL_GEN_003 = "bill_gen_003",
  BILL_GEN_004 = "bill_gen_004",
  BILL_PAY_001 = "bill_pay_001",
  BILL_PAY_002 = "bill_pay_002",
  BILL_PAY_003 = "bill_pay_003",
  BILL_PAY_004 = "bill_pay_004",
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
  user_reg_001: ["user_name", "registration_date"],
  user_verified: ["user_name"],
  bill_001: ["bill_amount", "due_date"],
  bill_002: ["bill_amount", "due_date"],
  bill_003: ["payment_amount", "payment_date"],
  bill_004: ["bill_amount", "due_date"],
  bill_005: ["overdue_amount", "overdue_days"],
  bill_006: ["payment_amount", "late_fee"],
  bill_gen_001: ["user_name"],
  bill_gen_002: ["user_name", "due_date"],
  bill_gen_003: ["user_name", "due_date"],
  bill_gen_004: ["user_name"],
  bill_pay_001: ["user_name", "bill_amount"],
  bill_pay_002: ["user_name", "bill_amount"],
  bill_pay_003: ["user_name", "bill_amount"],
  bill_pay_004: ["user_name", "bill_amount"],
};

export enum EMAILTypeEnum {
  USER_REG_001 = "user_reg_001",
  USER_VERIFIED = "user_verified",
  BILL_001 = "bill_001",
  BILL_002 = "bill_002",
  BILL_003 = "bill_003",
  BILL_004 = "bill_004",
  BILL_005 = "bill_005",
  BILL_006 = "bill_006",
  BILL_GEN_001 = "bill_gen_001",
  BILL_GEN_002 = "bill_gen_002",
  BILL_GEN_003 = "bill_gen_003",
  BILL_GEN_004 = "bill_gen_004",
  BILL_PAY_001 = "bill_pay_001",
  BILL_PAY_002 = "bill_pay_002",
  BILL_PAY_003 = "bill_pay_003",
  BILL_PAY_004 = "bill_pay_004",
  FORGOT_PASSWORD = "forgot_password",
  RESET_PASSWORD = "reset_password",
  DUE_INVOICE = "due_invoice",
  ADMIN_FORGET_PASSWORD = "admin_forgot_password",
  MOBILE_FORGET_PASSWORD = "mobile_forgot_password",
  SEND_PASSWORD = "send_password",
  VERIFED_EMAIL = "verified_email",
}

export const EMAIL_TEMPLATE_VARIABLES = {
  user_reg_001: ["user_name", "registration_date"],
  user_verified: ["user_name"],
  bill_001: ["bill_amount", "due_date"],
  bill_002: ["bill_amount", "due_date"],
  bill_003: ["payment_amount", "payment_date"],
  bill_004: ["bill_amount", "due_date"],
  bill_005: ["overdue_amount", "overdue_days"],
  bill_006: ["payment_amount", "late_fee"],
  bill_gen_001: ["user_name"],
  bill_gen_002: ["user_name", "due_date"],
  bill_gen_003: ["user_name", "due_date"],
  bill_gen_004: ["user_name"],
  bill_pay_001: ["user_name", "bill_amount"],
  bill_pay_002: ["user_name", "bill_amount"],
  bill_pay_003: ["user_name", "bill_amount"],
  bill_pay_004: ["user_name", "bill_amount"],
  due_invoice: ["user_name", "due_date", "invoice_number", "bill_amount"],
  admin_forgot_password: ["user_name", "url_link"],
  mobile_forgot_password: ["user_name", "otp"],
  send_password: ["user_name", "password", "app_url"],
  verifed_email: ["user_name"],
};

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

export enum RazorpayStatus {
  PAYMENTS = "PAYMENTS",
  ORDER = "ORDER",
  SETTLEMENT = "SETTLEMENT",
}

export interface RazorpayInvoice {
  id: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  notes: {
    email?: string;
  };
  status: string;
  month: string;
}

export enum RevenueRange {
  Yearly = "Yearly",
  Monthly = "Monthly",
}

export interface RazorpayOrdersResponse {
  count: number;
  entity: "collection";
  items: RazorpayInvoice[];
}

interface YearlyRevenueResponse {
  data: {
    yearlyRevenues: YearlyRevenue[];
  }
}

interface YearlyRevenue {
  year: number;
  revenue: number;
  // add other properties if they exist
}

export interface importDataPayload {
  file: File;
  projectId: string;
}

export interface Report {
  id: number;
  report_type: string;
  filters: Record<string, unknown>;
  file_path: string;
  created_at: string;
}

export interface ReportResponse {
  statusCode: number;
  data: Report[];
}
