import { useState } from 'react';

const API = 'http://localhost:3001';

function Estadisticas() {
    const [filtros, setFiltros] = useState({
        transmision: '',
        comb_electrico: '',
        siniestro: ''
    });
    const [stats, setStats] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    function handleChange(e) {
        setFiltros({ ...filtros, [e.target.name]: e.target.value });
    }

    function calcularEstadisticas() {
        setCargando(true);
        setError('');

        const params = new URLSearchParams();
        if (filtros.transmision) params.append('transmision', filtros.transmision);
        if (filtros.comb_electrico) params.append('comb_electrico', filtros.comb_electrico);
        if (filtros.siniestro !== '') params.append('siniestro', filtros.siniestro);

        fetch(`${API}/estadisticas?${params.toString()}`)
            .then(res => res.json())
            .then(data => {
                setStats(data);
                setCargando(false);
            })
            .catch(() => {
                setError('Error al obtener estadísticas');
                setCargando(false);
            });
    }

    return (
        <div className="seccion-card">
            <h2>Estadísticas de Pólizas</h2>
            <p style={{ marginBottom: '16px', color: '#666' }}>Selecciona los filtros y pulsa calcular:</p>

            <div className="filtros-estadisticas">
                <div className="filtro-grupo">
                    <label>Transmisión</label>
                    <select name="transmision" value={filtros.transmision} onChange={handleChange}>
                        <option value="">Todas</option>
                        <option value="Manual">Manual</option>
                        <option value="Automática">Automática</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Combustible</label>
                    <select name="comb_electrico" value={filtros.comb_electrico} onChange={handleChange}>
                        <option value="">Todos</option>
                        <option value="Combustión">Combustión</option>
                        <option value="Eléctrico">Eléctrico</option>
                    </select>
                </div>

                <div className="filtro-grupo">
                    <label>Siniestro</label>
                    <select name="siniestro" value={filtros.siniestro} onChange={handleChange}>
                        <option value="">Todos</option>
                        <option value="0">Sin siniestro</option>
                        <option value="1">Con siniestro</option>
                    </select>
                </div>

                <button onClick={calcularEstadisticas} className="btn-principal">
                    Calcular
                </button>
            </div>

            {cargando && <p className="cargando">Calculando...</p>}
            {error && <p className="mensaje mensaje-error">{error}</p>}

            {stats && (
                <div className="resultados-stats">
                    <h3>Resultados</h3>
                    <div className="stat-fila">
                        <span className="stat-label">Total pólizas</span>
                        <span className="stat-valor">{stats.total}</span>
                    </div>
                    <div className="stat-fila">
                        <span className="stat-label">Con siniestro</span>
                        <span className="stat-valor">{stats.conSiniestro} ({stats.pctConSiniestro}%)</span>
                    </div>
                    <div className="stat-fila">
                        <span className="stat-label">Sin siniestro</span>
                        <span className="stat-valor">{stats.sinSiniestro} ({stats.pctSinSiniestro}%)</span>
                    </div>
                    <div className="stat-fila">
                        <span className="stat-label">Media edad coche</span>
                        <span className="stat-valor">{stats.mediaEdadCoche} años</span>
                    </div>
                    <div className="stat-fila">
                        <span className="stat-label">Media edad tomador</span>
                        <span className="stat-valor">{stats.mediaEdadTomador} años</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Estadisticas;
