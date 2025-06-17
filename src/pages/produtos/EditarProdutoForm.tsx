import React, { useEffect, useState } from "react";
import {
  InputNumero,
  InputSelect,
  InputTexto,
} from "../../components/layout/FieldsForm";
import { Button } from "../../components/ui/Button";
import { api } from "../../lib/api";

interface parametrosAPIEditarProduto {
  id?: number;
  nome: string;
  sku?: string;
  descricao: string;
  status?: string;
  tipo_embalagem: string;
  unidade_medida: string;
  codigo_barras: string;
  estoque_minimo: number;
  estoque_maximo: number;
  tempo_reposição: number;
  ponto_reposicao: number;
  categoria_id: number;
  subCategoria_id: number;
  imagem: BinaryType;
}

interface dadosCategorias {
  id: number;
  nome: string;
  descricao: string;
  codigo: string;
}

interface dadosSubCategorias {
  id: number;
  categoria_id: number;
  nome: string;
  descricao: string;
  codigo: string;
}

interface listaSelect {
  label: string;
  value: string;
}

interface editaFormProps {
  onClose: () => void;
  categorias: dadosCategorias[];
  subCategorias: dadosSubCategorias[];
  dadosProduto: parametrosAPIEditarProduto;
  onSave: () => void;
  listaSelect: listaSelect[];
}
export const EditarProdutoForm: React.FC<editaFormProps> = ({
  onClose,
  dadosProduto,
  categorias,
  subCategorias,
  onSave,
}) => {
  console.log("parametrosFORM", dadosProduto);
  console.log(categorias);
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

  const [isCarregandoTela, setisCarregandoTela] = useState(false);
  const [parametrosEditarProduto, setparametrosEditarProduto] =
    useState<parametrosAPIEditarProduto>({
      id: dadosProduto.id ?? 0,
      nome: dadosProduto.nome ?? "",
      sku: dadosProduto.sku ?? "",
      descricao: dadosProduto.descricao ?? "",
      status: dadosProduto.status ?? "",
      tipo_embalagem: dadosProduto.tipo_embalagem ?? "",
      unidade_medida: dadosProduto.unidade_medida ?? "",
      codigo_barras: dadosProduto.codigo_barras ?? "",
      estoque_minimo: dadosProduto.estoque_minimo ?? 0,
      estoque_maximo: dadosProduto.estoque_maximo ?? 0,
      tempo_reposição: dadosProduto.tempo_reposição ?? 0,
      ponto_reposicao: dadosProduto.ponto_reposicao ?? 0,
      categoria_id: dadosProduto.categoria_id ?? 0,
      subCategoria_id: dadosProduto.subCategoria_id ?? 0,
      imagem: dadosProduto.imagem ?? null,
    });
  const [listaCategorias, setlistaCategorias] = useState<listaSelect[]>([]);
  const [listaSubCategorias, setlistaSubCategorias] = useState<listaSelect[]>(
    []
  );
  const [mensagemEditaProduto, setmensagemEditaProduto] = useState({
    codigo: "EP00",
    mensagem: "",
  });

  useEffect(() => {
    if (categorias) {
      const listaFormatada = categorias.map((c) => {
        return { label: c.nome, value: c.id.toString() };
      });
      setlistaCategorias(listaFormatada);
      console.log("LOGEFECT CATEGORIAS", listaFormatada);
    }
  }, [categorias]);

  useEffect(() => {
    if (subCategorias) {
      const listaFormatada = subCategorias.map((c) => {
        return { label: c.nome, value: c.id.toString() };
      });
      setlistaSubCategorias(listaFormatada);
    }
  }, [subCategorias]);
  // Função genérica para atualizar qualquer campo de `parametros`
  const handleParamChange = <K extends keyof parametrosAPIEditarProduto>(
    key: K,
    value: parametrosAPIEditarProduto[K]
  ) => {
    console.log(value, key);
    setparametrosEditarProduto((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubit = async () => {
    setisCarregandoTela(true);

    try {
      // 1) Chama a API
      await APIEditaProduto();

      // 2) Esconde o loading e mostra a mensagem

      setisCarregandoTela(false);

      // 3) Aguarda 5 segundos antes de fechar/salvar
      setTimeout(() => {
        onSave(); // notifica o pai pra salvar os dados atualizados
        // fecha o modal/form // oculta a mensagem
      }, 5000);
    } catch (error) {
      // em caso de erro, também exibe a mensagem de erro por 5 s
      setisCarregandoTela(false);
      setmensagemEditaProduto({ codigo: "EP00", mensagem: error });
      console.error(error);

      setTimeout(() => {
        setmensagemEditaProduto({ codigo: "EP00", mensagem: error });
      }, 5000);
    }
  };

  const fecharMensagem = () => {
    setmensagemEditaProduto({ codigo: "EP00", mensagem: "" });
  };

  const APIEditaProduto = async () => {
    try {
      console.log(`ParamAtualiza`, {
        param: parametrosEditarProduto,
      });
      const runNovoProduto = await api.inserirProdutoEditado({
        param: parametrosEditarProduto,
      });

      console.log(runNovoProduto);
      setmensagemEditaProduto({
        codigo: "EP01",
        mensagem: "Edição de Produto Inserido no Sistema!",
      });
    } catch (error) {
      const retornoError =
        (await error?.message) || "Erro ao Editar Produto no Sistema";
      setmensagemEditaProduto({
        codigo: "EP02",
        mensagem: `${retornoError}`,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-center items-start  bg-black bg-opacity-70 overflow-y-auto">
      <div className="text-start bg-white mt-11 ml-1 mr-1  rounded-lg shadow-lg p-4 w-full max-w-[100vh] overflow-y-auto">
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
        {mensagemEditaProduto.codigo !== "EP00" && (
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
                mensagemEditaProduto.codigo === "EP02"
                  ? "bg-red-300 opacity-90"
                  : "bg-green-300"
              } p-8 rounded-lg shadow-xl text-2xl font-bold`}
              onClick={(e) => e.stopPropagation()}
            >
              {mensagemEditaProduto.mensagem}
            </div>
          </div>
        )}
        <div className="gap-6  max-w-[77%] mx-auto text-center">
          <h2 className="p-2 text-3xl font-semibold ">Editar Produto</h2>
          <h2 className="p-2 text-1xl ">
            Codigo Unico do Produto: {parametrosEditarProduto.sku}
          </h2>
          <h2 className="p-2 text-1xl ">
            Situação do Cadastro: {parametrosEditarProduto.status}
          </h2>
          <InputTexto
            title="Nome"
            value={parametrosEditarProduto.nome}
            disabled={true}
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
          <InputTexto
            title="Codigo de Barras Importação"
            onChange={(v) => handleParamChange("codigo_barras", v)}
          />
          <InputTexto
            title="Descrição"
            onChange={(v) => handleParamChange("descricao", v)}
          />
          {/* Número: Estoque Mínimo */}
          <InputNumero
            valorInicial={parametrosEditarProduto.estoque_minimo}
            title="Estoque Mínimo"
            onChange={(v) => handleParamChange("estoque_minimo", v)}
          />

          {/* Número: Estoque Máximo */}
          <InputNumero
            valorInicial={parametrosEditarProduto.estoque_maximo}
            title="Estoque Máximo"
            onChange={(v) => handleParamChange("estoque_maximo", v)}
          />

          {/* Número: Tempo de Reposição (dias) */}
          <InputNumero
            valorInicial={parametrosEditarProduto.tempo_reposição}
            title="Tempo de Reposição (dias)"
            onChange={(v) => handleParamChange("tempo_reposição", v)}
          />

          {/* Número: Ponto de Reposição */}
          <InputNumero
            valorInicial={parametrosEditarProduto.ponto_reposicao}
            title="Ponto de Reposição"
            onChange={(v) => handleParamChange("ponto_reposicao", v)}
          />

          {/* Select: Categoria */}
          <InputSelect
            title="Categoria"
            options={listaCategorias}
            onChange={(v) => handleParamChange("categoria_id", Number(v))}
          />

          {/* Select: Subcategoria */}
          <InputSelect
            title="Subcategoria"
            options={listaSubCategorias}
            onChange={(v) => handleParamChange("subCategoria_id", Number(v))}
          />

          {/* File: Imagem do Produto */}
          <div className="my-4 text-left">
            <label className="block mb-1">Imagem do Produto</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleParamChange("imagem", e.target.files?.[0] as any)
              }
            />
          </div>
          <div className="flex justify-end pt-4 ">
            <div className=" p-1 ">
              <Button
                size="lg"
                type="submit"
                variant="secondary"
                fullWidth
                onClick={onClose}
              >
                Cancelar
              </Button>
            </div>
            <div className=" p-1 ">
              {" "}
              <Button
                size="lg"
                type="submit"
                variant="primary"
                fullWidth
                onClick={handleSubit}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarProdutoForm;
