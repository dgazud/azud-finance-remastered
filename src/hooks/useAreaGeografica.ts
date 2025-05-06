
import { useState, useEffect } from 'react';
import Papa from 'papaparse';

interface AreaData {
  Área: string;
  País: string;
  CódigoFiscal: string;
}

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    const loadCSV = async () => {
      try {
        const response = await fetch('/maestro_areas.csv');
        if (!response.ok) {
          // If the CSV file is not available yet, we'll use the default data
          console.log('Using default area data because CSV file is not available yet');
          setLoading(false);
          return;
        }
        
        const text = await response.text();
        
        Papa.parse(text, {
          header: true,
          complete: (results) => {
            const data = results.data as AreaData[];
            
            // Extraer áreas únicas
            const uniqueAreas = [...new Set(data.map(item => item.Área))]
              .filter(area => area); // Filtrar valores vacíos
            
            if (uniqueAreas.length > 0) {
              setAreas(uniqueAreas);
              
              // Agrupar países por área
              const paisesPorArea: { [key: string]: string[] } = {};
              uniqueAreas.forEach(area => {
                paisesPorArea[area] = data
                  .filter(item => item.Área === area && item.País)
                  .map(item => item.País);
              });
              setPaises(paisesPorArea);
              
              // Mapear códigos fiscales por país
              const codigosFiscales: { [key: string]: string } = {};
              data.forEach(item => {
                if (item.País && item.CódigoFiscal) {
                  codigosFiscales[item.País] = item.CódigoFiscal;
                }
              });
              setCodigoFiscal(codigosFiscales);
            }
            
            setLoading(false);
          },
          error: (parseError: any) => {
            console.error('Error al analizar el CSV:', parseError);
            // We'll continue with the default data
            setLoading(false);
          }
        });
      } catch (fetchError) {
        console.error('Error al cargar el CSV:', fetchError);
        // We'll continue with the default data
        setLoading(false);
      }
    };
    
    loadCSV();
  }, []);

  return {
    areas,
    paises,
    codigoFiscal,
    loading,
    error
  };
};
