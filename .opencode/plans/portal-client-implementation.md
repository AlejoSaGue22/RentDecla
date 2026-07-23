# Portal del Cliente - Plan de Implementacion Completa

## Resumen Ejecutivo

El Portal del Cliente de RentDecla tiene multiples problemas criticas que impiden su funcionamiento correcto. Este plan aborda la correccion y mejora de todas las secciones: Inicio, Documentos, Perfil y Notificaciones, ademas de corregir problemas en el lado del administrador.

---

## Diagnostico: Estado Actual

### Problemas Criticos del Backend

| # | Problema | Archivo | Impacto |
|---|----------|---------|---------|
| 1 | **No se sirven archivos estaticos** | `backend/src/main.ts` | Los archivos subidos en `/uploads/*` no son accesibles. Las descargas fallan. |
| 2 | **Upload del portal no notifica al contador** | `portal.service.ts:97-128` | Cuando el cliente sube un documento, el contador nunca se entera. |
| 3 | **Estado de solicitud de documento nunca se actualiza** | `portal.service.ts` | Las solicitudes quedan en `PENDING` para siempre aunque se suban docs. |
| 4 | **No hay endpoint de descarga en el portal** | `portal.controller.ts` | El cliente no puede descargar/previsualizar sus propios documentos. |
| 5 | **No hay endpoint para actualizar info personal** | `portal.controller.ts` | El perfil solo gestiona TaxProfile (checkboxes), no telefono/direccion/ciudad/contrasena. |

### Problemas Criticos del Frontend

| # | Problema | Archivo | Impacto |
|---|----------|---------|---------|
| 6 | **Upload sin categoria ni vinculacion a solicitud** | `portal-documents.component.ts:331` | `uploadDocument(files[i])` no pasa categoria ni requestId. Docs "huerfanos". |
| 7 | **No hay boton de descarga** | `portal-documents.component.ts` | La tabla no tiene columna de acciones. El cliente no puede ver/descargar sus docs. |
| 8 | **No hay validacion de archivos** | `portal-documents.component.ts` | No se verifica tipo ni tamano. El backend acepta cualquier cosa. |
| 9 | **No se muestra razon de rechazo** | `portal-documents.component.ts` | Docs rechazados muestran "Rechazado" pero nunca la razon. |
| 10 | **No hay upload por solicitud** | `portal-documents.component.ts` | Tab "Documentos requeridos" es solo lectura. No hay boton de upload por solicitud. |
| 11 | **Pagina de perfil es solo TaxProfile** | `portal-profile.component.ts` | No hay telefono, direccion, ciudad ni cambio de contrasena. |
| 12 | **Dashboard con informacion limitada** | `portal-dashboard.component.ts` | No muestra docs recientes, vencimientos ni notificaciones recientes. |
| 13 | **Login guard redirige mal a clientes** | `login.guard.ts:14` | Siempre redirige a `/dashboard` (admin), incluso para clientes. |
| 14 | **Servicios frontend faltantes** | N/A | `document-requests.service.ts` y `document-reviews.service.ts` no existen. |

---

## Plan de Implementacion

### FASE 1: Fundacion del Backend

#### 1.1 Servir archivos subidos estaticamente
**Archivo:** `backend/src/main.ts`

- Crear la aplicacion como `NestExpressApplication`
- Importar `join` de `path` y `existsSync`, `mkdirSync` de `fs`
- Crear directorio `uploads/` si no existe al iniciar
- Agregar `app.useStaticAssets(uploadDir, { prefix: '/uploads' })` despues de `setGlobalPrefix`

#### 1.2 Agregar endpoint de descarga en el portal
**Archivos:** `backend/src/modules/portal/portal.controller.ts`, `portal.service.ts`

- Nuevo endpoint: `GET /portal/documents/:id/download`
- En el servicio: validar que el documento pertenece al cliente actual
- Usar `fs.createReadStream` para stream del archivo
- Setear headers `Content-Type` y `Content-Disposition`

#### 1.3 Notificar al contador cuando el cliente sube un documento
**Archivos:** `backend/src/modules/portal/portal.service.ts`, `portal.module.ts`

- Inyectar `NotificationService` en `PortalService`
- Despues de guardar el documento en `uploadDocument()`, llamar `notificationService.notifyDocumentUploaded(document, client)`
- Actualizar el status del cliente a `PENDING_DOCUMENTS` si esta en `PENDING_PROFILE`

#### 1.4 Auto-actualizar estado de solicitud de documento
**Archivo:** `backend/src/modules/portal/portal.service.ts`

- Despues del upload, si `documentRequestId` esta presente:
  - Contar documentos vinculados a esa solicitud
  - Si `> 0` → cambiar estado a `PARTIALLY_UPLOADED`
  - Si todos los documentos requeridos estan subidos → `COMPLETED`

