
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import Papa from 'papaparse';

interface Cliente {
  Codigo: string;
  Razon_Social: string;
  NIF: string;
  AREA: string;
  Credito_asegurado: number;
  Credito_empresa: number;
  Termino_pago: string;
}

export const useClienteActual = () => {
  const [clienteData, setClienteData] = useState<Cliente | null>(null);
  const [allClientes, setAllClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Simular base de datos de clientes
  useEffect(() => {
    const mockClientes: Cliente[] = [
      {
        Codigo: '100001',
        Razon_Social: 'Agrícola Moderna S.L.',
        NIF: 'B12345678',
        AREA: 'España',
        Credito_asegurado: 50000,
        Credito_empresa: 20000,
        Termino_pago: '60'
      },
      {
        Codigo: '100002',
        Razon_Social: 'Riegos Europeos GmbH',
        NIF: 'X87654321',
        AREA: 'UE',
        Credito_asegurado: 75000,
        Credito_empresa: 25000,
        Termino_pago: '90'
      },
      {
        Codigo: '100003',
        Razon_Social: 'Desert Irrigation LLC',
        NIF: 'Y65432109',
        AREA: 'Export',
        Credito_asegurado: 100000,
        Credito_empresa: 0,
        Termino_pago: '120'
      }
    ];
    
    // Intentar cargar datos de clientes desde CSV
    const loadCSV = async () => {
      try {
        const response = await fetch('/bbdd_calculadora.csv');
        if (!response.ok) {
          console.log('Using mock client data because CSV file is not available yet');
          setAllClientes(mockClientes);
          setLoading(false);
          return;
        }
        
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const clientesData: Cliente[] = [];
            
            results.data.forEach((row: any) => {
              const clientCode = String(row.Codigo || '').trim();
              if (clientCode) {
                clientesData.push({
                  Codigo: clientCode,
                  Razon_Social: row.Razon_Social || '',
                  NIF: row.NIF || '',
                  AREA: row.AREA || '',
                  Credito_asegurado: parseFloat(String(row.Credito_asegurado || '0').replace(',', '.')),
                  Credito_empresa: parseFloat(String(row.Credito_empresa || '0').replace(',', '.')),
                  Termino_pago: row.Termino_pago || '60'
                });
              }
            });
            
            if (clientesData.length > 0) {
              setAllClientes(clientesData);
            } else {
              setAllClientes(mockClientes);
            }
            
            setLoading(false);
          },
          error: (parseError: any) => {
            console.error('Error al analizar el CSV:', parseError);
            // Fallback to mock data
            setAllClientes(mockClientes);
            setLoading(false);
          }
        });
      } catch (fetchError) {
        console.error('Error al cargar el CSV:', fetchError);
        // Fallback to mock data
        setAllClientes(mockClientes);
        setLoading(false);
      }
    };
    
    loadCSV();
  }, []);
  
  // Función para cargar datos de un cliente específico
  const loadClientData = (codigo: string) => {
    setLoading(true);
    
    // Buscar en la lista de clientes
    const cliente = allClientes.find(c => c.Codigo === codigo);
    
    // Simular llamada a API con un timeout
    setTimeout(() => {
      if (cliente) {
        setClienteData(cliente);
        setLoading(false);
      } else {
        toast.error("Cliente no encontrado");
        setClienteData(null);
        setLoading(false);
      }
    }, 500); // Simular delay de red
  };
  
  return {
    clienteData,
    allClientes,
    loading,
    loadClientData
  };
};
