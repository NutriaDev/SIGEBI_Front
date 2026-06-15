# SIGEBI — Frontend

> Sistema de Gestión Integral de Equipos Biomédicos

## Arquitectura general

```
Modelo (interfaz) → Servicio (HTTP) → Componente (TS + HTML)
```

Cada módulo define sus modelos (interfaces TypeScript), un servicio que consume los endpoints REST del backend, y componentes que se suscriben al `Observable` del servicio para renderizar la vista.

Los servicios se declaran con `providedIn: 'root'` (singleton global). La inyección de dependencias se realiza vía constructor. Los componentes utilizan `AsyncPipe` o suscripción manual con manejo de estados `loading` / `error` / `empty`.

---

## Módulo: Auth (`/auth`)

**Descripción:** Autenticación de usuarios. Login, recuperación y restablecimiento de contraseña.

### Componentes

| Componente | Ruta |
|---|---|
| `LoginPageComponent` | `/auth/login` |
| `ForgotPasswordPageComponent` | `/auth/forgot-password` |
| `ResetPasswordPageComponent` | `/auth/reset-password` |

### Endpoints consumidos

| Método | Endpoint | Servicio |
|---|---|---|
| `POST` | `/auth/login` | `AuthService.login()` |
| `POST` | `/auth/forgot-password` | `AuthService.forgotPassword()` |
| `POST` | `/auth/reset-password` | `AuthService.resetPassword()` |

### Modelos (`auth/models/login.model.ts`)

- `LoginRequest` — `{ email, password }`
- `LoginResponse` — `{ accessToken, refreshToken, expiresIn, sessionId, roles, permissions, userId, email }`

---

## Módulo: Dashboard (`/dashboard`)

**Descripción:** Página principal con vistas role-based. Redirige al dashboard correspondiente según el rol del usuario (`SUPERADMIN`, `ADMIN`, `SUPERVISOR`, `TECNICO`). Incluye un sistema de tabs dinámicas (`TabService`) que permite abrir múltiples componentes en una interfaz con pestañas (máximo 5).

### Componentes

| Componente | Propósito |
|---|---|
| `DashboardComponent` | Orquestador — redirige según rol |
| `DashboardSuperadminComponent` | Dashboard para SUPERADMIN |
| `DashboardAdminComponent` | Dashboard para ADMIN |
| `DashboardSupervisorComponent` | Dashboard para SUPERVISOR |
| `DashboardTecnicoComponent` | Dashboard para TECNICO |
| `TabContainerComponent` | Contenedor de tabs dinámicas |

### Servicios

- **`TabService`** — `openTab(title, component, data?)`, `closeTab(index)`. Almacena tabs en un `BehaviorSubject<Tab[]>`.

---

## Módulo: Equipment (`/equipment`)

**Descripción:** Gestión del catálogo de equipos biomédicos. Incluye el ciclo de vida del equipo (búsqueda avanzada, hoja de vida, edición), así como el mantenimiento de entidades auxiliares: áreas, clasificaciones, estados, ubicaciones y proveedores.

**Patrón Strategy:** Este módulo implementa el patrón **Strategy** de dos formas:

1. **`EquipmentCrudComponent`** (`shared/components/crud/`) — Componente genérico de CRUD que recibe cualquier servicio vía `@Input() service: any`. Opera con `getAll()`, `getById()`, `getByName()`, `create()`, `update()`, `deactivate()` sin conocer el tipo concreto. Los componentes `AreaFormComponent`, `ClasificationFormComponent`, `StateFormComponent`, `LocationFormComponent` y `ProviderFormComponent` son wrappers que inyectan su servicio específico y delegan todo al mismo template.

2. **`EquipmentLifecycleComponent`** — Define un array de `SearchTab[]` donde cada tab representa una estrategia de búsqueda diferente (por nombre, área, estado, clasificación, proveedor, ubicación). Cada tab tiene un `endpoint` distinto, y el componente ejecuta la estrategia seleccionada sin acoplarse a una búsqueda específica.

### Componentes

