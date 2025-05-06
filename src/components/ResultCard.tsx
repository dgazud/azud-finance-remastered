
import React from 'react';
import { Button } from './Button';

interface ResultCardProps {
  title: string;
  credito: number;
  interes: number;
  isDescuento?: boolean;
  note?: string;
  onSelect: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  credito,
  interes,
  isDescuento = false,
  note,
  onSelect,
}) => {
  return (
    <div className="border border-gray-200 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-bold text-primary mb-4">{title}</h3>
      <p className="mb-2">
        <span className="font-medium">Crédito Necesario:</span>{' '}
        €{credito.toLocaleString('es-ES')}
      </p>
      <p className="mb-2">
        <span className="font-medium">
          {isDescuento ? 'Descuento por pronto pago aplicado:' : 'Interés aplicado:'}
        </span>{' '}
        <span className={isDescuento ? 'text-green-600' : interes > 0 ? 'text-amber-600' : ''}>
          {Math.abs(interes).toFixed(2)}%
        </span>
      </p>
      {note && (
        <p className="text-sm text-red-500 mt-2 mb-4">{note}</p>
      )}
      <div className="mt-6">
        <Button 
          variant="outline"
          fullWidth 
          onClick={onSelect}
        >
          Elegir esta alternativa
        </Button>
      </div>
    </div>
  );
};
