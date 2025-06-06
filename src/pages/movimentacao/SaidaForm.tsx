import React, { useState, useEffect } from 'react';

import { Button } from '../../components/ui/Button';
import {InputNumero, InputSelect, InputTexto, InputEndereco} from '../../components/layout/FieldsForm';

import { api, TransferenciaEstoque } from '../../lib/api';

interface SaidaFormProps {
  enderecoOrigem: string;
  produtosOptions: { label: string; value: string }[];
  motivosOptions: {label: string; value:string}[];
}


export const SaidaForm: React.FC<saidaFormProps> = ({ enderecoOrigem, produtosOptions, motivosOptions }) => {

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


    const [ quantidade,setQuantidade] = useState(0);
    const [produtoId, setProdutoId] = useState('');
    const [motivo, setMotivo] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [listaProdutos, setListaProdutos] = useState(produtosOptions);
    const [enderecoPara,  setEnderecoPara] = useState('');



  motivosOptions = [
          { value: 'Venda', label: 'Produção' },
      { value: 'Devolução', label: 'Devolução' },



  ];
    useEffect(() => {
      setListaProdutos(produtosOptions);
    }, [produtosOptions]);

  const  validateForm = ():boolean => {
  let isValid = true;

  console.log(produtoId);
  
  console.log(quantidade);
  
  console.log(motivo);
  if (!produtoId || produtoId === '') {
    isValid = false;
  }

  if (!quantidade || quantidade <= 0) {
    isValid = false;
  }

  if (!motivo || motivo === '') {
    isValid = false;
  }

    if (!enderecoPara || enderecoPara === '') {
    isValid = false;
  }


  return isValid;
};

const validateEnrecos = ():boolean => {

  if (enderecoOrigem === enderecoPara) return false; else return true

}

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      setErrorMessage('Favor preencher os campos obrigatórios (Marcados com *)');
      return;
    }

    const formData: TransferenciaEstoque = {
          param: {
      endereco_de: enderecoOrigem,
      endereco_para: '',
      quantidade: 0,
      responsavel_id: 1, // Valor padrão para teste
      motivo: '',
      observacoes: '',
      produto_id: Number(produtoId)
    }
    }


    setLoading(true);
    try {
      const result = await api.executarTransferencia(formData);
      setSuccessMessage(`Transferência registrada com sucesso! Movimentação ID: ${result.movimento?.id || 'N/A'}`);
      
      // Limpa apenas alguns campos, mantendo endereços e produto
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao registrar transferência. Tente novamente.');
      console.error('Erro na transferência:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Transferência de Produto</h2>
      
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {errorMessage}
        </div>
      )}

            <div className="gap-6  max-w-[77%] mx-auto">
            <InputSelect options={[{label:'Selecione um Produto', value: ''}, ...listaProdutos]} title='Produto *'  onChange={(valor) => setProdutoId(valor)}/>

            <InputNumero valorInicial={quantidade} title='Quantidade *' onChange={(valor) => setQuantidade(valor)}/>
      
            <InputSelect options={[{label:'Selecione um Motivo', value: ''}, ...motivosOptions]} title='Motivo *' onChange={(valor) => setMotivo(valor)}/>
      


            <InputTexto title='Observações (Opcional)' onChange={(valor) => setObservacoes(valor)}/>
      
      
            </div>


      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Processando...' : 'Registrar Transferência'}
        </Button>
      </div>
    </form>
  );
};

export default SaidaForm;
