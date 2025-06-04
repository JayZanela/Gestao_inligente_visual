import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowDownCircle, ArrowRightCircle, ArrowUpCircle } from 'lucide-react';
import EntradaForm from './EntradaForm';
import TransferenciaForm from './TransferenciaForm';
import SaidaForm from './SaidaForm';

type MovimentoTipo = 'entrada' | 'transferencia' | 'saida';

export const Movimentos: React.FC = () => {
  const [tipoMovimento, setTipoMovimento] = useState<MovimentoTipo>('entrada');
  const [endereco, setEndereco] = useState('');
  const [enderecoError, setEnderecoError] = useState('');

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndereco(e.target.value);
    setEnderecoError('');
  };

  const handleBiparEndereco = () => {
    if (!endereco) {
      setEnderecoError('Por favor, digite ou bipe um código de endereço');
      return;
    }
    
    // Aqui você pode adicionar lógica para validar o endereço bipado
    console.log('Endereço bipado:', endereco);
    // Limpar erro se tudo estiver ok
    setEnderecoError('');
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
                autofocos
                className="text-lg"
              />
            </div>
            <Button 
              variant="primary" 
              onClick={handleBiparEndereco}
            >
              Confirmar
            </Button>
          </div>
        </div>
        
        <div className="mt-8">
          {tipoMovimento === 'entrada' && <EntradaForm enderecoPreenchido={endereco} />}
          {tipoMovimento === 'transferencia' && <TransferenciaForm enderecoOrigem={endereco} />}
          {tipoMovimento === 'saida' && <SaidaForm enderecoOrigem={endereco} />}
        </div>
      </div>
    </div>
  );
};

export default Movimentos;
