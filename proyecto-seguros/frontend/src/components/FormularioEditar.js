import { useState, useEffect } from 'react';
import { useValidacion } from '../context/ValidacionContext';

const API = 'http://localhost:3001';

function FormularioEditar({ polizaSeleccionada, onGuardado, onCancelar }) {
    const [form, setForm] = useState(null);
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState('');
    
    // Cambiamos 'buscarId' por un término de búsqueda general (ID o Matrícula)
    const [terminoBusqueda, setTerminoBusqueda] = useState('');

    const { transmisionValida, combValida } = useValidacion();

    // Si nos pasan una póliza desde la tabla, la cargamos directamente
    useEffect(() => {
        if (polizaSeleccionada) {
            setForm({ ...polizaSeleccionada });
            setMensaje('');
        }
    }, [polizaSeleccionada]);

    function buscarPoliza() {
        if (!terminoBusqueda.trim()) {
            setMensaje('Introduce un ID o una Matrícula');
            return;
        }
        
        // Hacemos una petición general y buscamos la coincidencia en el frontend
        // Así nos evitamos tener que crear nuevas rutas en el backend
        fetch(`${API}/polizas`)
            .then(res => res.json())
            .then(data => {
                const termino = terminoBusqueda.trim().toUpperCase();
                
                // Buscamos si el término coincide con el ID o con la matrícula
                const encontrada = data.find(p => 
                    p.id_poliza.toUpperCase() === termino || 
                    p.matricula.toUpperCase() === termino
                );

                if (!encontrada) {
                    setMensaje('Póliza no encontrada con ese ID o Matrícula');
                    setForm(null);
                } else {
                    setForm(encontrada);
                    setMensaje('');
                }
            })
            .catch(() => setMensaje('Error al conectar con el servidor'));
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function validar() {
        const nuevosErrores = {};

        const vigencia = Number(form.vigencia);
        if (!form.vigencia || vigencia < 1 || vigencia > 21) {
            nuevosErrores.vigencia = 'La vigencia debe estar entre 1 y 21 meses';
        }
        const edadCoche = Number(form.edad_coche);
        if (form.edad_coche === '' || edadCoche < 0 || edadCoche > 10) {
            nuevosErrores.edad_coche = 'La edad del coche debe estar entre 0 y 10';
        }
        const edadTomador = Number(form.edad_tomador);
        if (!form.edad_tomador || edadTomador < 18 || edadTomador > 90) {
            nuevosErrores.edad_tomador = 'El tomador debe tener entre 18 y 90 años';
        }
        if (!form.cilindrada) nuevosErrores.cilindrada = 'Campo obligatorio';
        if (!form.cilindros) nuevosErrores.cilindros = 'Campo obligatorio';
        if (!form.peso) nuevosErrores.peso = 'Campo obligatorio';
        if (!transmisionValida.includes(form.transmision)) nuevosErrores.transmision = 'Valor no válido';
        if (!combValida.includes(form.comb_electrico)) nuevosErrores.comb_electrico = 'Valor no válido';

        return nuevosErrores;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const erroresValidacion = validar();
        if (Object.keys(erroresValidacion).length > 0) {
            setErrores(erroresValidacion);
            return;
        }
        setErrores({});

        fetch(`${API}/polizas`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setMensaje('Error: ' + data.error);
                } else {
                    setMensaje('Póliza actualizada correctamente');
                    if (onGuardado) onGuardado();
                }
            })
            .catch(() => setMensaje('Error al conectar con el servidor'));
    }

    return (
        <div className="seccion-card">
            <h2>Editar Póliza</h2>

            {/* Búsqueda manual por ID o Matrícula si no se ha seleccionado desde la tabla */}
            {!polizaSeleccionada && (
                <div className="buscar-poliza">
                    <span>Introduce el ID o la Matrícula de la póliza:</span>
                    <input
                        value={terminoBusqueda}
                        onChange={e => setTerminoBusqueda(e.target.value.toUpperCase())}
                        placeholder="Ej: ID00001 o 1234ABC"
                    />
                    <button onClick={buscarPoliza} className="btn-principal">
                        Buscar
                    </button>
                </div>
            )}

            {mensaje && (
                <p className={`mensaje ${mensaje.startsWith('Error') || mensaje.includes('no encontrada') ? 'mensaje-error' : 'mensaje-exito'}`}>
                    {mensaje}
                </p>
            )}

            {form && (
                <form onSubmit={handleSubmit} className="formulario">
                    <div className="form-grid">
                        <div className="campo">
                            <label>ID Póliza (no editable)</label>
                            <input value={form.id_poliza} disabled />
                        </div>
                        <div className="campo">
                            <label>Matrícula (no editable)</label>
                            <input value={form.matricula} disabled />
                        </div>

                        <div className="campo">
                            <label>Vigencia (meses) *</label>
                            <input type="number" name="vigencia" value={form.vigencia} onChange={handleChange} min="1" max="21" />
                            {errores.vigencia && <span className="error-msg">{errores.vigencia}</span>}
                        </div>

                        <div className="campo">
                            <label>Edad del coche *</label>
                            <input type="number" name="edad_coche" value={form.edad_coche} onChange={handleChange} min="0" max="10" />
                            {errores.edad_coche && <span className="error-msg">{errores.edad_coche}</span>}
                        </div>

                        <div className="campo">
                            <label>Edad del tomador *</label>
                            <input type="number" name="edad_tomador" value={form.edad_tomador} onChange={handleChange} min="18" max="90" />
                            {errores.edad_tomador && <span className="error-msg">{errores.edad_tomador}</span>}
                        </div>

                        <div className="campo">
                            <label>Cilindrada (cc) *</label>
                            <input type="number" name="cilindrada" value={form.cilindrada} onChange={handleChange} />
                            {errores.cilindrada && <span className="error-msg">{errores.cilindrada}</span>}
                        </div>

                        <div className="campo">
                            <label>Nº Cilindros *</label>
                            <input type="number" name="cilindros" value={form.cilindros} onChange={handleChange} />
                            {errores.cilindros && <span className="error-msg">{errores.cilindros}</span>}
                        </div>

                        <div className="campo">
                            <label>Transmisión *</label>
                            <select name="transmision" value={form.transmision} onChange={handleChange}>
                                <option value="Manual">Manual</option>
                                <option value="Automática">Automática</option>
                            </select>
                            {errores.transmision && <span className="error-msg">{errores.transmision}</span>}
                        </div>

                        <div className="campo">
                            <label>Combustible *</label>
                            <select name="comb_electrico" value={form.comb_electrico} onChange={handleChange}>
                                <option value="Combustión">Combustión</option>
                                <option value="Eléctrico">Eléctrico</option>
                            </select>
                            {errores.comb_electrico && <span className="error-msg">{errores.comb_electrico}</span>}
                        </div>

                        <div className="campo">
                            <label>Peso (kg) *</label>
                            <input type="number" name="peso" value={form.peso} onChange={handleChange} />
                            {errores.peso && <span className="error-msg">{errores.peso}</span>}
                        </div>

                        <div className="campo">
                            <label>Siniestro *</label>
                            <select name="siniestro" value={form.siniestro} onChange={handleChange}>
                                <option value="0">No</option>
                                <option value="1">Sí</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="btn-guardar">
                            Guardar cambios
                        </button>
                        {onCancelar && (
                            <button type="button" onClick={onCancelar} className="btn-cancelar">
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            )}
        </div>
    );
}

export default FormularioEditar;