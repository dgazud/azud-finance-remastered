
import { useState, useEffect } from 'react';

export const useAreaGeografica = () => {
  const [areas, setAreas] = useState<string[]>(['España', 'UE', 'Export']);
  const [paises, setPaises] = useState<{[key: string]: string[]}>({
    'España': ['España'],
    'UE': ['Alemania', 'Francia', 'Italia', 'Portugal', 'Otros UE'],
    'Export': ['Estados Unidos', 'México', 'Marruecos', 'China', 'Otros Export']
  });
  const [codigoFiscal, setCodigoFiscal] = useState<{[key: string]: string}>({
    'España': 'CIF/NIF',
    'Alemania': 'Tax ID',
    'Francia': 'SIRET',
    'Italia': 'Codice Fiscale',
    'Portugal': 'NIF',
    'Estados Unidos': 'EIN',
    'México': 'RFC',
    'Marruecos': 'ICE',
    'China': 'TIN',
    'Otros UE': 'VAT Number',
    'Otros Export': 'Tax ID'
  });
  const [loading, setLoading] = useState<boolean>(false);
  
  return {
    areas,
    paises,
    codigoFiscal,
    loading
  };
};
