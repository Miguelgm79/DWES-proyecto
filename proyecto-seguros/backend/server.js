const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'seguros.json');

app.use(cors());
app.use(express.json());

// Función auxiliar para leer el fichero
function leerDatos() {
    try {
        const contenido = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(contenido);
    } catch (error) {
        return []; // Si no existe, devuelve array vacío
    }
}

// Función auxiliar para guardar datos
function guardarDatos(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// --- NUEVA FUNCIÓN: Genera el ID autoincremental ---
function generarSiguienteId(data) {
    if (!data || data.length === 0) return "ID00001";
    
    // Buscamos el número máximo actual
    const maxId = data.reduce((max, p) => {
        // Extraemos los números quitando el "ID" (ej: "ID00015" -> 15)
        const num = parseInt(p.id_poliza.substring(2));
        return num > max ? num : max;
    }, 0);
    
    // Sumamos 1 y rellenamos con ceros a la izquierda hasta tener 5 dígitos
    return `ID${String(maxId + 1).padStart(5, '0')}`;
}

// GET /polizas - Devuelve todas las pólizas
app.get('/polizas', (req, res) => {
    try {
        const data = leerDatos();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});

// GET /polizas/:id_poliza - Devuelve una póliza por id
app.get('/polizas/:id_poliza', (req, res) => {
    try {
        const data = leerDatos();
        const poliza = data.find(p => p.id_poliza === req.params.id_poliza);
        if (!poliza) {
            return res.status(404).json({ error: 'Póliza no encontrada' });
        }
        res.json(poliza);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer los datos' });
    }
});

// POST /polizas - Crea una nueva póliza (ACTUALIZADO PARA AUTO-ID)
app.post('/polizas', (req, res) => {
    try {
        const data = leerDatos();
        const nueva = req.body;

        // Asignamos el ID autoincremental en el servidor
        nueva.id_poliza = generarSiguienteId(data);

        // Convertimos los campos numéricos por si vienen como string
        nueva.vigencia = Number(nueva.vigencia);
        nueva.edad_coche = Number(nueva.edad_coche);
        nueva.edad_tomador = Number(nueva.edad_tomador);
        nueva.cilindrada = Number(nueva.cilindrada);
        nueva.cilindros = Number(nueva.cilindros);
        nueva.peso = Number(nueva.peso);
        nueva.siniestro = Number(nueva.siniestro);

        data.push(nueva);
        guardarDatos(data);
        res.status(201).json(nueva);
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar los datos' });
    }
});

// PUT /polizas - Actualiza una póliza existente
app.put('/polizas', (req, res) => {
    try {
        const data = leerDatos();
        const actualizada = req.body;

        const index = data.findIndex(p => p.id_poliza === actualizada.id_poliza);
        if (index === -1) {
            return res.status(404).json({ error: 'Póliza no encontrada' });
        }

        // Nos aseguramos de que no se cambia la matrícula ni el id
        actualizada.matricula = data[index].matricula;
        actualizada.id_poliza = data[index].id_poliza;

        // Convertimos numéricos
        actualizada.vigencia = Number(actualizada.vigencia);
        actualizada.edad_coche = Number(actualizada.edad_coche);
        actualizada.edad_tomador = Number(actualizada.edad_tomador);
        actualizada.cilindrada = Number(actualizada.cilindrada);
        actualizada.cilindros = Number(actualizada.cilindros);
        actualizada.peso = Number(actualizada.peso);
        actualizada.siniestro = Number(actualizada.siniestro);

        data[index] = actualizada;
        guardarDatos(data);
        res.json(actualizada);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar los datos' });
    }
});

// DELETE /polizas/:id_poliza - Elimina una póliza
app.delete('/polizas/:id_poliza', (req, res) => {
    try {
        let data = leerDatos();
        const existe = data.find(p => p.id_poliza === req.params.id_poliza);
        if (!existe) {
            return res.status(404).json({ error: 'Póliza no encontrada' });
        }

        data = data.filter(p => p.id_poliza !== req.params.id_poliza);
        guardarDatos(data);
        res.json({ mensaje: 'Póliza eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la póliza' });
    }
});

// GET /estadisticas - Devuelve estadísticas con filtros opcionales
app.get('/estadisticas', (req, res) => {
    try {
        const data = leerDatos();
        const { transmision, comb_electrico, siniestro } = req.query;

        let filtrado = [...data];

        if (transmision && transmision !== '') {
            filtrado = filtrado.filter(p => p.transmision === transmision);
        }
        if (comb_electrico && comb_electrico !== '') {
            filtrado = filtrado.filter(p => p.comb_electrico === comb_electrico);
        }
        if (siniestro !== undefined && siniestro !== '') {
            filtrado = filtrado.filter(p => p.siniestro === parseInt(siniestro));
        }

        const total = filtrado.length;

        if (total === 0) {
            return res.json({
                total: 0,
                conSiniestro: 0,
                sinSiniestro: 0,
                pctConSiniestro: 0,
                pctSinSiniestro: 0,
                mediaEdadCoche: 0,
                mediaEdadTomador: 0
            });
        }

        const conSiniestro = filtrado.filter(p => p.siniestro === 1).length;
        const sinSiniestro = total - conSiniestro;
        const pctConSiniestro = ((conSiniestro / total) * 100).toFixed(2);
        const pctSinSiniestro = ((sinSiniestro / total) * 100).toFixed(2);
        const mediaEdadCoche = (filtrado.reduce((suma, p) => suma + p.edad_coche, 0) / total).toFixed(2);
        const mediaEdadTomador = (filtrado.reduce((suma, p) => suma + p.edad_tomador, 0) / total).toFixed(2);

        res.json({
            total,
            conSiniestro,
            sinSiniestro,
            pctConSiniestro,
            pctSinSiniestro,
            mediaEdadCoche,
            mediaEdadTomador
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al calcular estadísticas' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});