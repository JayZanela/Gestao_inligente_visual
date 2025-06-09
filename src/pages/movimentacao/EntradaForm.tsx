import React, { useState, useEffect } from 'react';

import { Button } from '../../components/ui/Button';

import { api, EntradaEstoque } from '../../lib/api';
import {InputNumero, InputSelect, InputTexto} from '../../components/layout/FieldsForm';
import Modal from './modalProduto';

interface EntradaFormProps {
  enderecoPreenchido: string;
  produtosOptions: { label: string; value: string }[];
  motivosOptions: {label: string; value:string}[];
}

interface ProdutoOption {
  label: string;
  value: string;
  [key: string]:any; // se quiser permitir extras
}

export const EntradaForm: React.FC<EntradaFormProps> = ({
  enderecoPreenchido,
  produtosOptions,
  motivosOptions
}) => {





  const [loading, setLoading] = useState(false);
  const [modalProduto, setModalProduto] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoOption | null>(null);
  const [ quantidade,setQuantidade] = useState(0);
  const [produtoId, setProdutoId] = useState('');
  const [motivo, setMotivo] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [listaProdutos, setListaProdutos] = useState(produtosOptions);

  // Preenche os campos com opções quando produtosOptions mudar

  motivosOptions = [
      { value: 'Compra', label: 'Compra' },
      { value: 'Devolução', label: 'Devolução' },
      { value: 'Inventário', label: 'Ajuste de Inventário' },
      { value: 'Venda', label: 'Produção' },

  ];
  // Preenche endereço quando vier do pai
  useEffect(() => {
  setListaProdutos(produtosOptions);
}, [produtosOptions]);
  // Preenche produto_id quando usuário seleciona via modal
useEffect(() => {
  if (produtoSelecionado) {
    const novaOption = {
      label: `${produtoSelecionado.nome} - ${produtoSelecionado.descricao || ''}`,
      value: String(produtoSelecionado.id),
    };

    setListaProdutos((prev) => {
      const jaExiste = prev.find((p) => p.value === novaOption.value);
      return jaExiste ? prev : [novaOption, ...prev];
    });

    setProdutoId(novaOption.value);
  }
}, [produtoSelecionado]);



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

  return isValid;
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
       
      console.log('ERROR VALIDADE');
      setErrorMessage('Favor preencher os campos obrigatórios (Marcados com *)');
      return
    }
    const formData: EntradaEstoque = {
  param: {
    endereco: enderecoPreenchido, // vem da prop
    quantidade,                   // do useState
    responsavel_id: 1,            // fixo por enquanto
    motivo,
    observacoes,
    produto_id: Number(produtoId), // porque pode vir como string do select
  }
};

    setLoading(true);
    try {
      const result = await api.executarEntrada(formData);
      console.log(result);
      setSuccessMessage(`Entrada registrada com sucesso!`);

    } catch (error) {
  if (error instanceof Error) {
    setErrorMessage(error.message);
  } else {
    setErrorMessage('Erro desconhecido ao registrar entrada.');
  }
    } finally {
      setLoading(false);
    }
  };

  /*const renderField = (field: FieldConfig) => {
    if (field.id === 'endereco' && enderecoPreenchido) return null;

    const value = formData.param[field.id as keyof typeof formData.param];
    const commonProps = {
      id: field.id,
      name: field.id,
      label: field.label,
      required: field.required,
      error: errors[field.id],
      onChange: handleChange,
      value: value === 0 && field.type === 'number' ? '' : String(value),
      placeholder: field.placeholder,
      disabled: loading,
    };

    switch (field.type) {
      case 'text':
        return <Input {...commonProps} type="text" />;
      case 'number':
        return <Input {...commonProps} type="number" min={field.min} max={field.max} />;
      case 'select':
        return <Select {...commonProps} options={field.options || []} />;
      case 'textarea':
        return <TextArea {...commonProps} rows={3} />;
      default:
        return null;
    }
  };
*/
  return (
    <form  className="space-y-6" onSubmit={handleSubmit}>
      {modalProduto && (
        <Modal
          isOpen={modalProduto}
          onClose={() => setModalProduto(false)}
          onSelectProduto={setProdutoSelecionado}
        />
      )}

      <h2 className="text-xl font-semibold mb-4">Entrada de Produto</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded">{errorMessage}</div>
      )}

      <div className="gap-6  max-w-[77%] mx-auto">
      <InputSelect options={[{label:'Selecione um Produto', value: ''}, ...listaProdutos]} title='Produto *'  onChange={(valor) => setProdutoId(valor)}/>
                      <a
                className="mt-1 mb-4 block text-sm text-primary hover:underline cursor-pointer"
                onClick={() => setModalProduto(true)}
              >
                Pesquisar produto
              </a>
      <InputNumero valorInicial={quantidade} title='Quantidade *' onChange={(valor) => setQuantidade(valor)}/>

      <InputSelect options={[{label:'Selecione um Motivo', value: ''}, ...motivosOptions]} title='Motivo *' onChange={(valor) => setMotivo(valor)}/>

      <InputTexto title='Observações' onChange={(valor) => setObservacoes(valor)}/>


      </div>

      <div className="flex justify-center pt-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Processando...' : 'Registrar Entrada'}
        </Button>
      </div>
    </form>
  );
};

export default EntradaForm;
 