| Componente | Tipo | Propósito |
|---|---|---|
| `EquipmentLifecycleComponent` | page (standalone) | Búsqueda avanzada y hoja de vida del equipo |
| `EquipmentCreateComponent` | page (standalone) | Registro de nuevo equipo |
| `EquipmentEditComponent` | page | Edición de equipo existente |
| `EquipmentAllComponent` | page | Listado general de equipos |
| `AreaFormComponent` | component | CRUD de áreas (delega a `EquipmentCrudComponent`) |
| `ClasificationFormComponent` | component | CRUD de clasificaciones |
| `StateFormComponent` | component | CRUD de estados |
| `LocationFormComponent` | component | CRUD de ubicaciones |
| `ProviderFormComponent` | component | CRUD de proveedores |

### Endpoints consumidos

| Método | Endpoint | Servicio |
|---|---|---|
| `GET` | `/api/equipments` | `EquipmentsService.getAll()` |
| `GET` | `/api/equipments/{id}` | `EquipmentsService.getById()` |
| `GET` | `/api/equipments/active` | `EquipmentsService.getActive()` |
| `GET` | `/api/equipments/serie/{serie}` | `EquipmentsService.getBySerie()` |
| `GET` | `/api/equipments/search?name=` | `EquipmentsService.search()` |
| `GET` | `/api/equipments/area?name=` | `EquipmentsService.getByArea()` |
| `GET` | `/api/equipments/classification?name=` | `EquipmentsService.getByClassification()` |
| `GET` | `/api/equipments/provider?name=` | `EquipmentsService.getByProvider()` |
| `GET` | `/api/equipments/state?name=` | `EquipmentsService.getByState()` |
| `GET` | `/api/equipments/location?name=` | `EquipmentsService.getByLocation()` |
| `POST` | `/api/equipments` | `EquipmentsService.create()` |
| `PUT` | `/api/equipments/{id}` | `EquipmentsService.update()` |
| `PATCH` | `/api/equipments/{id}/deactivate` | `EquipmentsService.deactivate()` |
| `PATCH` | `/api/equipments/{id}/activate` | `EquipmentsService.activate()` |
| `GET` | `/api/equipments-area` | `AreaService` (CRUD genérico) |
| `GET` | `/api/equipments-area/active` | `AreaService.getActive()` |
| `GET` | `/api/classifications` | `ClasificationService` (CRUD genérico) |
| `GET` | `/api/classifications/active` | `ClasificationService.getActive()` |
| `GET` | `/api/states` | `StateService` (CRUD genérico) |
| `GET` | `/api/states/active` | `StateService.getActive()` |
| `GET` | `/api/locations` | `LocationService` (CRUD genérico) |
| `GET` | `/api/locations/active/all` | `LocationService.getAllActive()` |
| `GET` | `/api/providers` | `ProviderService` (CRUD genérico) |
| `GET` | `/api/providers/active` | `ProviderService.getActive()` |
| `GET` | `/api/media/equipment/{id}` | `MediaService.getImage()` |
| `POST` | `/api/media/equipment/{id}` | `MediaService.uploadImage()` |
| `DELETE` | `/api/media/equipment/{id}` | `MediaService.deleteImage()` |

### Modelos (`equipment/models/`)

- `Equipment` — `{ equipmentId, serie, name, brand, model, invima, areaId, classificationId, providerId, stateId, locationId, ... }`
- `BaseEntity` (core) — `{ id?, name, active? }`
- `CreateAreaRequest` — `{ name }`
- `CreateClasificationRequest` — `{ name }`

### Clase base genérica (`core/services/equipment.service.ts`)

```typescript
export class EquipmentService<T> {
  getAll(pageable?)        → GET    /{url}
  getById(id)              → GET    /{url}/{id}
  getByName(name)          → GET    /{url}/name/{name}
  create(data)             → POST   /{url}
  update(id, data)         → PUT    /{url}/{id}
  deactivate(id)           → PATCH  /{url}/{id}/deactivate
}
```

`EquipmentsService`, `AreaService`, `ClasificationService`, `StateService`, `LocationService` y `ProviderService` extienden esta clase base, heredando los métodos CRUD.

---

## Módulo: Inventory (`/inventory`)

