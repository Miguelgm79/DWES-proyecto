import { useState } from 'react';
import { useValidacion } from '../context/ValidacionContext';

const API = 'http://localhost:3001';

const camposVacios = {
    // Hemos eliminado id_poliza porque lo autogenera el backend
    vigencia: '',
    matricula: '',
    edad_coche: '',
    edad_tomador: '',
    cilindrada: '',
    cilindros: '',
    transmision: 'Manual',
    comb_electrico: 'Combustión',
    peso: '',
    siniestro: '0'
};

function FormularioAlta({ onPolizaCreada }) {
    const [form, setForm] = useState(camposVacios);
    const [errores, setErrores] = useState({});
    const [mensaje, setMensaje] = useState('');

    // Eliminamos regexIdPoliza del contexto ya que no lo validamos aquí
    const { letrasValidas, transmisionValida, combValida } = useValidacion();

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function validarFormulario() {
        const nuevosErrores = {};

        const vigencia = Number(form.vigencia);
        if (!form.vigencia || vigencia < 1 || vigencia > 21) {
            nuevosErrores.vigencia = 'La vigencia debe estar entre 1 y 21 meses';
        }

        if (!letrasValidas.test(form.matricula)) {
            nuevosErrores.matricula = 'La matrícula debe tener formato español: 4 números + 3 letras válidas (ej: 1234ABC)';
        }

        const edadCoche = Number(form.edad_coche);
        if (form.edad_coche === '' || edadCoche < 0 || edadCoche > 10) {
            nuevosErrores.edad_coche = 'La edad del coche debe estar entre 0 y 10 años';
        }

        const edadTomador = Number(form.edad_tomador);
        if (!form.edad_tomador || edadTomador < 18 || edadTomador > 90) {
            nuevosErrores.edad_tomador = 'El tomador debe tener entre 18 y 90 años';
        }

        if (!form.cilindrada) nuevosErrores.cilindrada = 'Campo obligatorio';
        if (!form.cilindros) nuevosErrores.cilindros = 'Campo obligatorio';
        if (!form.peso) nuevosErrores.peso = 'Campo obligatorio';

        if (!transmisionValida.includes(form.transmision)) {
            nuevosErrores.transmision = 'Valor no válido';
        }
        if (!combValida.includes(form.comb_electrico)) {
            nuevosErrores.comb_electrico = 'Valor no válido';
        }

        return nuevosErrores;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const erroresValidacion = validarFormulario();

        if (Object.keys(erroresValidacion).length > 0) {
            setErrores(erroresValidacion);
            return;
        }

        setErrores({});

        fetch(`${API}/polizas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setMensaje('Error: ' + data.error);
                } else {
                    setMensaje('Póliza creada correctamente');
                    setForm(camposVacios);
                    if (onPolizaCreada) onPolizaCreada();
                }
            })
            .catch(() => setMensaje('Error al conectar con el servidor'));
    }

    return (
        <div className="seccion-card">
            <h2>Alta de nueva póliza</h2>
            {mensaje && (
                <p className={`mensaje ${mensaje.startsWith('Error') ? 'mensaje-error' : 'mensaje-exito'}`}>
                    {mensaje}
                </p>
            )}
            <form onSubmit={handleSubmit} className="formulario">
                <div className="form-grid">
                    {/* Hemos eliminado el campo ID Póliza */}

                    <div className="campo">
                        <label>Matrícula *</label>
                        <input name="matricula" value={form.matricula} onChange={handleChange} placeholder="1234ABC" />
                        {errores.matricula && <span className="error-msg">{errores.matricula}</span>}
                    </div>

                    <div className="campo">
                        <label>Vigencia (meses) *</label>
                        <input type="number" name="vigencia" value={form.vigencia} onChange={handleChange} min="1" max="21" />
                        {errores.vigencia && <span className="error-msg">{errores.vigencia}</span>}
                    </div>

                    <div className="campo">
                        <label>Edad del coche (años) *</label>
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
                        <label>Tipo de combustible *</label>
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

                <button type="submit" className="btn-guardar">
                    Crear Póliza
                </button>
            </form>
        </div>
    );
}

export default FormularioAlta;