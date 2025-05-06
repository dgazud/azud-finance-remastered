
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

export interface AlternativaFinanciacion {
  id: number;
  title: string;
  credito: number;
  interes: number;
  isDescuento?: boolean;
  note?: string;
}

interface ResultadoFinanciacion {
  alternativas: AlternativaFinanciacion[];
}

export const useCalculadora = () => {
  const [resultData, setResultData] = useState<ResultadoFinanciacion | null>(null);
  
  // Función para calcular financiación de clientes actuales
  const calcularClientesActuales = (datos: any) => {
    try {
      // Validar campos requeridos
      if (!datos.clientCode || !datos.razonSocial || !datos.potencialVentas) {
        toast.error("Por favor, complete todos los campos requeridos");
        return;
      }

      // Convertir valores de string a número
      const potencialVentas = parseFloat(datos.potencialVentas.replace(/\./g, '').replace(',', '.'));
      const creditoAsegurado = parseFloat(datos.creditoAsegurado.replace(/\./g, '').replace(',', '.')) || 0;
      const creditoEmpresa = parseFloat(datos.creditoEmpresa.replace(/\./g, '').replace(',', '.')) || 0;
      const terminoPago = parseInt(datos.terminoPago);
      
      // Calcular resultados según lógica comercial
      const factorRiesgo = calcularFactorRiesgo(datos.concentracionCompras);
      const factorAreaGeografica = calcularFactorAreaGeografica(datos.areaGeografica);
      
      // Aplicar cálculo para cada alternativa
      const alternativas: AlternativaFinanciacion[] = [];
      
      // Alternativa 1: Financiación básica
      const creditoBase = Math.min(potencialVentas * 0.7, creditoAsegurado * 1.5);
      const interesBase = calcularInteres(terminoPago, datos.concentracionCompras, datos.areaGeografica);
      
      alternativas.push({
        id: 1,
        title: 'Financiación Estándar',
        credito: Math.round(creditoBase),
        interes: interesBase,
        note: creditoBase < potencialVentas * 0.5 ? 'Esta opción cubre menos del 50% del potencial de ventas.' : undefined
      });
      
      // Alternativa 2: Financiación extendida
      const creditoExtendido = Math.min(potencialVentas * 0.85, (creditoAsegurado + creditoEmpresa) * 1.2);
      const interesExtendido = interesBase * 1.15;
      
      alternativas.push({
        id: 2,
        title: 'Financiación Extendida',
        credito: Math.round(creditoExtendido),
        interes: interesExtendido,
        note: creditoExtendido > creditoAsegurado * 2 ? 'Esta opción supera el doble del crédito asegurado.' : undefined
      });
      
      // Alternativa 3: Financiación con descuento por pronto pago
      if (terminoPago > 30) {
        const descuento = terminoPago / 30 * 0.5; // 0.5% por cada 30 días
        alternativas.push({
          id: 3,
          title: 'Opción con Descuento por Pronto Pago',
          credito: Math.round(creditoBase * 0.8),
          interes: -descuento, // Negativo para indicar descuento
          isDescuento: true
        });
      }
      
      setResultData({ alternativas });
    } catch (error) {
      console.error("Error al calcular:", error);
      toast.error("Error al realizar el cálculo");
    }
  };
  
  // Función para calcular financiación de nuevos clientes
  const calcularNuevosClientes = (datos: any) => {
    try {
      // Validar campos requeridos
      if (!datos.razonSocial || !datos.cif || !datos.areaGeografica || !datos.pais || !datos.potencialVentas) {
        toast.error("Por favor, complete todos los campos requeridos");
        return;
      }

      // Convertir valores de string a número
      const potencialVentas = parseFloat(datos.potencialVentas.replace(/\./g, '').replace(',', '.'));
      const terminoPago = parseInt(datos.terminoPagoSolicitado);
      
      // Calcular resultados según lógica comercial para nuevos clientes
      const factorRiesgo = calcularFactorRiesgo(datos.concentracionCompras);
      const factorAreaGeografica = calcularFactorAreaGeografica(datos.areaGeografica);
      
      // Factor de nuevo cliente (más restrictivo)
      const factorNuevoCliente = 0.6;
      
      // Aplicar cálculo para cada alternativa
      const alternativas: AlternativaFinanciacion[] = [];
      
      // Alternativa 1: Financiación conservadora para nuevos clientes
      const creditoBase = potencialVentas * 0.4 * factorNuevoCliente;
      const interesBase = calcularInteres(terminoPago, datos.concentracionCompras, datos.areaGeografica) * 1.2;
      
      alternativas.push({
        id: 1,
        title: 'Financiación Conservadora',
        credito: Math.round(creditoBase),
        interes: interesBase,
        note: 'Recomendada para primeras operaciones.'
      });
      
      // Alternativa 2: Financiación progresiva
      const creditoProgresivo = potencialVentas * 0.55 * factorNuevoCliente;
      const interesProgresivo = interesBase * 1.3;
      
      alternativas.push({
        id: 2,
        title: 'Financiación Progresiva',
        credito: Math.round(creditoProgresivo),
        interes: interesProgresivo,
        note: 'Mayor crédito pero con más interés. Requiere aprobación específica.'
      });
      
      // Alternativa 3: Pago anticipado
      alternativas.push({
        id: 3,
        title: 'Pago Anticipado con Descuento',
        credito: Math.round(potencialVentas * 0.25 * factorNuevoCliente),
        interes: -2, // 2% de descuento
        isDescuento: true,
        note: 'Pequeño crédito con descuento por pronto pago.'
      });
      
      setResultData({ alternativas });
    } catch (error) {
      console.error("Error al calcular:", error);
      toast.error("Error al realizar el cálculo");
    }
  };
  
  // Función para preparar correo con la alternativa seleccionada
  const prepararCorreo = (alternativa: AlternativaFinanciacion, datos: any, esNuevoCliente: boolean) => {
    const subject = `Solicitud de Financiación: ${datos.razonSocial || 'Cliente'} - ${alternativa.title}`;
    const body = `
      Solicitud de financiación para ${esNuevoCliente ? 'nuevo cliente' : 'cliente actual'}:
      
      - Cliente: ${datos.razonSocial || ''}
      - ${esNuevoCliente ? 'País' : 'Código de Cliente'}: ${esNuevoCliente ? datos.pais : datos.clientCode}
      - NIF/CIF: ${datos.cif || ''}
      - Alternativa seleccionada: ${alternativa.title}
      - Crédito: €${alternativa.credito.toLocaleString('es-ES')}
      - ${alternativa.isDescuento ? 'Descuento' : 'Interés'}: ${Math.abs(alternativa.interes).toFixed(2)}%
    `;
    
    // En un caso real, enviaríamos el correo con una API
    console.log("Correo preparado:", { subject, body });
    
    // Simulamos el envío exitoso
    toast.success("Solicitud enviada correctamente");
    return true;
  };
  
  // Funciones auxiliares para cálculos
  const calcularFactorRiesgo = (concentracionCompras: string): number => {
    switch (concentracionCompras) {
      case 'A': return 1.0;  // Ventas lineales
      case 'B': return 0.85; // Ventas mixtas
      case 'C': return 0.7;  // Ventas concentradas
      default: return 0.8;
    }
  };
  
  const calcularFactorAreaGeografica = (area: string): number => {
    switch (area) {
      case 'España': return 1.0;
      case 'UE': return 0.9;
      case 'Export': return 0.7;
      default: return 0.8;
    }
  };
  
  const calcularInteres = (terminoPago: number, concentracionCompras: string, areaGeografica: string): number => {
    // Base de interés según término de pago
    let baseInteres = 0;
    
    if (terminoPago <= 30) baseInteres = 1.0;
    else if (terminoPago <= 60) baseInteres = 2.0;
    else if (terminoPago <= 90) baseInteres = 3.0;
    else if (terminoPago <= 120) baseInteres = 4.0;
    else if (terminoPago <= 180) baseInteres = 5.0;
    else baseInteres = 6.0;
    
    // Ajustes por factores de riesgo
    const factorRiesgo = calcularFactorRiesgo(concentracionCompras);
    const factorArea = calcularFactorAreaGeografica(areaGeografica);
    
    // Interés ajustado
    return baseInteres / (factorRiesgo * factorArea);
  };
  
  return {
    resultData,
    calcularClientesActuales,
    calcularNuevosClientes,
    prepararCorreo
  };
};