**Descripción:** Gestión de inventarios físicos y movimientos de equipos entre ubicaciones.

### Componentes

| Componente | Ruta |
|---|---|
| `InventoryListComponent` | `/inventory` |
| `MovementsListComponent` | `/inventory/movimientos` |
| `InventoryCreateComponent` | sidebar (tab) |
| `MovementCreateComponent` | sidebar (tab) |

### Endpoints consumidos

| Método | Endpoint | Servicio |
|---|---|---|
| `GET` | `/api/inventories?page=&limit=&date=&locationId=` | `InventoryService.getInventories()` |
| `GET` | `/api/inventories/{id}` | `InventoryService.getInventoryById()` |
| `POST` | `/api/inventories` | `InventoryService.createInventory()` |
| `GET` | `/api/movements?page=&limit=&equipmentId=&locationId=&date=` | `InventoryService.getMovements()` |
| `POST` | `/api/movements` | `InventoryService.createMovement()` |
| `PATCH` | `/api/equipments/{id}/location` | `InventoryService.updateEquipmentLocation()` |
| `GET` | `/api/movements/equipments/by-serial?serial=` | `InventoryService.getEquipmentBySerial()` |

### Modelos (`inventory/models/model.ts`)

- `InventoryResponse`, `InventoryDetailResponse`, `InventoryWithDetailResponse`
- `MovementResponse`
- `PagedResponse<T>` — `{ content, totalElements, totalPages }`
- `InventoryFilters`, `MovementFilters`
- `CreateInventoryPayload`, `CreateMovementPayload`, `UpdateEquipmentLocationPayload`

---

## Módulo: Maintenance (`/maintenance`)

**Descripción:** Registro, programación y seguimiento de mantenimientos de equipos. Incluye alerta de mantenimientos vencidos.

### Componentes

| Componente | Ruta |
|---|---|
| `MaintenanceListComponent` | `/maintenance` |
| `MaintenanceCreateComponent` | `/maintenance/create` |
| `MaintenanceScheduleComponent` | `/maintenance/schedule` |
| `MaintenanceOverdueComponent` | `/maintenance/overdue` |

### Endpoints consumidos

| Método | Endpoint | Servicio |
|---|---|---|
| `POST` | `/api/maintenance` | `MaintenanceService.registerMaintenance()` |
| `POST` | `/api/maintenance/schedule` | `MaintenanceService.scheduleMaintenance()` |
| `POST` | `/api/maintenance/schedule/finalize` | `MaintenanceService.finalizeSchedule()` |
| `GET` | `/api/maintenance?equipmentId=&fromDate=&toDate=&page=&size=` | `MaintenanceService.getMaintenanceHistory()` |
| `GET` | `/api/maintenance/overdue?page=&size=` | `MaintenanceService.getOverdueSchedules()` |
| `GET` | `/api/maintenance/timeline?equipmentId=&page=&size=` | `MaintenanceService.getTimeline()` |

### Modelos (`maintenance/models/model.ts`)

- `MaintenanceRequest`, `MaintenanceScheduleRequest`, `FinalizeScheduleRequest`
- `MaintenanceResponse`, `MaintenanceScheduleResponse`, `MaintenanceUnifiedResponse`
- `PageResponse<T>` — `{ content, totalElements, totalPages, number, size }`
- `ApiResponse<T>` — `{ status, title, message, body }`

---

## Módulo: Reports (`/reports`)

**Descripción:** Generación de reportes consolidados, reportes de servicio técnico y exportación de datos. Consultas sobre inventario, movimientos y mantenimientos con filtros combinados.

### Componentes

| Componente | Ruta |
|---|---|
| `ServiceReportCreateComponent` | `/reports/service-report-create` |
| `ConsolidatedReportComponent` | `/reports/consolidated` |
| `EquipmentLocationComponent` | `/reports/equipment-location` |
| `ExportReportButtonComponent` | reusable component |

### Endpoints consumidos

