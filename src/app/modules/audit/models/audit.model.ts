export interface AuditFilterRequest {
  userId?: number;
  module?: string;
  action?: string;
  fromDate?: string;
  toDate?: string;
  page: number;
  size: number;
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
