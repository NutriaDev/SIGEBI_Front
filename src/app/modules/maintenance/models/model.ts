// ─── Request DTOs ───────────────────────────────────────────────────────────

export interface MaintenanceRequest {
  equipmentId: number;
  maintenanceType: number;
  date: string;
  issueDescription: string;
  nextMaintenanceDate?: string;
}

export interface MaintenanceScheduleRequest {
  equipmentId: number;
  scheduledDate: string;
  maintenanceType: number;
  notes?: string | undefined;
}

// ─── Response DTOs ──────────────────────────────────────────────────────────

export interface MaintenanceResponse {
  idMaintenance: number;
  serialNumber: string;
  assetNumber: string;
  equipmentName: string;
  service: string;
  type: string;
  date: string;
  description: string;
  technicianName: string;
  nextMaintenanceDate: string;
}

export interface MaintenanceScheduleResponse {
  idSchedule: number;
  equipmentId: number;
  maintenanceType: string;
  scheduledDate: string; 
  status: string;
  technicianName: string;
  daysOverdue?: number;
}

export interface MaintenanceUnifiedResponse {
  id: number;
  equipmentId: number;
  type: string;
  date: string;
  status: string;
  source: 'SCHEDULE' | 'MAINTENANCE';
}

export interface FinalizeScheduleRequest {
  scheduleId: number;
  maintenanceId: number;
}

// ─── Pagination ─────────────────────────────────────────────────────────────

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface ApiResponse<T = any> {
  status: string;
  title: string;
  message: string;
  body: T;
}
