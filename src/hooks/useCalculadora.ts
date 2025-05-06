
import { useState } from 'react';
import { toast } from '@/components/ui/sonner';

export interface AlternativaFinanciacion {
  id: number;
  title: string;
  credito: number;
  interes: number;
  isDescuento?: boolean;
  terminoPago?: number;
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
      const creditoActual = creditoAsegurado + creditoEmpresa;
      
      // Si el término de pago solicitado es 240D o 270D, mostrar directamente la alternativa de contactar con crédito
      if (terminoPago === 240 || terminoPago === 270) {
        setResultData({
          alternativas: [
            {
              id: 999,
              title: "Alternativa: Contactar con Crédito",
              credito: 0,
              interes: 0,
              isDescuento: false,
              terminoPago: terminoPago,
              note: `Debido al término de pago solicitado de ${terminoPago} días, es necesario contactar con el departamento de crédito.`
            }
          ]
        });
        return;
      }

      // Calcular resultados según lógica comercial
      const factorRiesgo = calcularFactorRiesgo(datos.concentracionCompras);
      const factorAreaGeografica = calcularFactorAreaGeografica(datos.areaGeografica);
      
      // Obtener término de pago estándar según área geográfica
      let terminoPagoEstandar;
      if (datos.areaGeografica === "España") {
        terminoPagoEstandar = 60;
      } else if (datos.areaGeografica === "UE") {
        terminoPagoEstandar = 90;
      } else if (datos.areaGeografica === "Export") {
        terminoPagoEstandar = 120;
      } else {
        terminoPagoEstandar = 60; // Valor por defecto
      }
      
      // Aplicar cálculo para cada alternativa
      const alternativas: AlternativaFinanciacion[] = [];
      
      // Calcular crédito necesario
      const ventasAlcanzables = creditoActual + (creditoActual * ((360 / terminoPago) - 1) * factorRiesgo);
      const creditoNecesario = potencialVentas / (factorRiesgo * ((360 / terminoPago) - 1) + 1);
      
      // Calcular interés o descuento
      let primaRiesgo = creditoAsegurado > 0 ? 0 : 0.01;
      let interes;
      
      if (datos.areaGeografica === "España") {
        interes = (((terminoPago - 60) / 360) * 0.05 + primaRiesgo) * 100;
      } else if (datos.areaGeografica === "UE") {
        interes = (((terminoPago - 90) / 360) * 0.05 + primaRiesgo) * 100;
      } else if (datos.areaGeografica === "Export") {
        interes = (((terminoPago - 120) / 360) * 0.05 + primaRiesgo) * 100;
      } else {
        interes = 0;
      }
      
