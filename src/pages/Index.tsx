
import React from 'react';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';
import { motion } from 'framer-motion';

const Index = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <Layout>
      {/* Hero section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden mb-16 rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full -mt-32 -mr-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/20 rounded-full -mb-24 -ml-24"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Soluciones de Financiación AZUD</h1>
          <p className="text-lg opacity-90 max-w-2xl">
            Ofrecemos soluciones financieras adaptadas a sus necesidades, para ayudarle a impulsar 
            su negocio con la confianza y respaldo que necesita.
          </p>
        </div>
      </motion.div>

      <motion.section 
        className="mb-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="section-header">
          <h2 className="text-2xl font-bold">Financiación a Corto Plazo</h2>
          <div className="absolute top-0 right-0 w-20 h-20 bg-accent/10 rounded-full transform -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <motion.div variants={itemVariants}>
            <Card 
              title="Clientes Actuales"
              description="Ofrece soluciones de financiación rápida y accesible para cubrir necesidades de pedidos diarios de clientes actuales."
              hint="Ideal para optimizar el término de pago de clientes actuales de Riego."
              href="/financiacion/clientes-actuales"
              buttonText="Calcular financiación"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card 
              title="Nuevos Clientes"
              description="Proporciona financiación a nuevos clientes para ayudarles a comenzar con soluciones de pago adaptadas a sus necesidades."
              hint="Ideal para calcular el término de pago de nuevos clientes en proyectos de Riego."
              href="/financiacion/nuevos-clientes"
              buttonText="Calcular financiación"
            />
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="section-header">
          <h2 className="text-2xl font-bold">Financiación a Largo Plazo</h2>
          <div className="absolute top-0 right-0 w-20 h-20 bg-secondary/10 rounded-full transform -translate-y-1/2 translate-x-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <motion.div variants={itemVariants}>
            <Card 
              title="Stock"
              description="Asegura el respaldo necesario para mantener el stock necesario para grandes proyectos con condiciones de pago flexibles."
              hint="Perfecto para clientes con un enfoque en almacenamiento y suministro continuo."
              href="/financiacion/stock"
              buttonText="Calcular financiación"
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Card 
              title="Proyectos"
              description="Financiación a largo plazo para impulsar desarrollos de gran escala con estructuras de pago adaptadas a cada etapa del proyecto."
              hint="Ideal para clientes con proyectos de largo recorrido y crecimiento continuo en Industria."
              href="/financiacion/proyectos"
              buttonText="Calcular financiación"
            />
          </motion.div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Index;
