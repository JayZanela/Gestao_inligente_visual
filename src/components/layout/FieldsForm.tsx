import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { api } from "../../lib/api";

export const InputTexto: React.FC<{
  onChange?: (valor: string) => void;
  title?: string;
  value?: string;
  disabled?: boolean;
}> = ({ onChange, disabled, title, value }) => {
  const [valor, setValor] = useState("");

  useEffect(() => {
    if (value) {
      setValor(value);
    }
  }, [valor]);

  const isDisabled = disabled ? disabled : false;

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const novoValor = event.target.value;
    setValor(novoValor);
    onChange?.(novoValor);
  };

  return (
    <div>
      <div className="mx-auto items-center "> {title && <p>{title}</p>}</div>
      <div className="flex mx-auto sm:max-w-[95%] lg:max-w-[55%] items-center space-x-2">
        <TextArea
          id=""
          value={valor}
          onChange={handleChange}
          className="text-center border border-gray-300 rounded"
          rows={2}
          disabled={isDisabled}
        />
      </div>
    </div>
  );
};

export const InputNumero: React.FC<{
  valorInicial: number;
  onChange?: (valor: number) => void;
  title?: string;
}> = ({ valorInicial, onChange, title }) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const novoValor = Number(event.target.value);
    onChange?.(novoValor);
  };

  const handleIncrement = () => {
    onChange?.(valorInicial + 1);
  };

  const handleDecrement = () => {
    onChange?.(valorInicial > 0 ? valorInicial - 1 : 0);
  };

  return (
    <div>
      <div className="mx-auto items-center">{title && <p>{title}</p>}</div>

      <div className="flex">
        <div className="flex mx-auto sm:max-w-[95%] lg:max-w-[55%] items-center space-x-2">
          <Input
            id=""
            type="number"
            value={valorInicial}
            onChange={handleInputChange}
            className="text-center border border-gray-300 rounded"
            required
          />
        </div>
      </div>

      <div>
        <button
          type="button"
          onClick={handleDecrement}
          className="px-6 bg-gray-200 rounded"
        >
          −
        </button>
        <button
          type="button"
          onClick={handleIncrement}
          className="m-2 px-6 bg-gray-200 rounded"
        >
          +
        </button>
      </div>
    </div>
  );
};

export const InputSelect: React.FC<{
  options: { label: string; value: string }[];
  onChange?: (valor: string) => void;
  title?: string;
  value?: string;
  output?: (retorno: string) => void;
}> = ({ options, onChange, title, value }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div>
      {title && <p>{title}</p>}
      <select
        onChange={handleChange}
        className="pt-3 pb-3 w-full border-2 border-gray-300 rounded"
        value={value}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const InputEndereco: React.FC<{
  enderecoParam?: string;
  onValueChange?: (valor: string) => void;
  detalhes?: (produtosList: any[]) => void;
  title?: string;
  isValid?: (retorno: boolean) => void;
}> = ({ enderecoParam = "", onValueChange, detalhes, title, isValid }) => {
  const [endereco, setEndereco] = useState(enderecoParam);
  const [enderecoError, setEnderecoError] = useState("");
  const [enderecoSucesso, setEnderecoSucesso] = useState("");

  const regexEndereco = /^[A-Za-z0-9]{3,}-[A-Za-z0-9]{3,}-[A-Za-z0-9]{2,}$/;

  useEffect(() => {
    setEndereco(enderecoParam);
  }, [enderecoParam]);

  const handleBiparEndereco = async (paramDigitado?: string) => {
    if (paramDigitado === "") {
      setEnderecoError("Por favor, digite ou bipe um código de endereço");
      return;
    }

    if (regexEndereco.test(endereco)) {
      paramDigitado = endereco;
    }

    try {
      const result = await api.buscarEnderecoUnico({
        enderecoParam: paramDigitado,
      });

      console.log("JORGE LOG RESULT", result);

      if (result.status === 415) {
        setEnderecoError("Endereço não existe");
        setEnderecoSucesso("");
        return;
      }

      const produtosRaw = result.produtos;
      const produtosList = Array.isArray(produtosRaw?.[0])
        ? produtosRaw[0]
        : [];
      detalhes?.(produtosList);
      onValueChange?.(paramDigitado);

      const opcoes = produtosList.map((p) => ({
        label: `${p.nome} - ${p.descricao} `,
        value: p.id?.toString() ?? "",
      }));
    } catch (error) {
      setEnderecoError(
        "Erro ao buscar produtos do endereço" +
          (error instanceof Error ? ": " + error.message : "")
      );
    }
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;

    setEnderecoError("");
    onValueChange?.(v);
    console.log("Houve definição de regra");

    if (e.target.value === "") {
      setEnderecoSucesso("");
      setEnderecoError("");
      setEndereco(e.target.value);
      return;
    }

    if (regexEndereco.test(e.target.value)) {
      setEnderecoError("");
      setEnderecoSucesso("Endereço válido!");
      handleBiparEndereco(e.target.value);
      setEndereco(e.target.value);
      return;
    } else {
      setEndereco(e.target.value);
      setEnderecoSucesso("");
      setEnderecoError("Endereço inválido");
      return;
    }
  };

  return (
    <div className="mx-auto mt-4   mb-6 sm:max-w-[95%] lg:max-w-[55%]">
      {title && <p className="font-bold mb-2">{title}</p>}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            id="inpoutEndereco"
            placeholder="Digite ou bipe o código do endereço"
            value={endereco}
            onChange={handleEnderecoChange}
            autoFocus
            className="text-lg"
          />
        </div>
      </div>
      {enderecoError !== "" && (
        <p className="text-red-400 text-aling-center">{enderecoError}</p>
      )}
      {enderecoSucesso !== "" && (
        <p className="text-green-800 text-aling-center">Endereço válido!</p>
      )}
    </div>
  );
};
