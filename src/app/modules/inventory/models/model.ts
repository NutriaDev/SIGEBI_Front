// ─── Inventory ────────────────────────────────────────────────────────────────

export interface InventoryResponse {
  inventoryId: number;
  location: string;
  date: string; // LocalDate  → "yyyy-MM-dd"
  observations: string;
  createdAt: string; // LocalDateTime → ISO string
}

export interface InventoryDetailResponse {
  detailId: number;
  equipmentId: number;
  state: string;
  observations: string;
}

export interface InventoryWithDetailResponse {
  inventoryId: number;
  location: string;
  date: string;
  observations: string;
  createdAt: string;
  details: InventoryDetailResponse[];
}

// ─── Movements ────────────────────────────────────────────────────────────────

export interface MovementResponse {
  movementId: number;
  equipmentId: number;
  originLocationId: number;
  destinationLocationId: number;
  date: string; // LocalDate  → "yyyy-MM-dd"
  reason: string;
  responsibleUserId: number;
  createdAt: string; // LocalDateTime → ISO string
}

// ─── Paginación genérica ──────────────────────────────────────────────────────

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
}

// ─── Filtros ──────────────────────────────────────────────────────────────────

export interface InventoryFilters {
  page?: number;
  limit?: number;
  date?: string; // yyyy-MM-dd
  locationId?: number;
}

export interface MovementFilters {
  page?: number;
  limit?: number;
  equipmentId?: number;
  locationId?: number;
  date?: string; // yyyy-MM-dd
}

// ─── Payloads de escritura ────────────────────────────────────────────────────

export interface CreateMovementPayload {
  serial: string;
  originLocationId: number;
  destinationLocationId: number;
  reason: string;
}

export interface InventoryDetailPayload {
  equipmentId: number;
  state: string;
  observations: string | null;
}

export interface CreateInventoryPayload {
  locationId: number;
  date: string | null;
  observations: string | null;
  details: InventoryDetailPayload[];
}

export interface UpdateEquipmentLocationPayload {
  locationId: number;
}
