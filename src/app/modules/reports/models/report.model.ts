export enum ReportType {
  EQUIPMENT = 'EQUIPMENT',
  MAINTENANCE = 'MAINTENANCE',
  AUDIT = 'AUDIT',
  USER = 'USER',
  INCIDENT = 'INCIDENT',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

export enum ReportStatus {
  PENDING = 'PENDING',
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum ExecutionStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
}

export interface ReportRequest {
  type: ReportType;
  format: ReportFormat;
  filters?: string;
}

export interface ReportResponse {
  id: number;
  type: string;
  format: string;
  createdBy: number;
  createdAt: string;
  status: string;
  filters?: string;
}

export interface AuditLogResponse {
  id: number;
  userId: number;
  action: string;
  module: string;
  entityId: number;
  entityType: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface ReportExecution {
  id?: number;
  reportId: number;
  executionTime: number;
  recordsCount: number;
  status: ExecutionStatus;
  errorMessage?: string;
  executedAt?: string;
}
