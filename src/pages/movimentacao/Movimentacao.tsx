import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowDownCircle, ArrowRightCircle, ArrowUpCircle } from 'lucide-react';
import EntradaForm from './EntradaForm';
import TransferenciaForm from './TransferenciaForm';
import SaidaForm from './SaidaForm';
import {InputNumero, InputSelect} from './movimentosForm';
import { api } from '../../lib/api';

type MovimentoTipo = 'entrada' | 'transferencia' | 'saida' | ''| 'todos';
type movimentoOpcoes = 'entrada' | 'todos' | 'nenhum';

export const Movimentos: React.FC = () => {
  const [tipoMovimento, setTipoMovimento] = useState<MovimentoTipo>('');
  const [opcoesMovimento, setOpcoesMovimento] = useState<movimentoOpcoes>('nenhum')
  const [endereco, setEndereco] = useState('');
  const [enderecoError, setEnderecoError] = useState('');
  const [enderecoSucesso, setEnderecoSucesso] = useState('');
  const [produtosOptions, setProdutosOptions] = useState<{ label: string; value: string }[]>([]);

      const regexEndereco = /^[A-Za-z0-9]{3,}-[A-Za-z0-9]{3,}-[A-Za-z0-9]{2,}$/;

    const toggleTipo = (tipo: MovimentoTipo) => {
    setTipoMovimento(prev => (prev === tipo ? '' : tipo))
  }

const verificarExibicao = (tipo: MovimentoTipo): boolean => {
  if (opcoesMovimento === 'todos') return true;
  if (opcoesMovimento === 'entrada') return tipo === 'entrada';
  return false;
};

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    setEnderecoError('');

    if (e.target.value === '') {
              setEnderecoSucesso('');
        setEnderecoError('')
            setEndereco(e.target.value);
            setOpcoesMovimento('nenhum')
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

    const opcoes = produtosList.map((p) => ({
      label: `${p.nome} - ${p.descricao} `,
      value: p.id?.toString() ?? ''
    }));

    setProdutosOptions(opcoes);
    if (produtosList.length > 0) {
      setOpcoesMovimento('todos');
    } else if (produtosList.length ===0) {
      setOpcoesMovimento('entrada');
    } else {
      setOpcoesMovimento('nenhum');
    }
    
  } catch (error) {
    setEnderecoError('Erro ao buscar produtos do endereço');

  }
};
  return (

    

    <div className="container">



      <h1 className="text-2xl font-bold mb-6">Movimentos de Estoque</h1>

      <div className="bg-gray rounded-lg shadow-md p-6 mb-8 text-center">

            <div className="mb-6">
                    <InputNumero valorInicial={4} title='Quantidade'/>
                    <InputSelect options={[
  { label: 'Selecione Alguma Opção', value:''},
  { label: 'Venda', value: 'venda' },
  { label: 'Compra', value: 'compra' },
  { label: 'Inventário', value: 'inventario' }
]} title='Motivos'/>
          <h1 className="text-lg font-bold mb-4 ">Bipar Endereço</h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                id="endereco_bipar"
                placeholder="Digite ou bipe o código do endereço"
                value={endereco}
                onChange={handleEnderecoChange}
                autoFocus
                className="text-lg"
              />

            </div>
            
            <Button variant="primary" onClick={() => {handleBiparEndereco(endereco)}}>
              Confirmar
            </Button>
          </div>

                             {enderecoError !== '' && (

                  <p className='text-red-400 text-aling-center'>{enderecoError}</p>

              )}
               {enderecoSucesso !== '' && (

                  <p className='text-green-800 text-aling-center'>Endereço válido!</p>

              )}
        </div>


{opcoesMovimento !== 'nenhum' && (


          <h2 className="text-lg font-medium mb-4">Tipo de Movimento</h2>
)}

        <div className="mb-6">

          <div className="p-2 flex-wrap">

          {verificarExibicao('entrada') && (

           <Button
        variant={tipoMovimento === 'entrada' ? 'primary' : 'outline'}
        onClick={() => toggleTipo('entrada')}
        className="flex items-center gap-2"
        
      >
        <ArrowDownCircle size={tipoMovimento === 'entrada' ? 25 : 18} />
        Entrada
      </Button>
          )}


{verificarExibicao('transferencia') && (

      <Button
        variant={tipoMovimento === 'transferencia' ? 'primary' : 'outline'}
        onClick={() => toggleTipo('transferencia')}
        className="ml-3 mr-3 flex items-center gap-2"
      >
        <ArrowRightCircle size={tipoMovimento === 'transferencia' ? 25 : 18} />
        Transferência
      </Button>


)}

{verificarExibicao('saida') && (

      <Button
        variant={tipoMovimento === 'saida' ? 'primary' : 'outline'}
        onClick={() => toggleTipo('saida')}
        className="flex items-center gap-2"
      >
        <ArrowUpCircle size={tipoMovimento === 'saida' ? 25 : 18} />
        Saída
      </Button>


)}

            {opcoesMovimento !== 'nenhum' && tipoMovimento === '' ? (
  <h2 className="mt-2">Selecione alguma função para seguir</h2>
) : opcoesMovimento === 'nenhum' ? (
  <h2 className="mt-2">Busque por algum endereço existente</h2>
) : null}
          </div>
        </div>



        <div className="mt-8">
          {tipoMovimento === 'entrada' && (
            <EntradaForm
              enderecoPreenchido={endereco}
              produtosOptions={produtosOptions}
            />
          )}
          {tipoMovimento === 'transferencia' && (
            <TransferenciaForm 
            enderecoOrigem={endereco}     
            produtosOptions={produtosOptions}/>
          )}
          {tipoMovimento === 'saida' && (
            <SaidaForm enderecoOrigem={endereco} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Movimentos;