      // Si hay descuento por pronto pago
      if (interes < 0) {
        alternativas.push({
          id: 1,
          title: 'Descuento por Pronto Pago',
          credito: creditoActual,
          interes: Math.abs(interes),
          isDescuento: true,
          terminoPago: terminoPago
        });
      } else {
        // Si el crédito es suficiente
        if (creditoNecesario <= creditoActual) {
          alternativas.push({
            id: 2,
            title: 'Crédito Suficiente',
            credito: creditoActual,
            interes: interes,
            isDescuento: false,
            terminoPago: terminoPago,
            note: 'El crédito actual es suficiente para cubrir el potencial de ventas.'
          });
          
          // Si el tipo de concentración es C, añadir alternativa de ajuste
          if (datos.concentracionCompras === "C" && creditoActual > potencialVentas) {
            const terminoPagoAlternativo = terminoPago + 60;
            alternativas.push({
              id: 5,
              title: 'Alternativa: Ajuste de Término de Pago',
              credito: creditoActual,
              interes: 0,
              isDescuento: false,
              terminoPago: terminoPagoAlternativo,
              note: `El término de pago puede ajustarse a: ${terminoPagoAlternativo} días`
            });
          }
        } else {
          // Si el crédito es insuficiente
          alternativas.push({
            id: 3,
            title: 'Crédito Insuficiente',
            credito: creditoActual,
            interes: interes,
            isDescuento: false,
            terminoPago: terminoPago,
            note: 'El crédito actual es insuficiente para cubrir el potencial de ventas.'
          });
          
          // Alternativa 1: Aumento del Crédito
          alternativas.push({
            id: 4,
            title: 'Alternativa 1: Aumento del Crédito',
            credito: Math.ceil(creditoNecesario),
            interes: interes,
            isDescuento: false,
            terminoPago: terminoPago,
            note: `El crédito debe ajustarse a €${Math.ceil(creditoNecesario).toLocaleString('es-ES')}`
          });
          
          // Alternativa 2: Reducción del Término de Pago
          const terminoPagoAjustado = findPaymentTerm(creditoActual, potencialVentas, datos.concentracionCompras, terminoPagoEstandar);
          
          if (terminoPagoAjustado > 0) {
            let valorInteres = 0;
            let esDescuento = false;
            
            // Determinar si es descuento por pronto pago o interés
            if (datos.areaGeografica === "España" && terminoPagoAjustado < 60) {
              valorInteres = (((60 - terminoPagoAjustado) / 360) * 0.05) * 100;
              esDescuento = true;
            } else if (datos.areaGeografica === "UE" && terminoPagoAjustado < 90) {
              valorInteres = (((90 - terminoPagoAjustado) / 360) * 0.05) * 100;
              esDescuento = true;
            } else if (datos.areaGeografica === "Export" && terminoPagoAjustado < 120) {
              valorInteres = (((120 - terminoPagoAjustado) / 360) * 0.05) * 100;
              esDescuento = true;
            } else {
              const baseTermino = datos.areaGeografica === "España" ? 60 : datos.areaGeografica === "UE" ? 90 : 120;
              valorInteres = (((terminoPagoAjustado - baseTermino) / 360) * 0.05 + primaRiesgo) * 100;
              esDescuento = false;
            }
            
            alternativas.push({
              id: 5,
              title: 'Alternativa 2: Reducción del Término de Pago',
              credito: creditoActual,
              interes: Math.abs(valorInteres),
              isDescuento: esDescuento,
              terminoPago: terminoPagoAjustado,
              note: `El término de pago debe ajustarse a: ${terminoPagoAjustado} días`
            });
          }
        }
      }
      
