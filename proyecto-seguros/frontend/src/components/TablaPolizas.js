import { useState, useEffect } from 'react';

const API = 'http://localhost:3001';

function TablaPolizas({ onEditar }) {
    const [polizas, setPolizas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [mensaje, setMensaje] = useState('');

    // Estados de filtros
    const [filtroId, setFiltroId] = useState('');
    const [filtroMatricula, setFiltroMatricula] = useState('');
    const [filtroTransmision, setFiltroTransmision] = useState('');
    const [filtroCombustible, setFiltroCombustible] = useState('');
    const [filtroSiniestro, setFiltroSiniestro] = useState('');
    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    useEffect(() => {
        cargarPolizas();
    }, []);

    function cargarPolizas() {
        setCargando(true);
        fetch(`${API}/polizas`)
            .then(res => res.json())
            .then(data => {
                setPolizas(data);
                setCargando(false);
            })
            .catch(err => {
                console.error(err);
                setMensaje('Error al cargar las pólizas');
                setCargando(false);
            });
    }

    function eliminarPoliza(id) {
        if (!window.confirm(`¿Seguro que quieres eliminar la póliza ${id}?`)) return;

        fetch(`${API}/polizas/${id}`, { method: 'DELETE' })
            .then(res => res.json())
            .then(data => {
                setMensaje(data.mensaje || data.error);
                cargarPolizas();
            })
            .catch(err => {
                setMensaje('Error al eliminar');
            });
    }

    function limpiarFiltros() {
        setFiltroId('');
        setFiltroMatricula('');
        setFiltroTransmision('');
        setFiltroCombustible('');
        setFiltroSiniestro('');
    }

    // Filtrar las pólizas según los filtros activos
    const polizasFiltradas = polizas.filter(p => {
        if (filtroId && !p.id_poliza.toLowerCase().includes(filtroId.toLowerCase())) return false;
        if (filtroMatricula && !p.matricula.toLowerCase().includes(filtroMatricula.toLowerCase())) return false;
        if (filtroTransmision && p.transmision !== filtroTransmision) return false;
        if (filtroCombustible && p.comb_electrico !== filtroCombustible) return false;
        if (filtroSiniestro !== '' && String(p.siniestro) !== filtroSiniestro) return false;
        return true;
    });

    const hayFiltrosActivos = filtroId || filtroMatricula || filtroTransmision || filtroCombustible || filtroSiniestro !== '';

    if (cargando) return <p className="cargando">Cargando pólizas...</p>;

    return (
        <div className="seccion-card">
            <h2>Listado de Pólizas</h2>
            {mensaje && (
                <p className={`mensaje ${mensaje.includes('Error') ? 'mensaje-error' : 'mensaje-exito'}`}>
                    {mensaje}
                </p>
            )}

            <div className="tabla-toolbar">
                <p className="tabla-info">
                    Total: <strong>{polizasFiltradas.length}</strong> pólizas
                    {hayFiltrosActivos && <span> (de {polizas.length} totales)</span>}
                </p>
                <button
                    onClick={() => setMostrarFiltros(!mostrarFiltros)}
                    className={`btn-filtrar ${mostrarFiltros ? 'activo' : ''}`}
                >
                    {mostrarFiltros ? 'Ocultar filtros' : 'Filtrar'}
                </button>
            </div>

            {mostrarFiltros && (
                <div className="filtros-tabla">
                    <div className="filtro-campo">
                        <label>ID Póliza</label>
                        <input
                            type="text"
                            value={filtroId}
                            onChange={e => setFiltroId(e.target.value)}
                            placeholder="Buscar por ID..."
                        />
                    </div>
                    <div className="filtro-campo">
                        <label>Matrícula</label>
                        <input
                            type="text"
                            value={filtroMatricula}
                            onChange={e => setFiltroMatricula(e.target.value)}
                            placeholder="Buscar matrícula..."
                        />
                    </div>
                    <div className="filtro-campo">
                        <label>Transmisión</label>
                        <select value={filtroTransmision} onChange={e => setFiltroTransmision(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="Manual">Manual</option>
                            <option value="Automática">Automática</option>
                        </select>
                    </div>
                    <div className="filtro-campo">
                        <label>Combustible</label>
                        <select value={filtroCombustible} onChange={e => setFiltroCombustible(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="Combustión">Combustión</option>
                            <option value="Eléctrico">Eléctrico</option>
                        </select>
                    </div>
                    <div className="filtro-campo">
                        <label>Siniestro</label>
                        <select value={filtroSiniestro} onChange={e => setFiltroSiniestro(e.target.value)}>
                            <option value="">Todos</option>
                            <option value="0">Sin siniestro</option>
                            <option value="1">Con siniestro</option>
                        </select>
                    </div>
                    {hayFiltrosActivos && (
                        <div className="filtro-campo filtro-campo-btn">
                            <button onClick={limpiarFiltros} className="btn-limpiar">
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                </div>
            )}

            <div className="tabla-container">
                <table className="tabla-polizas">
                    <thead>
                        <tr>
                            <th>ID Póliza</th>
                            <th>Vigencia</th>
                            <th>Matrícula</th>
                            <th>Edad coche</th>
                            <th>Edad tomador</th>
                            <th>Cilindrada</th>
                            <th>Cilindros</th>
                            <th>Transmisión</th>
                            <th>Combustible</th>
                            <th>Peso (kg)</th>
                            <th>Siniestro</th>
                            <th className="col-acciones">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {polizasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan="12" className="tabla-vacia">
                                    No se encontraron pólizas con esos filtros
                                </td>
                            </tr>
                        ) : (
                            polizasFiltradas.map((p) => (
                                <tr key={p.id_poliza}>
                                    <td><strong>{p.id_poliza}</strong></td>
                                    <td>{p.vigencia} meses</td>
                                    <td>{p.matricula}</td>
                                    <td>{p.edad_coche} años</td>
                                    <td>{p.edad_tomador} años</td>
                                    <td>{p.cilindrada} cc</td>
                                    <td>{p.cilindros}</td>
                                    <td>{p.transmision}</td>
                                    <td>{p.comb_electrico}</td>
                                    <td>{p.peso}</td>
                                    <td>
                                        <span className={`badge ${p.siniestro === 1 ? 'badge-si' : 'badge-no'}`}>
                                            {p.siniestro === 1 ? 'Sí' : 'No'}
                                        </span>
                                    </td>
                                    <td className="col-acciones">
                                        <div className="acciones-btns">
                                            <button onClick={() => onEditar(p)} className="btn-editar">
                                                Editar
                                            </button>
                                            <button onClick={() => eliminarPoliza(p.id_poliza)} className="btn-eliminar">
                                                Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TablaPolizas;
