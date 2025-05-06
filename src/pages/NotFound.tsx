
import React from 'react';
import { Layout } from '@/components/Layout';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">Lo sentimos, esta página no existe.</p>
        <Link to="/" className="btn">
          Volver al Inicio
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
