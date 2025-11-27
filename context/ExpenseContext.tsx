import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'; // <-- AÑADE: useEffect, useCallback
import { Expense, ExpenseStatus } from '../types';
// import { MOCK_EXPENSES } from '../mockData'; // <-- ELIMINA esta línea si ya no la necesitas

// IMPORTA las nuevas funciones de servicio
import { cargarGastos, guardarGasto } from '../services/expenseService'; // <-- AÑADE esta línea

interface ExpenseContextType {
  expenses: Expense[];
  // addExpense ahora es ASÍNCRONA
  addExpense: (expense: Expense) => Promise<void>; // <-- MODIFICA para que sea Promise<void>
  updateStatus: (id: string, status: ExpenseStatus, notes?: string) => void;
  getExpensesByUser: (userId: string) => Expense[];
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ELIMINA MOCK_EXPENSES
  const [expenses, setExpenses] = useState<Expense[]>([]); // <-- MODIFICADO a estado inicial vacío

  // ----------------------------------------------------
  // AÑADE LÓGICA DE CARGA (Para obtener datos de Firestore al inicio)
  // ----------------------------------------------------
  const loadExpenses = useCallback(async () => {
    try {
      const data = await cargarGastos(); 
      setExpenses(data); // Actualiza el estado de React con los datos de la nube
    } catch (error) {
      console.error("Error al cargar los gastos de Firestore:", error);
    }
  }, []); // Dependencias: ninguna

  // Ejecuta la carga una vez al montar el componente
  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]); 
  // ----------------------------------------------------
  
  // MODIFICA addExpense para guardar en la nube
  const addExpense = async (expense: Expense) => { // <-- AÑADE async aquí
    try {
      // 1. Guarda el gasto en Firestore (a través de Vercel API)
      await guardarGasto(expense); 

      // 2. Recarga la lista completa desde la nube para actualizar la vista
      await loadExpenses(); 
      
    } catch (error) {
      console.error("Fallo al guardar gasto en la nube:", error);
      // Opcional: Mostrar un mensaje de error al usuario
    }
  }; // <-- ELIMINADA la lógica de setExpenses local
  
  const updateStatus = (id: string, status: ExpenseStatus, notes?: string) => {
    setExpenses(prev => prev.map(exp => {
      if (exp.id === id) {
        return { ...exp, status, notes: notes ? notes : exp.notes };
      }
      return exp;
    }));
    // NOTA: Para que el cambio de estado sea permanente, esta función 
    // TAMBIÉN debe llamar a una función de servicio para actualizar Firestore.
  };

  const getExpensesByUser = (userId: string) => {
    return expenses.filter(e => e.userId === userId);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense, updateStatus, getExpensesByUser }}>
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};
