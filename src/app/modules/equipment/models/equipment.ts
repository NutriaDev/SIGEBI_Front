export interface Equipment {
  equipmentId: number;

  serie: string;
  name: string;
  brand: string;
  model: string;
  invima: string;

  areaId: number;
  areaName: string;

  classificationId: number;
  classificationName: string;

  providerId: number;
  providerName: string;

  stateId: number;
  stateName: string;

  locationId: number;
  locationName: string;

  riskLevel: string;

  acquisitionDate: string;
  usefulLife: number;
  warrantyEnd: string;

  maintenanceFrequency: number;
  calibrationFrequency: number;

  createdBy: number;

  active: boolean;

  createdAt: string;
  updatedAt: string;
}
