import React, { useState, useEffect } from "react";
import { Input } from "../../components/ui/Input";
import { TextArea } from "../../components/ui/TextArea";
import { api } from "../../lib/api";

export const InputTexto: React.FC<{
  onChange?: (valor: string) => void;
  title?: string;
}> = ({ onChange, title }) => {
  const [valor, setValor] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const novoValor = event.target.value;
    setValor(novoValor);
    onChange?.(novoValor);
  };

  return (
    <div>
      <div className="mx-auto items-center "> {title && <p>{title}</p>}</div>
      <div className="flex mx-auto max-w-[50%] items-center space-x-2">
        <TextArea
          id=""
          value={valor}
          onChange={handleChange}
          className="text-center border border-gray-300 rounded"
          rows={2}
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
        <div className="flex mx-auto max-w-[50%] items-center space-x-2">
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
}> = ({ options, onChange, title }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(event.target.value);
  };

  return (
    <div>
      {title && <p>{title}</p>}
      <select
        onChange={handleChange}
        className="p-3 m-2 w-full border-2 border-gray-300 rounded"
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
  onChange?: (valor: string) => void;
  detalhes?: (produtosList: any[]) => void;
  title?: string;
}> = ({ enderecoParam = "", onChange, detalhes, title }) => {
  const [endereco, setEndereco] = useState(enderecoParam);
  const [enderecoError, setEnderecoError] = useState("");
  const [enderecoSucesso, setEnderecoSucesso] = useState("");

  const regexEndereco = /^[A-Za-z0-9]{3,}-[A-Za-z0-9]{3,}-[A-Za-z0-9]{2,}$/;

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
    setEnderecoError("");
    onChange?.(e.target.value);

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
    } else {
      setEndereco(e.target.value);
      setEnderecoSucesso("");
      setEnderecoError("Endereço inválido");
    }
  };

  return (
    <div className="mx-auto mt-4   mb-6 max-w-[50%]">
      {title && <p className="font-bold mb-2">{title}</p>}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <Input
            id="teste"
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
