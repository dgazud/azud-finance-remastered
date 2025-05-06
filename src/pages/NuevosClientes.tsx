
import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { FormHeader } from '@/components/FormHeader';
import { FormInput, FormSelect } from '@/components/FormInputs';
import { Button } from '@/components/Button';
import { ResultCard } from '@/components/ResultCard';
import { useAreaGeografica } from '@/hooks/useAreaGeografica';
import { useCalculadora, AlternativaFinanciacion } from '@/hooks/useCalculadora';

const NuevosClientes = () => {
  const [formData, setFormData] = useState({
    areaGeografica: '',
    pais: '',
    cif: '',
    razonSocial: '',
    potencialVentas: '',
    terminoPagoSolicitado: '30',
    concentracionCompras: 'A',
  });
  
  const { areas, paises, codigoFiscal, loading } = useAreaGeografica();
  const { resultData, calcularNuevosClientes, prepararCorreo } = useCalculadora();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    calcularNuevosClientes(formData);
  };

  const handleSelectAlternativa = (alternativa: AlternativaFinanciacion) => {
    prepararCorreo(alternativa, formData, true);
  };

  return (
    <Layout>
      <FormHeader title="Calculadora Nuevos Clientes" />
      
      <div className="mt-8">
        <form className="form-container">
          <FormSelect
            label="Área Geográfica"
            name="areaGeografica"
            value={formData.areaGeografica}
            onChange={handleChange}
            options={areas.map(area => ({ value: area, label: area }))}
            required
            placeholder="Selecciona un área geográfica..."
          />
          
          <FormSelect
            label="País"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            options={paises[formData.areaGeografica] ? 
              paises[formData.areaGeografica].map(pais => ({ value: pais, label: pais })) : 
              []}
            required
            disabled={!formData.areaGeografica}
            placeholder="Selecciona un país..."
          />
          
          <FormInput
            label={codigoFiscal[formData.pais] || "Número de Identificación Fiscal"}
            name="cif"
            value={formData.cif}
            onChange={handleChange}
            required
            placeholder="Introduce el NIF/CIF..."
          />
          
          <FormInput
            label="Razón Social"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            required
            placeholder="Introduce la razón social..."
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
          
          <FormSelect
            label="Término de Pago Solicitado"
            name="terminoPagoSolicitado"
            value={formData.terminoPagoSolicitado}
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

export default NuevosClientes;