| Método | Endpoint | Servicio |
|---|---|---|
| `POST` | `/api/service-reports` | `ReportsService.createServiceReport()` |
| `GET` | `/api/reports/inventory/location/{id}` | `ReportsService.getInventoryByLocation()` |
| `GET` | `/api/reports/inventory/date-range` | `ReportsService.getInventoryByDateRange()` |
| `GET` | `/api/reports/movement/equipment/{id}` | `ReportsService.getMovementsByEquipment()` |
| `GET` | `/api/reports/movement/date-range` | `ReportsService.getMovementsByDateRange()` |
| `GET` | `/api/reports/maintenance/equipment/{id}` | `ReportsService.getMaintenanceByEquipment()` |
| `GET` | `/api/reports/maintenance/status/{status}` | `ReportsService.getMaintenanceByStatus()` |
| `GET` | `/api/reports/maintenance/date-range` | `ReportsService.getMaintenanceByDateRange()` |
| `GET` | `/api/reports/consolidated/filters` | `ReportsService.getConsolidatedWithFilters()` |
| `GET` | `/api/reports/equipment-snapshot/{id}` | `ReportsService.getEquipmentSnapshot()` |
| `GET` | `/api/reports/equipment-snapshot/location/{id}` | `ReportsService.getSnapshotsByLocation()` |
| `GET` | `/api/reports/export-direct` | `ReportsService.exportDirect()` |
| `GET` | `/api/service-reports/{id}/pdf` | `ReportsService.downloadServiceReportByMaintenance()` |

### Modelos (`reports/models/`)

- `ServiceReportRequest` — `{ maintenanceId, diagnosis, activitiesPerformed, observations?, sparePartsUsed[] }`
- `SparePartItem` — `{ quantity, reference, description }`
- `ReportType` (enum) — `EQUIPMENT`, `MAINTENANCE`, `AUDIT`, `USER`, `INCIDENT`
- `ReportFormat` (enum) — `PDF`, `EXCEL`, `CSV`
- `ReportRequest`, `ReportResponse`, `ReportExecution`
- `AuditLogResponse` — `{ id, userId, action, module, entityId, entityType, details, timestamp, ipAddress }`

---

## Módulo: Users (`/users`)

**Descripción:** Administración de usuarios del sistema. CRUD completo con activación/desactivación y eliminación física.

### Componentes

| Componente | Ruta |
|---|---|
| `UserListComponent` | `/users` |
| `UserCreateComponent` | `/users/create` |
| `UserEditComponent` | `/users/edit` |

### Endpoints consumidos

| Método | Endpoint | Servicio |
|---|---|---|
| `POST` | `/api/users/users-create` | `UsersService.createUser()` |
| `GET` | `/api/users/get-all-users` | `UsersService.getAllUsers()` |
| `GET` | `/api/users/get-user-by-id/{id}` | `UsersService.getUserById()` |
| `GET` | `/api/users/get-user-by-email/{email}` | `UsersService.getUserByEmail()` |
| `PATCH` | `/api/users/edit-user/{id}` | `UsersService.updateUser()` |
| `PATCH` | `/api/users/deactive-user/{id}` | `UsersService.deactivateUser()` |
| `PATCH` | `/api/users/activate-user/{id}` | `UsersService.activateUser()` |
| `DELETE` | `/api/users/deletehard-user/{id}` | `UsersService.deleteUserHard()` |

### Modelos (`users/models/user.model.ts`)

- `User` — `{ idUsers, name, lastname, birthDate, phone, email, id, active, roleName, createdAt, updatedAt, companyId }`

---

## Módulo: Audit (`/audit`)

**Descripción:** Visualización de registros de auditoría del sistema. Visible únicamente para usuarios con rol `SUPERADMIN`.

### Componentes

| Componente | Ruta |
|---|---|
| `AuditLogsComponent` | `/audit` |

### Endpoints consumidos

| Método | Endpoint | Servicio |
|---|---|---|
| `POST` | `/api/audit/filters` | `AuditService.getAuditLogs()` |

### Modelos (`audit/models/audit.model.ts`)

- `AuditFilterRequest` — `{ userId?, module?, action?, fromDate?, toDate?, page, size }`
- `AuditLogResponse` — `{ id, userId, action, module, entityId, entityType, details, timestamp, ipAddress }`

