import { createContext, useContext } from 'react';



export const ValidacionContext = createContext();

export function ValidacionProvider({ children }) {

    const regexIdPoliza = /^ID\d{5}$/;
    const regexMatricula = /^\d{4}[BCDFGHJKLMNPRSTV WXYZbcdfghjklmnprstvwxyz]{3}$/;
    // Letras válidas para matrícula española
    const letrasValidas = /^\d{4}[BCDFGHJKLMNPRSTVWXYZ]{3}$/;

    const validaciones = {
        regexIdPoliza,
        letrasValidas,
        transmisionValida: ['Manual', 'Automática'],
        combValida: ['Combustión', 'Eléctrico']
    };

    return (
        <ValidacionContext.Provider value={validaciones}>
            {children}
        </ValidacionContext.Provider>
    );
}

// Hook para usarlo más fácil
export function useValidacion() {
    return useContext(ValidacionContext);
}
