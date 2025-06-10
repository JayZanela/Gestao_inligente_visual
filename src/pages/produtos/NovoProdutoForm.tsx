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
  edicao_modelo: number;
  codigo_barras: string;
}
export const NovoProdutoForm: React.FC = () => {
  let opcoesUnidadeMedida = [];
  let opcoesTipoEmbalagem = [];

  const [isCarregandoTela, setisCarregandoTela] = useState(false);
  const [parametrosNovoProduto, setparametrosNovoProduto] =
    useState<parametrosAPINovoProduto>({
      nome: "",
      descricao: "",
      tipo_embalagem: "",
      unidade_medida: "",
      nome_modelo: "",
      edicao_modelo: 0,
      codigo_barras: "",
    });
  const [mensagemNovoProduto, setmensagemNovoProduto] = useState({
    codigo: "NP00",
    mensagem: "",
  });

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
        edicao_modelo: 0,
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
    <div>
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
          title="Nome (Ex: Roda Dianteira)"
          onChange={(v) => handleParamChange("nome", v)}
        />
        <InputTexto
          title="Descrição (Ex: Roda Aro 20 Dianteira)"
          onChange={(v) => handleParamChange("descricao", v)}
        />

        <InputSelect
          options={[
            { label: "Selecione algum tipo de Embalagem", value: "0" },
            ...opcoesTipoEmbalagem,
          ]}
          title="Tipo de Embalagem (Ex: uma caixa com 50 PACOTES de X parafusos )"
          onChange={(v) => handleParamChange("tipo_embalagem", v)}
        />
        <InputSelect
          options={[
            { label: "Selecione uma Unidade", value: "" },
            ...opcoesUnidadeMedida,
          ]}
          title="Unidade de Medida (Ex: 50 UNIDADES -> UN de Pacotes de parafusos"
          onChange={(v) => handleParamChange("unidade_medida", v)}
        />
        <InputSelect
          options={[{ label: "Selecione um Modelo", value: "" }]}
          title="Modelo (Nome + Edição)"
          onChange={(v) => {
            // v === "Modelo X|1"
            const [nomeModelo, edicaoStr] = v.split("|");
            handleParamChange("nome_modelo", nomeModelo);
            handleParamChange("edicao_modelo", Number(edicaoStr));
          }}
        />
        <InputTexto
          title="Codigo de Barras Importação (Caso exista um codigo recebido)"
          onChange={(v) => handleParamChange("codigo_barras", v)}
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