### Funcionalidades

- Filtros: usuario, módulo, acción, rango de fechas
- Badges de acción con colores: `CREATE` (verde), `UPDATE` (azul), `DELETE` (rojo), `DOWNLOAD` (morado), `FINALIZE` (naranja), default (gris)
- Paginación con "Anterior / Siguiente" y contador de registros
- Estados: loading (skeleton), error (SweetAlert2 + reintentar), empty (checkmark verde)
- Fecha formateada con pipe `date:'dd/MM/yyyy HH:mm:ss'`
- Detalle truncado con tooltip (`title`)

---

## Core — Servicios compartidos

| Servicio | Propósito |
|---|---|
| `AuthService` | Login, logout, roles, permisos, currentUser |
| `TokenService` | Almacenamiento de JWT en `localStorage` |
| `JwtDecoderService` | Decodificación y validación del token JWT |
| `LoggerService` | Logging condicional (solo desarrollo) |
| `HttpErrorMapperService` | Traducción de errores del backend al español |
| `EquipmentService<T>` | Clase base genérica para CRUD de entidades |
| `MediaService` | Subida, descarga y eliminación de imágenes de equipos |

## Core — Guards e Interceptores

| Archivo | Propósito |
|---|---|
| `AuthGuard` | CanActivate — redirige a `/auth/login` si no hay sesión |
| `AuthInterceptor` | Agrega `Authorization: Bearer <token>` a cada request |
| `ErrorInterceptor` | Manejo global de errores HTTP (401 → login, 403 → forbidden) |

## Shared Module (`SharedModule`)

Re-exporta `CommonModule`, `FormsModule`, `ReactiveFormsModule`, `RouterModule` para uso en todos los módulos feature.

### Componentes compartidos

| Componente | Propósito |
|---|---|
| `EquipmentCrudComponent` | CRUD genérico reutilizable (Strategy pattern) |

### Modelos compartidos (`shared/models/response.model.ts`)

- `ApiResponse<T>` — `{ status, title, message, body }`

---

## Estructura de directorios

```
src/
└── app/
    ├── core/
    │   ├── guards/            # AuthGuard
    │   ├── interceptors/      # AuthInterceptor, ErrorInterceptor
    │   ├── models/            # ApiResponse, PageResponse, BaseEntity
    │   └── services/          # AuthService, EquipmentService, MediaService, ...
    ├── layout/                # MainLayout (sidebar + header), AuthLayout
    ├── modules/
    │   ├── audit/             # Auditoría (nuevo)
    │   ├── auth/              # Login, recuperación de contraseña
    │   ├── dashboard/         # Dashboards role-based + TabContainer
    │   ├── equipment/         # Equipos, áreas, clasificaciones, estados, ubicaciones, proveedores
    │   ├── inventory/         # Inventarios y movimientos
    │   ├── maintenance/       # Mantenimientos, programación, alertas
    │   ├── reports/           # Reportes, exportaciones
    │   └── users/             # CRUD de usuarios
    └── shared/                # SharedModule, componentes y modelos reutilizables
```

---

## Convenciones del proyecto

| Aspecto | Convención |
|---|---|
| Modelos | Interfaces en `models/` con sufijo `Request` / `Response` |
| Servicios | `@Injectable({ providedIn: 'root' })`, método por endpoint |
| Componentes | `selector: 'app-xxx'`, template externo, sin `styleUrls` |
| SweetAlert2 | `buttonsStyling: false` + `customClass` con `sigebi-popup` / `sigebi-confirm-btn` |
| Paginación | `currentPage`, `pageSize=10`, `totalElements`, `totalPages` + getters `startRecord` / `endRecord` |
| API Response | Envuelto en `ApiResponse<T>` con `{ status, title, message, body }` |
| Paginación backend | `PageResponse<T>` con `{ content, totalElements, totalPages, number, size }` |
| TailwindCSS | Clases personalizadas: `btn-primary`, `btn-white`, `btn-outline`, `card`, `input-field` |
| Roles/Permisos | Desde JWT; verificación vía `AuthService.hasPermission()` / `hasAnyPermission()` |
