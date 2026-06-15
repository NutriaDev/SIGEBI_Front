// models/report.models.ts

// ── Enums ────────────────────────────────────────────────────────
export type ReportType = 'INVENTORY' | 'MOVEMENTS' | 'MAINTENANCE' | 'AUDIT';
export type ReportFormat = 'CSV' | 'EXCEL' | 'PDF';
export type ReportStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

// ── Requests ─────────────────────────────────────────────────────
export interface ReportRequest {
  type: ReportType;
  format: ReportFormat;
  filters?: string;
}

export interface SparePartItem {
  quantity: number;
  reference: string;
  description: string;
}

export interface MaintenanceServiceReportRequest {
  maintenanceId: number;
  diagnosis: string;
  activitiesPerformed: string;
  observations?: string;
  sparePartsUsed?: SparePartItem[];
}

export interface AuditLogRequest {
  action: string;
  module: string;
  entityId: number;
  entityType: string;
  details?: string;
  timestamp: string; // ISO string (LocalDateTime)
  ipAddress: string;
}

export interface AuditFilterRequest {
  userId?: number;
  module?: string;
  action?: string;
  fromDate?: string; // ISO string
  toDate?: string;
  page?: number;
  size?: number;
}

export interface ExportDirectRequest {
  type: ReportType;
  from: string;       // yyyy-MM-dd
  to: string;
  format: ReportFormat;
  equipmentId?: number;
  location?: string;
}

export interface ConsolidatedFilterRequest {
  equipmentId?: number;
  location?: string;
  maintenanceType?: string;
  fromDate?: string;  // yyyy-MM-dd
  toDate?: string;
  page?: number;
  size?: number;
}

// ── Responses ────────────────────────────────────────────────────
export interface ApiResponse<T = any> {
  status: string;
  title: string;
  message: string;
  body: T;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;      // currentPage
  size: number;
}

export interface ReportResponse {
  id: number;
  type: string;
  format: string;
  createdBy: number;
  createdAt: string;
  status: ReportStatus;
  filters?: string;
}

export interface AuditLogResponse {
  id: number;
  userId: number;
  action: string;
  module: string;
  entityId: number;
  entityType: string;
  details?: string;
  timestamp: string;
  ipAddress: string;
}

export interface MaintenanceServiceReportResponse {
  id: number;
  maintenanceId: number;
  diagnosis: string;
  activitiesPerformed: string;
  observations?: string;
  sparePartsUsed?: SparePartItem[];
  pdfPath?: string;
  digitalSignatureUrl?: string;
  pdfGeneratedAt?: string;
  signedAt?: string;
  createdAt: string;
  createdBy: number;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

// ── Vistas (tablas desnormalizadas) ──────────────────────────────
export interface InventoryReportView {
  inventoryId: number;
  locationId: number;
  locationName: string;
  date: string;
  totalEquipments: number;
  activeEquipments: number;
  inactiveEquipments: number;
}

export interface MovementReportView {
  movementId: number;
  equipmentId: number;
  originLocationId: number;
  destinationLocationId: number;
  date: string;
  responsibleUserName: string;
}

export interface MaintenanceReportView {
  maintenanceId: number;
  equipmentId: number;
  type: string;
  status: string;
  date: string;
  technicianName: string;
}

export interface ConsolidatedReportView {
  id?: number;
  equipmentId: number;
  equipmentName?: string;
  brand?: string;
  model?: string;
  serial?: string;
  inventoryCode?: string;
  location: string;
  clinic?: string;
  serviceArea?: string;

  maintenanceType?: string;
  maintenanceStatus?: string;

  date: string;

  failureCause?: string;
  technicalDiagnosis?: string;
  servicePerformed?: string;
  observations?: string;
}

export interface EquipmentSnapshot {
  equipmentId: number;
  name?: string;
  brand?: string;
  model?: string;
  serial?: string;
  locationId?: number;
  locationName?: string;
  state?: string;
  classification?: string;
  riskLevel?: string;
  lastMaintenanceDate?: string | null;
}