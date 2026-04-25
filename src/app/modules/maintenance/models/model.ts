// ─── Request DTOs ───────────────────────────────────────────────────────────

export interface MaintenanceRequest {
  equipmentId: number;
  type: string; // 'MP' | 'MCP'
  date: string; // ISO LocalDateTime string
  description: string;
  technicianId: number;
  nextMaintenanceDate?: string;
}

export interface MaintenanceScheduleRequest {
  equipmentId: number;
  scheduledDate: string;
  type: string;
  notes?: string;
}

// ─── Response DTOs ──────────────────────────────────────────────────────────

export interface MaintenanceResponse {
  id: number;
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
  id: number;
  serialNumber: string;
  equipmentName: string;
  service: string;
  type: string;
  scheduledDate: string;
  notes: string;
  status: string; // 'PENDIENTE' | 'VENCIDO' | 'COMPLETADO'
  daysOverdue?: number;
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
