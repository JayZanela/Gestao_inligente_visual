import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowDownCircle, ArrowRightCircle, ArrowUpCircle } from 'lucide-react';
import EntradaForm from './EntradaForm';
import TransferenciaForm from './TransferenciaForm';
import SaidaForm from './SaidaForm';
import { api } from '../../lib/api';

type MovimentoTipo = 'entrada' | 'transferencia' | 'saida';

export const Movimentos: React.FC = () => {
  const [tipoMovimento, setTipoMovimento] = useState<MovimentoTipo>('entrada');
  const [endereco, setEndereco] = useState('');
  const [enderecoError, setEnderecoError] = useState('');
  const [formEndereco, setFormEndereco] = useState({ enderecoParam: '' });
  const [produtosOptions, setProdutosOptions] = useState<{ label: string; value: string }[]>([]);

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndereco(e.target.value);
    setEnderecoError('');
    setFormEndereco({ enderecoParam: e.target.value });
  };

const handleBiparEndereco = async () => {
  if (!endereco) {
    setEnderecoError('Por favor, digite ou bipe um código de endereço');
    return;
  }

  try {
    const result = await api.buscarEnderecoUnico({ enderecoParam: endereco });

    const produtosRaw = result.produtos;
    const produtosList = Array.isArray(produtosRaw?.[0]) ? produtosRaw[0] : [];

    const opcoes = produtosList.map((p: any) => ({
      label: `${p.nome} - ${p.descricao} `,
      value: p.id?.toString() ?? ''
    }));

    setProdutosOptions(opcoes);
  } catch (error) {
    setEnderecoError('Erro ao buscar produtos do endereço');
    console.error(error);
  }
};
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Movimentos de Estoque</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Tipo de Movimento</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant={tipoMovimento === 'entrada' ? 'primary' : 'outline'}
              onClick={() => setTipoMovimento('entrada')}
              className="flex items-center gap-2"
            >
              <ArrowDownCircle size={18} />
              Entrada
            </Button>
            <Button
              variant={tipoMovimento === 'transferencia' ? 'primary' : 'outline'}
              onClick={() => setTipoMovimento('transferencia')}
              className="flex items-center gap-2"
            >
              <ArrowRightCircle size={18} />
              Transferência
            </Button>
            <Button
              variant={tipoMovimento === 'saida' ? 'primary' : 'outline'}
              onClick={() => setTipoMovimento('saida')}
              className="flex items-center gap-2"
            >
              <ArrowUpCircle size={18} />
              Saída
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Bipar Endereço</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <Input
                id="endereco_bipar"
                placeholder="Digite ou bipe o código do endereço"
                value={endereco}
                onChange={handleEnderecoChange}
                error={enderecoError}
                autoFocus
                className="text-lg"
              />
            </div>
            <Button variant="primary" onClick={handleBiparEndereco}>
              Confirmar
            </Button>
          </div>
          {enderecoError && (
            <p className="text-red-500 text-sm mt-2">{enderecoError}</p>
          )}
        </div>

        <div className="mt-8">
          {tipoMovimento === 'entrada' && (
            <EntradaForm
              enderecoPreenchido={endereco}
              produtosOptions={produtosOptions}
            />
          )}
          {tipoMovimento === 'transferencia' && (
            <TransferenciaForm enderecoOrigem={endereco} />
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