#### 1.5 Endpoint para actualizar informacion personal
**Archivos:** `portal.controller.ts`, `portal.service.ts`, nuevo DTO `update-personal-info.dto.ts`

- Nuevo endpoint: `PATCH /portal/me`
- DTO `UpdatePersonalInfoDto` con campos opcionales: `phone`, `address`, `city`
- Actualiza la entidad `Client` directamente (no TaxProfile)

#### 1.6 Endpoint para cambiar contrasena
**Archivos:** `portal.controller.ts`, `portal.service.ts`, nuevo DTO `change-password.dto.ts`

- Nuevo endpoint: `PATCH /portal/password`
- DTO `ChangePasswordDto`: `currentPassword`, `newPassword`
- Validar contrasena actual con bcrypt
- Hashear nueva contrasena y actualizar entidad `User`
- Necesita inyectar `User` repository en `PortalService`

#### 1.7 Validacion de archivos en upload
**Archivo:** `backend/src/modules/portal/portal.service.ts`

- Validar tipo MIME: solo `application/pdf`, `image/jpeg`, `image/png`
- Validar tamano: maximo 10MB (10 * 1024 * 1024 bytes)
- Lanzar `BadRequestException` si no cumple

---

### FASE 2: Portal - Documentos (UX Core)

**Archivo principal:** `frontend/src/app/portal/pages/documents/portal-documents.component.ts`

#### 2.1 Upload con categoria + vinculacion a solicitud
- Agregar dropdown de categoria encima de la zona de upload (mismo listado que admin: RUT, Certificado Laboral, Extracto Bancario, etc.)
- Al subir, pasar `category` y opcionalmente `documentRequestId` al servicio

#### 2.2 Agregar accion de descarga/previsualizacion
- Agregar columna "Acciones" a la tabla de documentos
- Boton de descarga que llama `GET /portal/documents/:id/download`
- Para PDFs: abrir en nueva pestana
- Para imagenes: abrir en nueva pestana

#### 2.3 Mostrar razon de rechazo
- Cuando el estado es `rejected` o `requires_correction`, mostrar `rejectionReason` debajo del badge
- Usar un tooltip de Material o texto expandible

#### 2.4 Validacion de archivos en frontend
- Antes del upload, verificar extension: `.pdf`, `.jpg`, `.jpeg`, `.png`
- Verificar tamano ≤ 10MB
- Mostrar snackbar de error si falla la validacion

#### 2.5 Indicador de progreso de upload
- Mostrar spinner/overlay en la zona de upload durante la carga
- Deshabilitar zona de upload mientras se carga
- Agregar propiedad `isUploading` al componente

#### 2.6 Upload por solicitud de documento
- Cada tarjeta de solicitud en el tab "Documentos requeridos" tendra su propio boton "Subir documento"
- Al hacer clic, abre un file picker scoping a esa solicitud
- El archivo subido se vincula automaticamente con `documentRequestId`
- Agregar dropdown de categoria dentro de cada tarjeta de solicitud

---

### FASE 3: Portal - Perfil

**Archivo principal:** `frontend/src/app/portal/pages/profile/portal-profile.component.ts`

#### 3.1 Reestructurar en 3 secciones

**Seccion 1: Informacion Personal**
- Campos editables: telefono, direccion, ciudad (autocomplete con ciudades colombianas)
- Email mostrado como solo lectura
- Boton "Guardar informacion personal"

**Seccion 2: Perfil Tributario** (existente)
- Checkboxes de tipos de ingreso, patrimonio, deducciones
- Campos numericos: ingresos anuales, patrimonio bruto
- Boton "Guardar perfil tributario"

**Seccion 3: Seguridad**
- Campos: contrasena actual, nueva contrasena, confirmar nueva contrasena
- Validacion: minimo 6 caracteres, las dos nuevas deben coincidir
- Boton "Cambiar contrasena"

#### 3.2 Actualizar servicio del portal
**Archivo:** `frontend/src/app/portal/services/portal.service.ts`

- Agregar metodo `updatePersonalInfo(data)` → `PATCH /portal/me`
- Agregar metodo `changePassword(data)` → `PATCH /portal/password`

#### 3.3 Validacion de formulario
- Telefono: opcional, minimo 7 digitos
- Direccion: opcional, maximo 200 caracteres
- Contrasena: minimo 6 caracteres, confirmacion debe coincidir

---

### FASE 4: Portal - Dashboard (Inicio)

#### 4.1 Enriquecer datos del backend
**Archivo:** `backend/src/modules/portal/portal.service.ts` (metodo `getProfile`)

- Agregar al response:
  - `recentDocuments`: ultimos 5 documentos subidos (con estado)
  - `upcomingDeadlines`: solicitudes de documento con `dueDate` futura, ordenadas por fecha
  - `recentNotifications`: ultimas 3 notificaciones no leidas