      // Si el término de pago seleccionado es diferente al actual
      if (creditoNecesario <= creditoActual && terminoPago !== datos.currentTerm && datos.concentracionCompras !== "C") {
        alternativas.push({
          id: 6,
          title: `Solicitar cambio de término de pago (${terminoPago}D)`,
          credito: creditoActual,
          interes: 0,
          isDescuento: false,
          terminoPago: terminoPago,
          note: `El término de pago seleccionado (${terminoPago} días) es diferente al término de pago actual (${datos.currentTerm} días).`
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
      const potencialVentas = parseFloat(datos.potencialVentas);
      const terminoPago = parseInt(datos.terminoPagoSolicitado);
      
      // Si el término de pago solicitado es 240D o 270D, mostrar alternativa especial
      if (terminoPago === 240 || terminoPago === 270) {
        setResultData({
          alternativas: [
            {
              id: 999,
              title: "Alternativa: Contactar con Crédito",
              credito: 0,
              interes: 0,
              isDescuento: false,
              terminoPago: terminoPago,
              note: `Debido al término de pago solicitado de ${terminoPago} días, es necesario contactar con el departamento de crédito.`
            }
          ]
        });
        return;
      }
      
      // Parametrización similar a la del código original
      let areaGeograficaParametrizada;
      if (datos.pais === "España") {
        areaGeograficaParametrizada = "España";
      } else if (datos.areaGeografica === "Europa" || datos.areaGeografica === "UE") {
        areaGeograficaParametrizada = "UE";
      } else {
        areaGeograficaParametrizada = "Export";
      }
      
      let terminoPagoEstandar;
      if (areaGeograficaParametrizada === "España") {
        terminoPagoEstandar = 60;
      } else if (areaGeograficaParametrizada === "UE") {
        terminoPagoEstandar = 90;
      } else if (areaGeograficaParametrizada === "Export") {
        terminoPagoEstandar = 120;
      } else {
        terminoPagoEstandar = 60; // Valor por defecto
      }
      
      let factorMultiplicador = calcularFactorRiesgo(datos.concentracionCompras);
      
      // Alternativa 1: Crédito necesario con término de pago solicitado
      const creditoNecesarioSolicitado = Math.ceil(potencialVentas / (factorMultiplicador * ((360 / terminoPago) - 1) + 1));
      const interesSolicitado = ((terminoPago - terminoPagoEstandar) / 360) * 0.05;
      
      // Alternativa 2: Crédito necesario con término de pago estándar
      const creditoNecesarioEstandar = Math.ceil(potencialVentas / (factorMultiplicador * ((360 / terminoPagoEstandar) - 1) + 1));
      
      // Alternativa 3: Crédito necesario con término de pago a 0 días
      const descuentoppestandar = ((0 - terminoPagoEstandar) / 360) * 0.05;
      
      setResultData({
        alternativas: [
          {
            id: 1,
            title: `Alternativa 1: Término de Pago Solicitado (${terminoPago}D)`,
            credito: creditoNecesarioSolicitado,
            interes: interesSolicitado * 100,
            isDescuento: interesSolicitado < 0,
            terminoPago: terminoPago,
            note: interesSolicitado < 0 ? "Incluye descuento por pronto pago." : undefined
          },
          {
            id: 2,
            title: `Alternativa 2: Término de Pago Estándar (${terminoPagoEstandar}D)`,
            credito: creditoNecesarioEstandar,
            interes: 0,
            isDescuento: false,
            terminoPago: terminoPagoEstandar
          },
          {
            id: 3,
            title: "Alternativa 3: Término de Pago a 0 Días",
            credito: creditoNecesarioEstandar * 0.8, // Reducción del crédito necesario por pago inmediato
            interes: Math.abs(descuentoppestandar * 100),
            isDescuento: true,
            terminoPago: 0,
            note: "El descuento se aplicará siempre y cuando el cliente tenga el crédito necesario."
          }
        ]
      });
    } catch (error) {
      console.error("Error al calcular:", error);
      toast.error("Error al realizar el cálculo");
    }
  };
  
  // Función para preparar correo con la alternativa seleccionada
  const prepararCorreo = (alternativa: AlternativaFinanciacion, datos: any, esNuevoCliente: boolean) => {
    let email = '';
    let subject = '';
    let body = '';
    
    // Determinar destinatario del correo según la alternativa
    if (esNuevoCliente || alternativa.id === 4 || alternativa.id === 999) {
      email = 'credit@azud.com';
    } else {
      email = 'crm@azud.com';
    }
    
    if (esNuevoCliente) {
      // Lógica para nuevos clientes
      subject = `SOLICITUD DE FINANCIACIÓN - ${datos.razonSocial} ${datos.cif}`;
      
      // Determinar el texto de concentración de compras
      let concentracionComprasTexto = '';
      if (datos.concentracionCompras === "A") {
        concentracionComprasTexto = "Ventas lineales (repartidas equitativamente a lo largo del año)";
      } else if (datos.concentracionCompras === "B") {
        concentracionComprasTexto = "Ventas mixtas (Entre 40% y 80% en 2 meses)";
      } else if (datos.concentracionCompras === "C") {
        concentracionComprasTexto = "Concentradas (mayor o igual a 80% en 2 meses)";
      }
      
      body = `
SOLICITUD DE FINANCIACIÓN - CLIENTE NUEVO
------------------------------------------------------------
Razón Social: ${datos.razonSocial}
CIF: ${datos.cif}
Potencial de Ventas: €${parseFloat(datos.potencialVentas).toLocaleString('es-ES')}
Término de Pago Solicitado: ${datos.terminoPagoSolicitado} días
Área Geográfica: ${datos.areaGeografica}
País: ${datos.pais}
Concentración de Compras: ${concentracionComprasTexto}
------------------------------------------------------------
Alternativa seleccionada: ${alternativa.title}
Crédito Necesario: ${alternativa.credito === 0 ? 'A definir por el departamento financiero' : `€${alternativa.credito.toLocaleString('es-ES')}`}
${alternativa.isDescuento ? `Descuento por pronto pago: ${alternativa.interes.toFixed(2)}%` : alternativa.interes > 0 ? `Interés aplicado: ${alternativa.interes.toFixed(2)}%` : ''}
${alternativa.note ? `Nota: ${alternativa.note}` : ''}
------------------------------------------------------------
`;
    } else {
      // Lógica para clientes actuales
      subject = `Informe de Financiación - Cliente: ${datos.razonSocial} ${datos.clientCode} - ${alternativa.title}`;
      
      // Determinar el texto de concentración de compras
      let concentracionComprasTexto = '';
      if (datos.concentracionCompras === "A") {
        concentracionComprasTexto = "Ventas lineales (repartidas equitativamente a lo largo del año)";
      } else if (datos.concentracionCompras === "B") {
        concentracionComprasTexto = "Ventas mixtas (Entre 40% y 80% en 2 meses)";
      } else if (datos.concentracionCompras === "C") {
        concentracionComprasTexto = "Concentradas (mayor o igual a 80% en 2 meses)";
      }
      
      body = `
INFORME DE FINANCIACIÓN - CLIENTE: ${datos.razonSocial} ${datos.clientCode}
------------------------------------------------------------
DATOS DEL CLIENTE:
Código de Cliente: ${datos.clientCode}
Razón Social: ${datos.razonSocial}
CIF: ${datos.cif}
Potencial de Ventas: €${parseFloat(datos.potencialVentas).toLocaleString('es-ES')}
Crédito Asegurado: €${datos.creditoAsegurado}
Crédito de Empresa: €${datos.creditoEmpresa}
Término de Pago Actual de Cliente: ${datos.currentTerm} días
Área Geográfica: ${datos.areaGeografica}
Concentración de Compras: ${concentracionComprasTexto}
------------------------------------------------------------
RESULTADOS:
Alternativa seleccionada: ${alternativa.title}
${alternativa.credito > 0 ? `Crédito: €${alternativa.credito.toLocaleString('es-ES')}` : ''}
${alternativa.isDescuento ? `Descuento por pronto pago: ${alternativa.interes.toFixed(2)}%` : alternativa.interes > 0 ? `Interés aplicado: ${alternativa.interes.toFixed(2)}%` : ''}
${alternativa.terminoPago ? `Término de pago: ${alternativa.terminoPago} días` : ''}
${alternativa.note ? `Nota: ${alternativa.note}` : ''}
------------------------------------------------------------
`;
    }
    
    // Crear enlace mailto y abrirlo
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      window.location.href = mailtoLink;
      toast.success("Preparando correo electrónico...");
    } catch (error) {
      console.error("Error al abrir el cliente de correo:", error);
      toast.error("No se pudo abrir el cliente de correo");
    }
    
    return true;
  };
  
