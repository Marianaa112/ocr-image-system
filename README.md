# OCR Image System — Quotis

Sistema de facturación que extrae texto de fotos de tickets con OpenCV + Tesseract y los convierte en CFDIs.

---

## Stack

- **Backend**: Django 5 + Django REST Framework
- **Cola de tareas**: Celery + Redis
- **OCR**: Tesseract 5 + pytesseract
- **Preprocesamiento**: OpenCV (detección de borde del ticket, binarización)
- **Base de datos**: MySQL
- **Frontend**: React 18 (Babel standalone, sin build)

---

## 1. Requisitos del sistema

### macOS

```bash
brew install tesseract tesseract-lang   # motor OCR + español
brew install redis
brew install mysql
brew install pkg-config mysql-client    # necesario para compilar mysqlclient
```

### Windows

Instala manualmente los siguientes programas:

| Programa | Descarga |
|---|---|
| **Python 3.11+** | https://www.python.org/downloads/ |
| **Tesseract** | https://github.com/UB-Mannheim/tesseract/wiki — elige el instalador `.exe` que incluye español |
| **MySQL** | https://dev.mysql.com/downloads/installer/ |
| **Redis** | https://github.com/tporadowski/redis/releases — descarga el `.zip` o `.msi` |

> Durante la instalación de Tesseract en Windows, marca la opción **"Spanish"** en la lista de idiomas adicionales.

Agrega Tesseract al PATH de Windows. La ruta por defecto es:
```
C:\Program Files\Tesseract-OCR
```

---

## 2. Clonar el repositorio

```bash
git clone <url-del-repo>
cd ocr-image-system
```

---

## 3. Backend

### 3.1 Entorno virtual

**macOS / Linux**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
```

**Windows (cmd)**
```cmd
cd backend
python -m venv venv
venv\Scripts\activate
```

**Windows (PowerShell)**
```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 3.2 Instalar dependencias

**macOS** — exporta las variables de compilación primero:
```bash
export PKG_CONFIG_PATH="$(brew --prefix mysql-client)/lib/pkgconfig"
pip install -r requirements.txt
```

**Windows**:
```cmd
pip install -r requirements.txt
```

> En Windows, si `mysqlclient` falla, instala la versión precompilada:
> ```cmd
> pip install mysqlclient --only-binary=mysqlclient
> ```
> Si sigue fallando, usa `pymysql` como alternativa (ver nota al final).

### 3.3 Variables de entorno

Crea el archivo `backend/.env`:

```env
DB_NAME=nombre_de_tu_base
DB_USER=root
DB_PASSWORD=tu_password
DB_HOST=localhost
DB_PORT=3306
```

### 3.4 Base de datos

Crea la base en MySQL:

**macOS**
```bash
mysql -u root -p -e "CREATE DATABASE nombre_de_tu_base CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**Windows (cmd)**
```cmd
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "CREATE DATABASE nombre_de_tu_base CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Aplica las migraciones:

```bash
python manage.py migrate
```

---

## 4. Levantar los servicios

Necesitas **3 terminales** desde `backend/` con el entorno virtual activado.

### Terminal 1 — Redis

**macOS**
```bash
brew services start redis
redis-cli ping   # debe responder PONG
```

**Windows** — ejecuta el archivo descargado:
```cmd
redis-server.exe
```

### Terminal 2 — Django

```bash
python manage.py runserver
```

API disponible en `http://localhost:8000/api/`

### Terminal 3 — Celery

**macOS y Windows** (usar `--pool=solo` en ambos):
```bash
celery -A config worker --loglevel=info --pool=solo
```

> `--pool=solo` es necesario en macOS por incompatibilidad de OpenCV con `prefork`, y en Windows porque Celery no soporta `prefork` nativamente.

---

## 5. Frontend

### Terminal 4 — desde la carpeta `frontend/`

**macOS / Linux**
```bash
cd frontend
python3 -m http.server 3000
```

**Windows**
```cmd
cd frontend
python -m http.server 3000
```

Abre en el navegador:
```
http://localhost:3000
```

---

## 6. Uso

### Desde el frontend

1. Abre `http://localhost:3000`
2. Click en **Nueva desde ticket** en el sidebar
3. Arrastra o selecciona la foto del ticket
4. Espera el OCR (~1 segundo)
5. Llena los datos del cliente (RFC, razón social, CP, correo)
6. Agrega conceptos si los necesitas
7. Click en **Revisar y timbrar** para ver el preview del CFDI

