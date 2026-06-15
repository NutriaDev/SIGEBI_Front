import { SparePartItem } from './spare-part-item.model';

export interface ServiceReportRequest {
  maintenanceId: number;
  diagnosis: string;
  activitiesPerformed: string;
  observations?: string;
  sparePartsUsed: SparePartItem[];
}
