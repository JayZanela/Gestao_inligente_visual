import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { transferenciaFormFields, FieldConfig } from '../../config/formFields';
import { api, TransferenciaEstoque } from '../../lib/api';

interface TransferenciaFormProps {
  enderecoOrigem: string;
  produtosOptions: { label: string; value: string }[];
}

interface ProdutoOption {
  label: string;
  value: string;
  [key: string]:any; // se quiser permitir extras
}

export const TransferenciaForm: React.FC<TransferenciaFormProps> = ({ enderecoOrigem, produtosOptions }) => {
  const [formData, setFormData] = useState<TransferenciaEstoque>({
    param: {
      endereco_de: '',
      endereco_para: '',
      quantidade: 0,
      responsavel_id: 1, // Valor padrão para teste
      motivo: '',
      observacoes: '',
      produto_id: 0
    }
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [produtoSelecionado, setProdutoSelecionado] = useState<ProdutoOption | null>(null);
  const [fields, setFields] = useState<FieldConfig[]>([]);


   useEffect(() => {
      const novosCampos = transferenciaFormFields.map(field =>
        field.id === 'produto_id'
          ? { ...field, options: produtosOptions }
          : field
      );
      setFields(novosCampos);
    }, [produtosOptions]);


    // Atualiza o endereço de origem quando o endereço bipado mudar
  useEffect(() => {
    if (enderecoOrigem) {
      setFormData(prev => ({
        ...prev,
        param: {
          ...prev.param,
          endereco_de: enderecoOrigem
        }
      }));
    }
  }, [enderecoOrigem]);


  useEffect(() => {
    if (produtoSelecionado) {
      const novaOpcao = {
        label: `${produtoSelecionado.nome} - ${produtoSelecionado.descricao || ''}`,
        value: String(produtoSelecionado.id)
      };
  
      const novosCampos = transferenciaFormFields.map(field =>
        field.id === 'produto_id'
          ? {
              ...field,
              options: [novaOpcao, ...(field.options || [])]
            }
          : field
      );
  
      setFields(novosCampos);
  
      setFormData(prev => ({
        ...prev,
        param: {
          ...prev.param,
          produto_id: produtoSelecionado.id
        }
      }));
    }
  }, [produtoSelecionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Tratamento especial para campos numéricos
    if (name === 'quantidade' || name === 'produto_id') {
      setFormData(prev => ({
        ...prev,
        param: {
          ...prev.param,
          [name]: value === '' ? 0 : Number(value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        param: {
          ...prev.param,
          [name]: value
        }
      }));
    }
    
    setErrors(prev => ({ ...prev, [name]: '' })); // Limpa erro ao alterar
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

    // Validação específica para transferência
    if (formData.param.endereco_de === formData.param.endereco_para) {
      newErrors.endereco_para = 'O endereço de destino deve ser diferente do endereço de origem.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.executarTransferencia(formData);
      setSuccessMessage(`Transferência registrada com sucesso! Movimentação ID: ${result.movimento?.id || 'N/A'}`);
      
      // Limpa apenas alguns campos, mantendo endereços e produto
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
      setErrorMessage(error.message || 'Erro ao registrar transferência. Tente novamente.');
      console.error('Erro na transferência:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FieldConfig) => {
    // Pula o campo de endereço de origem se já estiver preenchido pelo componente pai
    if (field.id === 'endereco_de' && enderecoOrigem) {
      return null;
    }

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
        {fields.map(field => (
          <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Processando...' : 'Registrar Transferência'}
        </Button>
      </div>
    </form>
  );
};

export default TransferenciaForm;
