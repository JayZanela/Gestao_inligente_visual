import React, { useState } from "react";
import {
  InputNumero,
  InputSelect,
  InputTexto,
} from "../../components/layout/FieldsForm";
import { Button } from "../../components/ui/Button";
import { api } from "../../lib/api";

interface parametrosAPINovoProduto {
  nome: string;
  descricao: string;
  tipo_embalagem: string;
  unidade_medida: string;
  nome_modelo: string;
  edicao_modelo: string;
  codigo_barras: string;
}
export const NovoProdutoForm: React.FC = () => {
  // 1) Unidades de Medida (conforme sua CHECK constraint)
  const opcoesUnidadeMedida = [
    { label: "Selecione a unidade de medida", value: "0" },
    { label: "Unidade", value: "UN" },
    { label: "Caixa", value: "CX" },
    { label: "Peça", value: "PC" },
    { label: "Quilograma", value: "KG" },
    { label: "Grama", value: "G" },
    { label: "Litro", value: "L" },
    { label: "Mililitro", value: "ML" },
    { label: "Metro (comprimento)", value: "M" },
    { label: "Centímetro", value: "CM" },
    { label: "Milímetro", value: "MM" },
    { label: "Metro quadrado", value: "MT" },
    { label: "Rolo", value: "ROLO" },
    { label: "Pacote", value: "PCT" },
    { label: "Maço", value: "MÇ" },
  ];

  // 2) Tipos de Embalagem (sugestão enxuta — você pode incluir/remover)
  const opcoesTipoEmbalagem = [
    { label: "Selecione o tipo de embalagem", value: "0" },
    { label: "Caixa", value: "CX" },
    { label: "Pacote", value: "PCT" },
    { label: "Saco", value: "SAC" },
    { label: "Rolo", value: "ROLO" },
    { label: "Envelope", value: "ENV" },
    { label: "Palete", value: "PLT" },
  ];

  const opcoesModelosMotos = [
    { label: "Selecione um modelo", value: "0" },
    { label: "KAY - V1", value: "KAY|1" },
    { label: "Kimbo - V1", value: "Kimbo|1" },
    { label: "Zilla - V1", value: "Zilla|1" },
    { label: "Juna - V1", value: "Juna|1" },
    { label: "Mult - V1", value: "Mult|1" },
    { label: "KAY - V2", value: "KAY|2" },
  ];

  const [isCarregandoTela, setisCarregandoTela] = useState(false);
  const [parametrosNovoProduto, setparametrosNovoProduto] =
    useState<parametrosAPINovoProduto>({
      nome: "",
      descricao: "",
      tipo_embalagem: "",
      unidade_medida: "",
      nome_modelo: "",
      edicao_modelo: "",
      codigo_barras: "",
    });
  const [mensagemNovoProduto, setmensagemNovoProduto] = useState({
    codigo: "NP00",
    mensagem: "",
  });
  const [formKey, setFormKey] = useState(0);

  // Função genérica para atualizar qualquer campo de `parametros`
  const handleParamChange = <K extends keyof parametrosAPINovoProduto>(
    key: K,
    value: parametrosAPINovoProduto[K]
  ) => {
    console.log(value, key);
    setparametrosNovoProduto((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubit = async () => {
    setisCarregandoTela(true);
    await APINovoProduto();
    setisCarregandoTela(false);
    setFormKey((k) => k + 1);
  };

  const fecharMensagem = () => {
    setmensagemNovoProduto({ codigo: "NP00", mensagem: "" });
  };

  const APINovoProduto = async () => {
    try {
      const runNovoProduto = await api.inserirProdutoNovo(
        parametrosNovoProduto
      );

      console.log(runNovoProduto);
      setmensagemNovoProduto({
        codigo: "NP01",
        mensagem: "Novo Produto Inserido no Sistema!",
      });
      setparametrosNovoProduto({
        nome: "",
        descricao: "",
        tipo_embalagem: "",
        unidade_medida: "",
        nome_modelo: "",
        edicao_modelo: "",
        codigo_barras: "",
      });
    } catch (error) {
      const retornoError =
        (await error?.message) || "Erro ao Inserir Produto no Sistema";
      setmensagemNovoProduto({
        codigo: "NP02",
        mensagem: `${retornoError}`,
      });
    }
  };

  return (
    <div key={formKey}>
      {isCarregandoTela && (
        <div
          className="
      fixed inset-0           /* ocupa toda a tela */
      bg-black bg-opacity-50  /* fundo semitransparente */
      flex items-center justify-center  /* centra o conteúdo */
      z-50                    /* fica acima de tudo */
    "
        >
          <div className="bg-gray-400 p-8 rounded-lg shadow-xl text-2xl font-bold">
            Carregando...
          </div>
        </div>
      )}
      {mensagemNovoProduto.codigo !== "NP00" && (
        <div
          className="
      fixed inset-0           /* ocupa toda a tela */
      bg-black bg-opacity-50  /* fundo semitransparente */
      flex items-center justify-center  /* centra o conteúdo */
      z-50                    /* fica acima de tudo */
    "
          onClick={() => fecharMensagem()}
        >
          <div
            className={`${
              mensagemNovoProduto.codigo === "NP02"
                ? "bg-red-300 opacity-90"
                : "bg-green-300"
            } p-8 rounded-lg shadow-xl text-2xl font-bold`}
            onClick={(e) => e.stopPropagation()}
          >
            {mensagemNovoProduto.mensagem}
          </div>
        </div>
      )}
      <div className="gap-6  max-w-[77%] mx-auto text-center">
        <h2 className="p-2 text-3xl font-semibold ">Cadastrar Novo Produto</h2>
        <InputTexto
          title="Nome"
          value={parametrosNovoProduto.nome}
          onChange={(v) => handleParamChange("nome", v)}
        />
        <InputSelect
          options={[...opcoesTipoEmbalagem]}
          title="Tipo de Embalagem"
          onChange={(v) => handleParamChange("tipo_embalagem", v)}
        />
        <InputSelect
          options={[...opcoesUnidadeMedida]}
          title="Unidade de Medida "
          onChange={(v) => handleParamChange("unidade_medida", v)}
        />
        <InputSelect
          options={[...opcoesModelosMotos]}
          title="Modelo (Nome + Edição)"
          onChange={(v) => {
            // v === "Modelo X|1"
            const [nomeModelo, edicaoStr] = v.split("|");
            handleParamChange("nome_modelo", nomeModelo);
            handleParamChange("edicao_modelo", edicaoStr);
          }}
        />
        <InputTexto
          title="Codigo de Barras Importação"
          onChange={(v) => handleParamChange("codigo_barras", v)}
        />
        <InputTexto
          title="Descrição"
          onChange={(v) => handleParamChange("descricao", v)}
        />
        <div className="pt-4">
          <Button
            size="lg"
            type="submit"
            variant="primary"
            fullWidth
            onClick={handleSubit}
          >
            Adicionar Produto
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NovoProdutoForm;
