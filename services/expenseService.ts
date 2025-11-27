// services/expenseService.ts

// Esta interfaz (ejemplo) ayuda a TypeScript a saber cómo se ve un gasto
interface Gasto {
    id?: string;
    nombre: string;
    cantidad: number;
    fecha?: string;
    // Añade aquí cualquier otro campo que use tu aplicación
}

// ----------------------------------------------------
// FUNCIÓN PARA CARGAR GASTOS (Llamada GET)
// ----------------------------------------------------
export const cargarGastos = async (): Promise<Gasto[]> => {
    try {
        // Llama a la API Route de Vercel que se conecta a Firestore
        const response = await fetch('/api/gastos'); 
        
        if (!response.ok) {
            // Si la respuesta no es 200, lanza un error
            throw new Error(`Error ${response.status}: No se pudo obtener la lista de gastos.`);
        }

        // Devuelve la lista de gastos desde Firestore
        const data: Gasto[] = await response.json(); 
        return data;
        
    } catch (error) {
        console.error("Fallo al cargar los gastos:", error);
        // Devuelve un array vacío en caso de fallo para evitar que la app colapse
        return []; 
    }
};

// ----------------------------------------------------
// FUNCIÓN PARA GUARDAR GASTOS (Llamada POST)
// ----------------------------------------------------
export const guardarGasto = async (gasto: Gasto): Promise<{ id: string, mensaje: string }> => {
    try {
        const response = await fetch('/api/gastos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(gasto),
        });

        // ⭐ CORRECCIÓN CLAVE: Lanza el error SI NO FUE exitoso.
        if (!response.ok) { 
            // Obtenemos el texto del error si es posible
            const errorText = await response.text(); 
            throw new Error(`Fallo del servidor: Estado ${response.status}. Mensaje: ${errorText}`);
        }

        // Si es exitoso, devuelve la respuesta del servidor (líneas 55-56)
        return await response.json(); 

    } catch (error) {
        // ... manejo del error
        throw error;
    }
};
