import { useState } from 'react';
import { ValidacionProvider } from './context/ValidacionContext';
import TablaPolizas from './components/TablaPolizas';
import FormularioAlta from './components/FormularioAlta';
import FormularioEditar from './components/FormularioEditar';
import Estadisticas from './components/Estadisticas';
import './App.css';

function App() {
    const [seccion, setSeccion] = useState('tabla');
    const [polizaEditar, setPolizaEditar] = useState(null);
    const [refresh, setRefresh] = useState(0);

    function handleEditar(poliza) {
        setPolizaEditar(poliza);
        setSeccion('editar');
    }

    function handleGuardado() {
        setPolizaEditar(null);
        setSeccion('tabla');
        setRefresh(r => r + 1);
    }

    function handleCancelar() {
        setPolizaEditar(null);
        setSeccion('tabla');
    }

    function irASeccion(s) {
        setSeccion(s);
        setPolizaEditar(null);
    }

    return (
        <ValidacionProvider>
            <div>
                <header className="app-header">
                    <h1>Gestión de Pólizas de Seguro de Automóvil</h1>
                </header>

                <nav className="app-nav">
                    <button
                        onClick={() => irASeccion('tabla')}
                        className={`nav-btn ${seccion === 'tabla' ? 'activo' : ''}`}
                    >
                        Ver Pólizas
                    </button>
                    <button
                        onClick={() => irASeccion('alta')}
                        className={`nav-btn ${seccion === 'alta' ? 'activo' : ''}`}
                    >
                        Nueva Póliza
                    </button>
                    <button
                        onClick={() => irASeccion('editar')}
                        className={`nav-btn ${seccion === 'editar' ? 'activo' : ''}`}
                    >
                        Editar Póliza
                    </button>
                    <button
                        onClick={() => irASeccion('estadisticas')}
                        className={`nav-btn ${seccion === 'estadisticas' ? 'activo' : ''}`}
                    >
                        Estadísticas
                    </button>
                </nav>

                <main className="app-main">
                    {seccion === 'tabla' && (
                        <TablaPolizas key={refresh} onEditar={handleEditar} />
                    )}
                    {seccion === 'alta' && (
                        <FormularioAlta onPolizaCreada={() => { setRefresh(r => r + 1); }} />
                    )}
                    {seccion === 'editar' && (
                        <FormularioEditar
                            polizaSeleccionada={polizaEditar}
                            onGuardado={handleGuardado}
                            onCancelar={handleCancelar}
                        />
                    )}
                    {seccion === 'estadisticas' && <Estadisticas />}
                </main>
            </div>
        </ValidacionProvider>
    );
}

export default App;
