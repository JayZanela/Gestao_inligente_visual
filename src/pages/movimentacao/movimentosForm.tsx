import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { TestTube } from 'lucide-react';

export const InputNumero: React.FC<{ valorInicial: number; onChange?: (valor: number) => void;   title?: string; }> = ({ valorInicial, onChange, title }) => {
  const [valor, setValor] = useState(valorInicial);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = Number(event.target.value);
    setValor(novoValor);
    onChange?.(novoValor);
  };

  return (
    <div >
<div className='mx-auto max-w-[60%] items-center '>        {title && <p>{title}</p>}</div>
            <div className="flex mx-auto max-w-[50%] items-center space-x-2">

       <button onClick={() => setValor(valor - 1)} className="px-6 bg-gray-200 rounded">−</button>
      <Input
        type="number"
        value={valor}
        onChange={handleChange}
        className="text-center border border-gray-300 rounded"
      />

  
      <button onClick={() => setValor(valor + 1)} className="m-4 px-6 bg-gray-200 rounded">+</button>

    </div>
    </div>

  );
};

export const InputSelect: React.FC<{
  options: { label: string; value: string }[];
  onChange?: (valor: string) => void;
  title?: string;
}> = ({ options, onChange, title }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div>
      {title && <p>{title}</p>}
      <select onChange={handleChange} className="p-3 m-2 border-2 border-gray-300 rounded">
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
