
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

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
  const [loading, setLoading] = useState<boolean>(false);
  
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
    
    setAllClientes(mockClientes);
  }, []);
  
  // Función para cargar datos de un cliente específico
  const loadClientData = (codigo: string) => {
    setLoading(true);
    
    // Simular llamada a API con un timeout
    setTimeout(() => {
      const cliente = allClientes.find(c => c.Codigo === codigo);
      
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