#### 4.2 Actualizar template del dashboard
**Archivo:** `frontend/src/app/portal/pages/dashboard/portal-dashboard.component.ts`

- Seccion "Documentos recientes": mini tarjetas con nombre, estado, fecha
- Seccion "Proximos vencimientos": lista de fechas de vencimiento cercanas
- Seccion "Ultimas notificaciones": lista compacta con link a pagina completa

#### 4.3 Corregir timeline de `requires_correction`
- Cuando el estado es `requires_correction`, resaltar como estado de advertencia en el paso "Revision"
- No tratarlo como un paso entre `in_review` y `completed`

---

### FASE 5: Portal - Notificaciones

**Archivo principal:** `frontend/src/app/portal/pages/notifications/portal-notifications.component.ts`

#### 5.1 Marcar todas como leidas
- Agregar boton "Marcar todas como leidas" en la parte superior
- Nuevo endpoint backend: `PATCH /portal/notifications/read-all`
- Nuevo metodo en `portal.service.ts`: `markAllNotificationsRead()`

#### 5.2 Mejor agrupacion de notificaciones
- Agrupar por fecha: Hoy, Ayer, Anteriores
- Mostrar icono de tipo de notificacion consistentemente
- Mostrar estado de lectura con indicador visual claro

---

### FASE 6: Correcciones del Lado Administrador

#### 6.1 Corregir login guard
**Archivo:** `frontend/src/app/core/guards/login.guard.ts`

- Decodificar JWT para verificar el rol
- Si rol es `client` → redirigir a `/portal`
- Si rol es otro → redirigir a `/dashboard`

#### 6.2 Crear servicios frontend faltantes
**Archivos nuevos:**
- `frontend/src/app/core/services/document-requests.service.ts`
  - `findAll()`, `findByClient(clientId)`, `create(data)`, `update(id, data)`, `remove(id)`
- `frontend/src/app/core/services/document-reviews.service.ts`
  - `review(documentId, data)`, `findByDocument(documentId)`, `findPending()`

#### 6.3 Mejoras en pagina de documentos del admin
**Archivo:** `frontend/src/app/modules/documents/pages/documents/documents-page.component.ts`

- Mostrar solicitudes de documento del cliente seleccionado (nueva seccion o tab)
- Mostrar estado de revision por documento
- Agregar boton "Revisar" que navega a la pagina de revision

#### 6.4 Verificar pagina de revision del admin
**Archivo:** `frontend/src/app/modules/documents/pages/review/document-review.component.ts`

- Verificar que funciona end-to-end: listar pendientes → seleccionar doc → aprobar/rechazar con comentario
- Asegurar que las notificaciones se envian al cliente al revisar

---

## Resumen de Archivos a Modificar/Crear

### Archivos a Modificar

| Archivo | Fases |
|---------|-------|
| `backend/src/main.ts` | 1.1 |
| `backend/src/modules/portal/portal.controller.ts` | 1.2, 1.5, 1.6, 5.1 |
| `backend/src/modules/portal/portal.service.ts` | 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 4.1 |
| `backend/src/modules/portal/portal.module.ts` | 1.3, 1.6 |
| `frontend/src/app/portal/services/portal.service.ts` | 2.2, 3.2, 4.1, 5.1 |
| `frontend/src/app/portal/pages/documents/portal-documents.component.ts` | 2.1-2.6 |
| `frontend/src/app/portal/pages/profile/portal-profile.component.ts` | 3.1, 3.3 |
| `frontend/src/app/portal/pages/dashboard/portal-dashboard.component.ts` | 4.2, 4.3 |
| `frontend/src/app/portal/pages/notifications/portal-notifications.component.ts` | 5.1, 5.2 |
| `frontend/src/app/core/guards/login.guard.ts` | 6.1 |
| `frontend/src/app/modules/documents/pages/documents/documents-page.component.ts` | 6.3 |

### Archivos a Crear

| Archivo | Fase |
|---------|------|
| `backend/src/modules/portal/dto/update-personal-info.dto.ts` | 1.5 |
| `backend/src/modules/portal/dto/change-password.dto.ts` | 1.6 |
| `frontend/src/app/core/services/document-requests.service.ts` | 6.2 |
| `frontend/src/app/core/services/document-reviews.service.ts` | 6.2 |

---

## Orden de Ejecucion

1. **Fase 1** (Backend Foundation) → primero, todo depende de esto
2. **Fase 2** (Documentos) → depende de Fase 1
3. **Fase 3** (Perfil) → depende de Fase 1.5 y 1.6
4. **Fase 4** (Dashboard) → depende de Fase 1
5. **Fase 5** (Notificaciones) → depende de Fase 1
6. **Fase 6** (Admin) → independiente, puede hacerse en paralelo
7. **Verificacion final** → compilar backend y frontend