  // Funciones auxiliares para cálculos
  const calcularFactorRiesgo = (concentracionCompras: string): number => {
    switch (concentracionCompras) {
      case 'A': return 0.75;  // Ventas lineales
      case 'B': return 0.35; // Ventas mixtas
      case 'C': return 0.0;  // Ventas concentradas
      default: return 0.5;
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
  
  // Calcular el término de pago ajustado para clientes actuales
  const findPaymentTerm = (
    creditoActual: number, 
    potencialVentas: number, 
    concentracionCompras: string, 
    terminoPagoEstandar: number
  ): number => {
    // Definir el factor de corrección según la concentración de compras
    let factorCorreccion = calcularFactorRiesgo(concentracionCompras);
    
    // Para tipo C hay lógica específica
    if (concentracionCompras === "C") {
      if (potencialVentas > creditoActual) {
        return 0; // Si el potencial de ventas es superior al crédito, el término de pago es 0 días
      } else {
        return terminoPagoEstandar + 60; // Si el crédito es superior al potencial de ventas, ajuste especial
      }
    }
    
    // Asegurarnos de que no haya divisiones por cero o valores negativos
    if (creditoActual <= 0 || factorCorreccion <= 0) {
      return 30; // Retornar un valor mínimo por defecto
    }
    
    // Calcular el término de pago según la fórmula
    const terminoPago = 360 / (((potencialVentas - creditoActual) / (creditoActual * factorCorreccion)) + 1);
    
    // Redondear hacia el múltiplo de 30 más cercano hacia abajo
    let terminoPagoRedondeado = Math.floor(terminoPago / 30) * 30;
    
    // Asegurarnos de que el término de pago no sea menor que 30 ni mayor que 360
    if (terminoPagoRedondeado < 30) {
      terminoPagoRedondeado = 30;
    } else if (terminoPagoRedondeado > 360) {
      terminoPagoRedondeado = 360;
    }
    
    return terminoPagoRedondeado;
  };
  
  return {
    resultData,
    calcularClientesActuales,
    calcularNuevosClientes,
    prepararCorreo
  };
};
