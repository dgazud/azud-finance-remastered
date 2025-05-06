
import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { FormHeader } from '@/components/FormHeader';
import { FormInput, FormSelect } from '@/components/FormInputs';
import { Button } from '@/components/Button';
import { toast } from '@/components/ui/sonner';

interface PaymentOption {
  tipo: string;
  cuotas: number;
  cuota: number;
}

interface ProyectoResult {
  razonSocial: string;
  direccion: string;
  nif: string;
  importeProyecto: number;
  importeAporte: number;
  importeCredito: number;
  interesTotal: number;
  importeTotal: number;
  opcionesPago: PaymentOption[];
}

interface Condicion {
  interes: number;
  minImporte: number;
  minAporte: number;
}

interface CondicionesProyecto {
  [key: string]: Condicion;
}

const Proyectos = () => {
  const [formData, setFormData] = useState({
    razonSocial: '',
    direccion: '',
    nif: '',
    importeProyecto: '',
    plazoMeses: '12',
    interes: '',
    fechaVencimiento: '',
  });
  
  const [resultData, setResultData] = useState<ProyectoResult | null>(null);
  const [condiciones, setCondiciones] = useState<CondicionesProyecto>({});
  
  // Simular carga de condiciones desde un archivo CSV
  useEffect(() => {
    // Simular datos de condiciones
    const condicionesObj: CondicionesProyecto = {
      'AZUD 12': {
        interes: 3.5,
        minImporte: 10000,
        minAporte: 0.15
      },
      'AZUD 18': {
        interes: 4.25,
        minImporte: 20000,
        minAporte: 0.20
      },
      'AZUD 24': {
        interes: 5,
        minImporte: 30000,
        minAporte: 0.25
      }
    };
    
    setCondiciones(condicionesObj);
    
    // Establecer interés inicial
    if (formData.plazoMeses === '12') {
      setFormData(prev => ({
        ...prev, 
        interes: condicionesObj['AZUD 12'].interes.toFixed(2)
      }));
    }
  }, []);

  // Actualizar el interés cuando cambia el plazo de meses
  useEffect(() => {
    if (Object.keys(condiciones).length > 0 && formData.plazoMeses) {
      const condicionKey = `AZUD ${formData.plazoMeses}`;
      const condicion = condiciones[condicionKey];
      
      if (condicion) {
        setFormData(prev => ({
          ...prev,
          interes: condicion.interes.toFixed(2)
        }));
      }
    }
  }, [formData.plazoMeses, condiciones]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCalculate = () => {
    try {
      // Validar campos requeridos
      if (!formData.razonSocial || !formData.direccion || !formData.nif || !formData.importeProyecto || !formData.fechaVencimiento) {
        toast.error("Por favor, complete todos los campos requeridos");
        return;
      }
      
      const importeProyecto = parseFloat(formData.importeProyecto);
      const plazoMeses = parseInt(formData.plazoMeses);
      const interes = parseFloat(formData.interes);
      
      const condicionKey = `AZUD ${plazoMeses}`;
      const condicion = condiciones[condicionKey];
      
      // Verificar que el importe cumple con el mínimo requerido
      if (!condicion || importeProyecto < condicion.minImporte) {
        toast.error(`El importe del proyecto no cumple el importe mínimo de ${condicion?.minImporte.toLocaleString('es-ES')}€ para el plazo ${condicionKey}`);
        return;
      }
      
      // Cálculos
      const importeAporte = importeProyecto * condicion.minAporte;
      const importeCredito = importeProyecto - importeAporte;
      const interesTotal = (interes / 100) * (plazoMeses / 12) * importeCredito;
      const importeTotal = importeCredito + interesTotal;
      
      // Opciones de pago según el plazo de meses
      const opcionesPago: PaymentOption[] = [];
      
      if (plazoMeses === 12) {
        opcionesPago.push({ tipo: 'Trimestral', cuotas: 4, cuota: importeTotal / 4 });
        opcionesPago.push({ tipo: 'Semestral', cuotas: 2, cuota: importeTotal / 2 });
        opcionesPago.push({ tipo: '50% a los 9 meses y 50% a los 12 meses', cuotas: 2, cuota: importeTotal / 2 });
      } else if (plazoMeses === 18) {
        opcionesPago.push({ tipo: 'Trimestral', cuotas: 6, cuota: importeTotal / 6 });
        opcionesPago.push({ tipo: 'Semestral', cuotas: 3, cuota: importeTotal / 3 });
      } else if (plazoMeses === 24) {
        opcionesPago.push({ tipo: 'Trimestral', cuotas: 8, cuota: importeTotal / 8 });
        opcionesPago.push({ tipo: 'Semestral', cuotas: 4, cuota: importeTotal / 4 });
      }
      
      // Establecer los resultados
      setResultData({
        razonSocial: formData.razonSocial,
        direccion: formData.direccion,
        nif: formData.nif,
        importeProyecto,
        importeAporte,
        importeCredito,
        interesTotal,
        importeTotal,
        opcionesPago
      });
      
      toast.success("Cálculo realizado correctamente");
    } catch (error) {
      console.error("Error al calcular:", error);
      toast.error("Error al realizar el cálculo");
    }
  };

  return (
    <Layout>
      <FormHeader title="Calculadora de Proyectos a Largo Plazo" />
      
      <div className="mt-8">
        <form className="form-container">
          <FormInput
            label="Razón Social"
            name="razonSocial"
            value={formData.razonSocial}
            onChange={handleChange}
            required
            placeholder="Introduce la razón social..."
          />
          
          <FormInput
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            placeholder="Introduce la dirección..."
          />
          
          <FormInput
            label="Nº de Identificación Fiscal"
            name="nif"
            value={formData.nif}
            onChange={handleChange}
            required
            placeholder="Introduce el NIF/CIF..."
          />
          
          <FormInput
            label="Importe del Proyecto"
            name="importeProyecto"
            type="number"
            value={formData.importeProyecto}
            onChange={handleChange}
            required
            placeholder="Ej: 50000"
          />
          
          <FormSelect
            label="Plazo en Meses"
            name="plazoMeses"
            value={formData.plazoMeses}
            onChange={handleChange}
            options={[
              { value: "12", label: "AZUD 12" },
              { value: "18", label: "AZUD 18" },
              { value: "24", label: "AZUD 24" },
            ]}
            required
          />
          
          <FormInput
            label="Interés (%)"
            name="interes"
            type="number"
            value={formData.interes}
            onChange={handleChange}
            required
            min={0}
            max={10}
            step={0.5}
          />
          
          {formData.plazoMeses && condiciones[`AZUD ${formData.plazoMeses}`] && (
            <p className="text-gray-600 text-center -mt-3 mb-5">
              Interés recomendado por AZUD: {condiciones[`AZUD ${formData.plazoMeses}`].interes.toFixed(2)}%
            </p>
          )}
          
          <FormInput
            label="Fecha de Vencimiento"
            name="fechaVencimiento"
            type="date"
            value={formData.fechaVencimiento}
            onChange={handleChange}
            required
          />
          
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
          <FormHeader title="Resultado de la Financiación" />
          
          <div className="mt-6 border border-gray-200 rounded-lg shadow-md p-6 bg-white">
            <h3 className="text-xl font-bold text-primary mb-4">Información del Proyecto</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <p><span className="font-medium">Razón Social:</span> {resultData.razonSocial}</p>
              <p><span className="font-medium">NIF:</span> {resultData.nif}</p>
              <p><span className="font-medium">Dirección:</span> {resultData.direccion}</p>
            </div>
            
            <div className="space-y-2">
              <p><span className="font-medium">Importe del Proyecto:</span> {resultData.importeProyecto.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
              <p><span className="font-medium">Importe del Pago Previo ({(condiciones[`AZUD ${formData.plazoMeses}`]?.minAporte || 0.15) * 100}%):</span> {resultData.importeAporte.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
              <p><span className="font-medium">Importe a Crédito:</span> {resultData.importeCredito.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
              <p><span className="font-medium">Interés Total:</span> {resultData.interesTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
              <p className="font-bold text-lg text-primary">Importe Total a Pagar: {resultData.importeTotal.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
            </div>
          </div>
          
          <h4 className="text-xl font-bold text-primary mt-8 mb-4">Alternativas de Financiación:</h4>
          
          <div className="space-y-4">
            {resultData.opcionesPago.map((opcion, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg p-5 bg-green-50"
              >
                <p><span className="font-medium">Tipo de Pago:</span> {opcion.tipo}</p>
                <p><span className="font-medium">Cuotas:</span> {opcion.cuotas}</p>
                <p><span className="font-medium">Importe de Cada Cuota:</span> {opcion.cuota.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Proyectos;
