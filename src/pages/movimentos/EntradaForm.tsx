import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { entradaFormFields, FieldConfig } from '../../config/formFields';
import { api, EntradaEstoque } from '../../lib/api';
import Modal from './modalProduto';

interface EntradaFormProps {
  enderecoPreenchido: string;
  produtosOptions: { label: string; value: string }[];
}

export const EntradaForm: React.FC<EntradaFormProps> = ({
  enderecoPreenchido,
  produtosOptions
}) => {
  const [formData, setFormData] = useState<EntradaEstoque>({
    param: {
      endereco: '',
      quantidade: 0,
      responsavel_id: 1,
      motivo: '',
      observacoes: '',
      produto_id: 0
    }
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [modalProduto, setModalProduto] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<any | null>(null);
  const [fields, setFields] = useState<FieldConfig[]>([]);

  // Preenche os campos com opções quando produtosOptions mudar
  useEffect(() => {
    const novosCampos = entradaFormFields.map(field =>
      field.id === 'produto_id'
        ? { ...field, options: produtosOptions }
        : field
    );
    setFields(novosCampos);
  }, [produtosOptions]);

  // Preenche endereço quando vier do pai
  useEffect(() => {
    if (enderecoPreenchido) {
      setFormData(prev => ({
        ...prev,
        param: {
          ...prev.param,
          endereco: enderecoPreenchido
        }
      }));
    }
  }, [enderecoPreenchido]);

  // Preenche produto_id quando usuário seleciona via modal
  useEffect(() => {
    if (produtoSelecionado) {
      setFormData(prev => ({
        ...prev,
        param: {
          ...prev.param,
          produto_id: produtoSelecionado.id
        }
      }));
    }
  }, [produtoSelecionado]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      param: {
        ...prev.param,
        [name]: name === 'quantidade' || name === 'produto_id'
          ? value === '' ? 0 : Number(value)
          : value
      }
    }));

    setErrors(prev => ({ ...prev, [name]: '' }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    fields.forEach(field => {
      const value = formData.param[field.id as keyof typeof formData.param];
      if (field.required && (value === '' || value === 0)) {
        newErrors[field.id] = `${field.label} é obrigatório.`;
        isValid = false;
      }
      if (field.type === 'number' && field.min !== undefined && Number(value) < field.min) {
        newErrors[field.id] = `${field.label} deve ser maior ou igual a ${field.min}.`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await api.executarEntrada(formData);
      setSuccessMessage(`Entrada registrada com sucesso! ID: ${result.movimento?.id || 'N/A'}`);
      setFormData(prev => ({
        ...prev,
        param: {
          ...prev.param,
          quantidade: 0,
          motivo: '',
          observacoes: ''
        }
      }));
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao registrar entrada.');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FieldConfig) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(field => (
          <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            {renderField(field)}
            {field.isModal && (
              <a
                className="mt-2 block text-sm text-primary hover:underline cursor-pointer"
                onClick={() => setModalProduto(true)}
              >
                Pesquisar produto
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Processando...' : 'Registrar Entrada'}
        </Button>
      </div>
    </form>
  );
};

export default EntradaForm;
