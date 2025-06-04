import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { TextArea } from '../../components/ui/TextArea';
import { Button } from '../../components/ui/Button';
import { produtoFormFields, FieldConfig } from '../../config/formFields';
import { api, ProdutoNovo } from '../../lib/api';

export const ProdutoCadastroForm: React.FC = () => {
  const initialFormData = produtoFormFields.reduce((acc, field) => {
    acc[field.id] = field.defaultValue !== undefined ? String(field.defaultValue) : '';
    return acc;
  }, {} as { [key: string]: string });

  const [formData, setFormData] = useState<ProdutoNovo>(initialFormData as unknown as ProdutoNovo);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change
    setSuccessMessage('');
    setErrorMessage('');
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    let isValid = true;

    produtoFormFields.forEach(field => {
      if (field.required && !formData[field.id as keyof ProdutoNovo]) {
        newErrors[field.id] = `${field.label} é obrigatório.`;
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const result = await api.inserirProdutoNovo(formData);
      setSuccessMessage(`Produto "${result.nome}" cadastrado com sucesso!`);
      setFormData(initialFormData as unknown as ProdutoNovo); // Reset form
      setErrors({});
    } catch (error: any) {
      setErrorMessage(error.message || 'Erro ao cadastrar produto. Tente novamente.');
      console.error('Erro no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field: FieldConfig) => {
    const commonProps = {
      id: field.id,
      label: field.label,
      required: field.required,
      error: errors[field.id],
      onChange: handleChange,
      value: formData[field.id as keyof ProdutoNovo] || '',
      placeholder: field.placeholder,
      disabled: loading,
    };

    switch (field.type) {
      case 'text':
      case 'number':
        return <Input {...commonProps} type={field.type} min={field.min} max={field.max} />;
      case 'select':
        return <Select {...commonProps} options={field.options || []} value={String(commonProps.value)} onChange={handleChange as any} />;
      case 'textarea':
        return <TextArea {...commonProps} rows={4} />; // Ajuste as linhas conforme necessário
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold mb-4">Cadastro de Novo Produto</h2>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {produtoFormFields.map(field => (
          <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            {renderField(field)}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar Produto'}
        </Button>
      </div>
    </form>
  );
};

export default ProdutoCadastroForm;
