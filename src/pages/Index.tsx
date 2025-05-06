
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';

const Index = () => {
  return (
    <Layout>
      <section className="mb-12">
        <div className="section-header">
          <h2 className="text-2xl font-bold text-center">Financiación a Corto Plazo</h2>
        </div>
        <div className="flex flex-row flex-wrap gap-8 p-6">
          <div className="flex-1 min-w-[300px]">
            <Card 
              title="Clientes Actuales"
              description="Ofrece soluciones de financiación rápida y accesible para cubrir necesidades de pedidos diarios de clientes actuales."
              hint="Ideal para optimizar el término de pago de clientes actuales de Riego."
              href="/financiacion/clientes-actuales"
              buttonText="Calcular financiación"
            />
          </div>
          <div className="flex-1 min-w-[300px]">
            <Card 
              title="Nuevos Clientes"
              description="Proporciona financiación a nuevos clientes para ayudarles a comenzar con soluciones de pago adaptadas a sus necesidades."
              hint="Ideal para calcular el término de pago de nuevos clientes en proyectos de Riego."
              href="/financiacion/nuevos-clientes"
              buttonText="Calcular financiación"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="section-header">
          <h2 className="text-2xl font-bold text-center">Financiación a Largo Plazo</h2>
        </div>
        <div className="flex flex-row flex-wrap gap-8 p-6">
          <div className="flex-1 min-w-[300px]">
            <Card 
              title="Stock"
              description="Asegura el respaldo necesario para mantener el stock necesario para grandes proyectos con condiciones de pago flexibles."
              hint="Perfecto para clientes con un enfoque en almacenamiento y suministro continuo."
              href="/financiacion/stock"
              buttonText="Calcular financiación"
            />
          </div>
          <div className="flex-1 min-w-[300px]">
            <Card 
              title="Proyectos"
              description="Financiación a largo plazo para impulsar desarrollos de gran escala con estructuras de pago adaptadas a cada etapa del proyecto."
              hint="Ideal para clientes con proyectos de largo recorrido y crecimiento continuo en Industria."
              href="/financiacion/proyectos"
              buttonText="Calcular financiación"
            />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
