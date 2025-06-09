import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { api } from '../../lib/api';






export const InputNumero: React.FC<{ valorInicial: number; onChange?: (valor: number) => void;   title?: string; }> = ({ valorInicial, onChange, title }) => {
  const [valor, setValor] = useState(valorInicial);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = Number(event.target.value);
    setValor(novoValor);
    onChange?.(novoValor);
  };

  return (
    <div >
<div className='mx-auto items-center '>        {title && <p>{title}</p>}</div>
            <div className="flex mx-auto max-w-[50%] items-center space-x-2">

       <button onClick={() => setValor(valor > 0 ? valor - 1 : valor)} className="px-6 bg-gray-200 rounded">−</button>
      <Input
      id=''
        type="number"
        value={valor}
        onChange={handleChange}
        className="text-center border border-gray-300 rounded"
                        required={true}
      />

  
      <button onClick={() => setValor(valor + 1)} className="m-2 px-6 bg-gray-200 rounded">+</button>

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
        <div >
    <div className='mx-auto items-center'>
      {title && <p >{title}</p>}    
      </div>
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



export const InputEndereco: React.FC<{enderecoParam?: string; detalhes?:(produtosList: any[]) => void }> = ({enderecoParam = 'oi', detalhes}) => {
  const [endereco, setEndereco] = useState(enderecoParam);
  const [enderecoError, setEnderecoError] = useState('');
  const [enderecoSucesso, setEnderecoSucesso] = useState('');


  const regexEndereco = /^[A-Za-z0-9]{3,}-[A-Za-z0-9]{3,}-[A-Za-z0-9]{2,}$/;



  const handleBiparEndereco = async (paramDigitado?: string) => {
  
  
      if (paramDigitado === '') {
      setEnderecoError('Por favor, digite ou bipe um código de endereço');
      return;
    }
  
    if (regexEndereco.test(endereco)) {paramDigitado = endereco}
      
  
  
    try {
      const result = await api.buscarEnderecoUnico({ enderecoParam: paramDigitado });
  
      console.log('JORGE LOG RESULT',result)
  
      if (result.status === 415) {
  
  setEnderecoError('Endereço não existe')
  setEnderecoSucesso('')
  return
      }
  
      const produtosRaw = result.produtos;
      const produtosList = Array.isArray(produtosRaw?.[0]) ? produtosRaw[0] : [];
  
  
      detalhes?.(produtosList);

      const opcoes = produtosList.map((p) => ({
        label: `${p.nome} - ${p.descricao} `,
        value: p.id?.toString() ?? ''
      }));
      
    } catch (error) {
      setEnderecoError('Erro ao buscar produtos do endereço' + (error instanceof Error ? ': ' + error.message : ''));
  
    }
  };



  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  
      setEnderecoError('');
  
      if (e.target.value === '') {
                setEnderecoSucesso('');
          setEnderecoError('')
              setEndereco(e.target.value);
        return
      }
  
    if (regexEndereco.test(e.target.value)) {
              setEnderecoError('')
          setEnderecoSucesso('Endereço válido!')
      handleBiparEndereco(e.target.value);
      setEndereco(e.target.value);
  
    } else {
          setEndereco(e.target.value);
          setEnderecoSucesso('');
          setEnderecoError('Endereço inválido')
    }
    };





  return (
    <div className="mx-auto mt-4   mb-6 max-w-[50%]">
          <h1 className="text-lg font-bold mb-4 ">Bipar Endereço</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                id="teste"
                placeholder="Digite ou bipe o código do endereço"
                value={endereco}
                onChange={handleEnderecoChange}
                autoFocus
                className="text-lg"
                required={true}
              />

            </div>
          </div>
                                   {enderecoError !== '' && (

                  <p className='text-red-400 text-aling-center'>{enderecoError}</p>

              )}
               {enderecoSucesso !== '' && (

                  <p className='text-green-800 text-aling-center'>Endereço válido!</p>

              )}



        </div>

  );
};