### Desde el API (Postman)

**Crear company** (solo la primera vez):
```
POST http://localhost:8000/api/companies/
Content-Type: application/json

{
  "rfc_emisor": "ABC123456789",
  "razon_social": "Mi Empresa SA",
  "regimen_fiscal": "601",
  "codigo_postal_expedicion": "01000",
  "certificado_csd": "cert123",
  "clave_producto_sat": "84111506",
  "clave_unidad_sat": "ACT",
  "objeto_impuesto": "02",
  "iva_default": "16.00",
  "forma_pago": "01",
  "metodo_pago": "PUE"
}
```

**Crear client** (solo la primera vez):
```
POST http://localhost:8000/api/clients/
Content-Type: application/json

{
  "rfc": "XAXX010101000",
  "nombre_razon_social": "Cliente Prueba",
  "regimen_fiscal": "616",
  "codigo_postal_fiscal": "01000",
  "uso_cfdi": "G03",
  "correo": "cliente@prueba.com"
}
```

**Subir ticket** (form-data en Postman):
```
POST http://localhost:8000/api/invoices/
image  →  (tipo File) tu_foto.jpg
company → 1
client  → 1
```

**Consultar resultado**:
```
GET http://localhost:8000/api/invoices/<id>/
```

Campos extraídos automáticamente:

| Campo | Descripción |
|---|---|
| `extracted_text` | Texto crudo del ticket |
| `total` | Total detectado |
| `iva` | IVA detectado |
| `fecha` | Fecha del ticket |
| `forma_pago_detectada` | EFECTIVO / TARJETA / etc. |

---

## 7. Tickets de prueba

En `tickets_prueba/` hay 3 tickets HTML listos para fotografiar:

| Archivo | Comercio |
|---|---|
| `ticket_oxxo.html` | OXXO — abarrotes |
| `ticket_farmacia.html` | Farmacias del Ahorro |
| `ticket_restaurante.html` | Taquería El Pastor |

Ábrelos en el navegador, tómales foto con fondo oscuro contrastante y súbelos al sistema.

---

## 8. Estructura del proyecto

```
ocr-image-system/
├── backend/
│   ├── config/              # configuración Django
│   ├── images_api/
│   │   ├── models.py        # Company, Client, Invoice, Product
│   │   ├── views.py         # ViewSets REST
│   │   ├── tasks.py         # tarea Celery (OCR pipeline)
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   └── services/
│   │       ├── preprocessing.py  # OpenCV: detección de borde + binarización
│   │       ├── ocr.py            # pytesseract
│   │       └── parser.py         # regex: total, IVA, fecha, forma de pago
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── css/main.css
│   └── js/
│       ├── data.js          # catálogos SAT + constante EMISOR
│       ├── api.js           # fetch al backend
│       ├── icons.js         # componentes SVG
│       └── views/
│           ├── FacturasView.js
│           ├── NuevaFacturaView.js
│           ├── CFDIPreviewModal.js
│           └── ConfigView.js
└── tickets_prueba/          # tickets HTML de ejemplo
```

---

## 9. Endpoints

| Método | URL | Descripción |
|---|---|---|
| GET | `/api/invoices/` | Lista todos los invoices |
| POST | `/api/invoices/` | Sube imagen y dispara OCR |
| GET | `/api/invoices/<id>/` | Obtiene invoice con texto extraído |
| GET/POST | `/api/companies/` | CRUD empresas emisoras |
| GET/POST | `/api/clients/` | CRUD clientes receptores |
| GET/POST | `/api/products/` | CRUD productos por invoice |

---

## 10. Solución de problemas

**`mysqlclient` no compila en Windows**
```cmd
pip install pymysql
```
Agrega al final de `backend/config/settings.py`:
```python
import pymysql
pymysql.install_as_MySQLdb()
```

**Celery: `signal 11 (SIGSEGV)` en macOS**
Asegúrate de usar `--pool=solo`.

**Tesseract no encontrado en Windows**
Verifica que `C:\Program Files\Tesseract-OCR` esté en el PATH, o configúralo en `backend/images_api/services/ocr.py`:
```python
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
```

**Redis no conecta**
```bash
redis-cli ping   # debe responder PONG
```
Si no responde, verifica que Redis esté corriendo.
