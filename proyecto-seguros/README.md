# Gestión de Pólizas de Seguro de Automóvil

Aplicación web desarrollada con React (frontend) y Node.js + Express (backend).

## Estructura del proyecto

```
proyecto-seguros/
├── backend/
│   ├── server.js       → Servidor Express con todos los endpoints REST
│   ├── seguros.json    → Fichero de datos (se modifica desde el backend)
│   └── package.json
└── frontend/
    ├── public/
    └── src/
        ├── App.js
        ├── context/
        │   └── ValidacionContext.js  → Expresiones regulares en contexto React
        └── components/
            ├── TablaPolizas.js       → Listado de pólizas con botones editar/eliminar
            ├── FormularioAlta.js     → Alta de nueva póliza con validaciones
            ├── FormularioEditar.js   → Edición de póliza existente
            └── Estadisticas.js      → Estadísticas con filtros
```

## Cómo ejecutar

### Backend

```bash
cd backend
npm install
node server.js
```

El servidor arranca en http://localhost:3001

### Frontend

```bash
cd frontend
npm install
npm start
```

La aplicación arranca en http://localhost:3000

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /polizas | Lista todas las pólizas |
| GET | /polizas/:id | Obtiene una póliza por ID |
| POST | /polizas | Crea una nueva póliza |
| PUT | /polizas | Modifica una póliza existente |
| DELETE | /polizas/:id | Elimina una póliza |
| GET | /estadisticas | Devuelve estadísticas con filtros opcionales |

### Parámetros de /estadisticas

- `transmision`: Manual | Automática
- `comb_electrico`: Combustión | Eléctrico  
- `siniestro`: 0 | 1

## Funcionalidades

- Consulta de todas las pólizas en tabla
- Alta de nueva póliza con validación de todos los campos
- Eliminación desde la propia tabla o por ID
- Edición (no se pueden modificar id_poliza ni matrícula)
- Estadísticas filtradas calculadas en el backend
