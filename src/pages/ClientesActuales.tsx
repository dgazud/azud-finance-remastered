
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { FormHeader } from '@/components/FormHeader';
import { FormInput, FormSelect } from '@/components/FormInputs';
import { Button } from '@/components/Button';
import { ResultCard } from '@/components/ResultCard';
import { useCalculadora, AlternativaFinanciacion } from '@/hooks/useCalculadora';
import { useClienteActual } from '@/hooks/useClienteActual';

const ClientesActuales = () => {
  const [formData, setFormData] = useState({
    clientCode: '',
    razonSocial: '',
    cif: '',
    potencialVentas: '',
    creditoAsegurado: '0',
    creditoEmpresa: '0',
    terminoPago: '30',
    areaGeografica: '',
    concentracionCompras: 'A',
    currentTerm: 0,
  });
  
  const { clienteData, allClientes, loading, loadClientData } = useClienteActual();
  const { resultData, calcularClientesActuales, prepararCorreo } = useCalculadora();

  useEffect(() => {
    if (clienteData) {
      setFormData(prevState => ({
        ...prevState,
        razonSocial: clienteData.Razon_Social || '',
        cif: clienteData.NIF || '',
        areaGeografica: clienteData.AREA || '',
        creditoAsegurado: formatNumber(clienteData.Credito_asegurado || 0),
        creditoEmpresa: formatNumber(clienteData.Credito_empresa || 0),
        currentTerm: parseInt(clienteData.Termino_pago || '0'),
        // Establecer el valor del término de pago según el área geográfica
        terminoPago: getTerminoPagoEstandar(clienteData.AREA || ''),
      }));
    }
  }, [clienteData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'clientCode' && value.length === 6) {
      loadClientData(value);
    }
  };

  const handleCalculate = () => {
    calcularClientesActuales(formData);
  };

  const handleSelectAlternativa = (alternativa: AlternativaFinanciacion) => {
    prepararCorreo(alternativa, formData, false);
  };

  // Función para formatear el número con puntos como separador de miles
  const formatNumber = (number: number | string): string => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Función para obtener el término de pago estándar según el área geográfica
  const getTerminoPagoEstandar = (areaGeografica: string): string => {
    switch(areaGeografica) {
      case 'España':
        return '60';
      case 'UE':
        return '90';
      case 'Export':
        return '120';
      default:
        return '60';
    }
  };

  return (
    <Layout>
      <FormHeader title="Calculadora Clientes Actuales" />
      
      <div className="mt-8">
        <form className="form-container">
          <FormInput
            label="Código de Cliente"
            name="clientCode"
            value={formData.clientCode}
            onChange={handleChange}
            maxLength={6}
            required
            placeholder="Introduce el código de cliente (6 dígitos)"
          />
          
          <FormInput
            label="Razón Social"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            readOnly
          />
          
          <FormInput
            label="CIF"
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            readOnly
          />
          
          <FormInput
            label="Potencial de Ventas (€)"
            name="potencialVentas"
            type="number"
            value={formData.potencialVentas}
            onChange={handleChange}
            required
            placeholder="Ej: 50000"
          />
          
          <FormInput
            label="Crédito Asegurado"
            name="creditoAsegurado"
            value={formData.creditoAsegurado}
            onChange={handleChange}
            readOnly
          />
          
          <FormInput
            label="Crédito de Empresa"
            name="creditoEmpresa"
            value={formData.creditoEmpresa}
            onChange={handleChange}
            readOnly
          />
          
          <FormSelect
            label="Término de Pago Solicitado"
            name="terminoPago"
            value={formData.terminoPago}
            onChange={handleChange}
            options={[
              { value: "30", label: "30D" },
              { value: "60", label: "60D" },
              { value: "90", label: "90D" },
              { value: "120", label: "120D" },
              { value: "150", label: "150D" },
              { value: "180", label: "180D" },
              { value: "210", label: "210D" },
              { value: "240", label: "240D" },
              { value: "270", label: "270D" },
            ]}
            required
          />
          
          {formData.currentTerm > 0 && (
            <p className="text-gray-600 text-center -mt-3 mb-5">
              Término actual: {formData.currentTerm}D
            </p>
          )}
          
          <FormInput
            label="Área Geográfica"
            name="areaGeografica"
            value={formData.areaGeografica}
            onChange={handleChange}
            readOnly
          />
          
          <FormSelect
            label="Concentración de Compras"
            name="concentracionCompras"
            value={formData.concentracionCompras}
            onChange={handleChange}
            options={[
              { value: "A", label: "Ventas lineales (repartidas equitativamente a lo largo del año)" },
              { value: "B", label: "Ventas mixtas (Entre 40% y 80% en 2 meses)" },
              { value: "C", label: "Concentradas (mayor o igual a 80% en 2 meses)" },
            ]}
            required
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 mb-8">
            <div className="text-center">
              <div className="h-16 bg-green-100 flex items-center justify-center">
                <div className="w-full h-2 bg-green-500 mx-4"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ventas Lineales</p>
            </div>
            <div className="text-center">
              <div className="h-16 bg-green-100 flex items-center justify-center">
                <div className="w-1/3 h-8 bg-green-500 mx-1"></div>
                <div className="w-1/3 h-4 bg-green-500 mx-1"></div>
                <div className="w-1/3 h-6 bg-green-500 mx-1"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ventas Mixtas</p>
            </div>
            <div className="text-center">
              <div className="h-16 bg-green-100 flex items-center justify-center">
                <div className="w-1/6 h-1 bg-green-500 mx-0.5"></div>
                <div className="w-1/6 h-1 bg-green-500 mx-0.5"></div>
                <div className="w-1/6 h-12 bg-green-500 mx-0.5"></div>
                <div className="w-1/6 h-12 bg-green-500 mx-0.5"></div>
                <div className="w-1/6 h-1 bg-green-500 mx-0.5"></div>
                <div className="w-1/6 h-1 bg-green-500 mx-0.5"></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">Ventas Concentradas</p>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleCalculate} 
              type="button"
              variant="outline"
            >
              Calcular Financiación
            </Button>
          </div>
        </form>
      </div>
      
      {resultData && (
        <div className="mt-10">
          <FormHeader title="Resultados ofrecidos: Elige la alternativa" />
          <div className="space-y-6 mt-6">
            {resultData.alternativas.map((alternativa) => (
              <ResultCard
                key={alternativa.id}
                title={alternativa.title}
                credito={alternativa.credito}
                interes={alternativa.interes}
                isDescuento={alternativa.isDescuento}
                note={alternativa.note}
                onSelect={() => handleSelectAlternativa(alternativa)}
              />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClientesActuales;
