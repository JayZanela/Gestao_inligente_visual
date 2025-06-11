import React, { useState } from "react";
import { Input } from "../../components/ui/Input";
import { Card } from "../../components/ui/Card";
import { api } from "../../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/Button";

import EntradaForm from "../movimentacao/EntradaForm";
import { InputEndereco } from "../../components/layout/FieldsForm";
import NovoProdutoForm from "./NovoProdutoForm";

type tiposCadastro = "Desconhecido" | "Novo" | "Existente";

export const CadastroProduto: React.FC = () => {
  type Endereco = {
    quantidade: number;
    posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque: {
      endereco: string;
    };
  };

  type Produto = {
    nome: string;
    descricao: string;
    tipo_embalagem: string;
    // outros campos se necessário
  };

  const [inputvalor, setInputValor] = useState("");
  const [produtosPesquisados, setProdutosPesquisados] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto>(null);
  const [isprodutoSelecionado, setisprodutoSelecionado] = useState(false);
  const [enderecosSugestao, setenderecosSugestao] = useState<any>([]);
  const [enderecoBipado, setEnderecoBipado] = useState(false);
  const [telaEntradaForm, setTelaEntradaForm] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] =
    useState<Endereco>(null);
  const [enderecoValido, setenderecoValido] = useState(false);

  const [tipoDoCadastro, setTipoDoCadastro] =
    useState<tiposCadastro>("Desconhecido");
  const [opcoesPesquisa, setOpcoesPesquisa] = useState([
    { nome: "nome", ativo: true },
    { nome: "sku", ativo: false },
    { nome: "codigo_barras", ativo: false },
  ]);

  const [enderecoinput, setenderecoinput] = useState("");

  //-----------------
  const toggleOpcaoPesquisa = (nomeSelecionado: string) => {
    setOpcoesPesquisa((prev) =>
      prev.map((opcao) =>
        opcao.nome === nomeSelecionado && opcao.nome !== "Nome"
          ? { ...opcao, ativo: !opcao.ativo } // inverte apenas a selecionada
          : opcao
      )
    );
  };

  //---------------------
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setInputValor(e.target.value);
    if (e.target.value.length < 3) return null;
    pesquisaTexto(e.target.value);
  };

  //-----------------------
  const pesquisaTexto = async (termo: string) => {
    try {
      const coluansAtivas = opcoesPesquisa
        .filter((op) => op.ativo)
        .map((op) => op.nome);
      console.log(termo);
      const resultProdutos = await api.buscarProdutosLike({
        colunasParam: coluansAtivas,
        termoParam: termo,
      });

      setProdutosPesquisados(resultProdutos);
      console.log(resultProdutos);
    } catch (error) {
      console.log(error);
    }
  };

  //--------------------
  const buscarOcupacoesDoProduto = async (produto: any) => {
    console.log("cuzans " + JSON.stringify(produto, null, 2));

    const resultOcups = await api.buscaOcupacoesDoProduto({
      produtoId: Number(produto.id),
    });

    return resultOcups;
  };

  //--------------------
  const selecionarProduto = async (produto: Produto) => {
    setProdutoSelecionado(produto);
    setisprodutoSelecionado(true);
    console.log(produto);
    setTipoDoCadastro("Existente");
    const padraoRetorno = [];
    const result = await buscarOcupacoesDoProduto(produto);
    console.log("CUZANS" + JSON.stringify(result, null, 2));
    if (result.length === 0) {
      setenderecosSugestao(padraoRetorno);
    } else {
      setenderecosSugestao(result);
    }
  };

  //---------------------
  const destacarTextoJSX = (texto: string, termo: string) => {
    if (!termo) return texto;

    const partes = texto.split(new RegExp(`(${termo})`, "gi"));

    return partes.map((parte, i) =>
      parte.toLowerCase() === termo.toLowerCase() ? (
        <strong key={i} className="font-bold">
          {parte}
        </strong>
      ) : parte.toLowerCase() === "em branco" ? (
        <p key={i} className="text-neutral-400">
          {parte}
        </p>
      ) : (
        parte
      )
    );
  };

  //------------------
  const definirEndereco = (novoEndereco1: string) => {
    setEnderecoSelecionado({
      quantidade: 0,
      posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque: {
        endereco: novoEndereco1,
      },
    });
  };

  //-------------------
  const atualizarEndereco = (novoEndereco: any) => {
    console.log(novoEndereco);
    setenderecoinput(novoEndereco);
  };

  //------------------
  const BipadorEndereco = () => {
    return (
      <div>
        <Card title="" description="">
          <div className="text-center">
            <InputEndereco
              title="Bipar Endereço Destino *"
              onValueChange={atualizarEndereco}
              isValid={setenderecoValido}
              enderecoParam={enderecoinput ? enderecoinput : ""}
            />
            <Button
              onClick={() => {
                setEnderecoBipado(true);
                definirEndereco(enderecoinput);
              }}
            >
              Acessar entrada do Produto
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  //-------------------
  const handleResetar = () => {
    setTipoDoCadastro("Desconhecido");
    setProdutoSelecionado(null);
    setisprodutoSelecionado(false);
    setenderecosSugestao([]);
    setEnderecoBipado(false);
    setTelaEntradaForm(false);
    setEnderecoSelecionado(null);
    setenderecoinput("");
    setenderecoValido(false);
  };

  //------------------
  const acessarEntradaForm = (endereco: Endereco) => {
    setEnderecoSelecionado(endereco);
    setTelaEntradaForm(true);
  };

  return (
    <div className="">
      {tipoDoCadastro !== "Desconhecido" && (
        <div onClick={handleResetar}>
          <Button variant="link">{"< voltar"}</Button>
        </div>
      )}

      {/*Buscar Produto, no caso vou primeiro buscar ele, se existir, sigo com o existente e so executo a entrada dele.*/}
      {tipoDoCadastro === "Desconhecido" && (
        <div>
          <div className=" p-3">
            <div className="max-w-[100%] grid sm:grid-cols-1 lg:grid-cols-2 ">
              <div className="items-center text-center">
                <div className="items-center text-center">
                  <h2 className="m-4 text-2xl font-semibold">
                    Buscar Produto Existente no Sistema:
                  </h2>
                  <div className="items-center text-center">
                    {opcoesPesquisa.map((opcao) => (
                      <button
                        key={opcao.nome}
                        onClick={() => toggleOpcaoPesquisa(opcao.nome)}
                        className={`m-1 px-2 py-1 rounded border ${
                          opcao.ativo
                            ? "bg-green-900 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                      >
                        {opcao.nome}
                      </button>
                    ))}
                    <Input
                      className="items-center text-center ml-1"
                      id=""
                      placeholder="Digite Detalhes do Produto (Min: 3 Digitos)"
                      value={inputvalor}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    ></Input>
                    <Button variant="link" onClick={() => setInputValor("")}>
                      Limpar Busca
                    </Button>
                  </div>
                </div>
              </div>
              <div className="items-center text-center">
                <h2 className="m-4 text-2xl font-semibold">
                  Adicione um Produto Novo:
                </h2>
                <h2 className="m-4 text-1xl font-semibold">
                  Para cadastrar produtos nao existentes do sistema, acesse
                  abaixo
                </h2>
                <div>
                  <Button
                    className="bg-green-50 text-green-900 border-green-900"
                    variant="outline"
                    onClick={() => setTipoDoCadastro("Novo")}
                  >
                    Novo Produto
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="p-2 mx-auto">
              {inputvalor ? (
                <Card title="" description="">
                  <Table>
                    <TableHeader>
                      <TableHead className="text-center"></TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Embalagem</TableHead>
                      <TableHead>Unidade Medida</TableHead>
                      <TableHead>Codigo Barras Importação</TableHead>
                    </TableHeader>
                    <TableBody>
                      {produtosPesquisados.length > 0 ? (
                        produtosPesquisados.map((produto) => (
                          <TableRow
                            onClick={() => {
                              selecionarProduto(produto);
                            }}
                          >
                            <TableCell>
                              {" "}
                              <Button className="font-semibold" variant="link">
                                Selecionar
                              </Button>{" "}
                            </TableCell>
                            {[
                              produto.nome,
                              produto.descricao,
                              produto.sku,
                              produto.tipo_embalagem,
                              produto.unidade_medida,
                              produto.codigo_barras,
                            ].map((campo, idx) => (
                              <TableCell key={idx}>
                                {destacarTextoJSX(
                                  campo ?? "Em Branco",
                                  inputvalor
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <div className="text-center">
                          <h2>Zero Resultados</h2>
                        </div>
                      )}
                    </TableBody>
                  </Table>
                </Card>
              ) : (
                <div>
                  <h2 className="font-semibold text-center">
                    Pesquise o produto
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/*Selecionei qual o propduto que eu quieria, basta fazer a entrada*/}
      {tipoDoCadastro === "Existente" && (
        <div>
          <div className="mx-auto p-1">
            {telaEntradaForm && (
              <div className="text-center">
                <div className="m-1 text-1xl font-semibold">
                  <p className="text-2xl">Endereço:</p>
                  <p className="text-3xl">
                    {
                      enderecoSelecionado
                        .posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque
                        .endereco
                    }
                  </p>
                  <p className="">
                    Saldo: {enderecoSelecionado.quantidade}{" "}
                    {produtoSelecionado.tipo_embalagem} (s)
                  </p>
                </div>

                <EntradaForm
                  enderecoPreenchido={
                    enderecoSelecionado
                      .posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque
                      .endereco
                  }
                  produtosOptions={[
                    {
                      label:
                        String(produtoSelecionado.nome) +
                        " - " +
                        String(produtoSelecionado.descricao),
                      value: "1",
                    },
                  ]}
                  motivosOptions={[]}
                />
              </div>
            )}
            {!telaEntradaForm && (
              <div className="">
                <div onClick={() => setenderecosSugestao([])}>
                  <Button
                    className="fluid place-items-end"
                    variant="link"
                    disabled={enderecosSugestao.length === 0}
                  >
                    {"Novo Endereço >"}
                  </Button>
                </div>
                {enderecosSugestao.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 sm:gap-4 lg:gap-4 sm:p-5 lg:p-4">
                    {enderecosSugestao.map((endereco, index) => (
                      <Card key={index} title="" description="" className="m-1">
                        <div
                          className="flex text-sm
                sm:text-base 
                md:text-lg    lg:text-xl    
                xl:text-2xl
                "
                        >
                          <div className="flex-grow flex-shrink">
                            <p className="font-bold">
                              {
                                endereco
                                  .posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque
                                  .endereco
                              }
                            </p>
                            <p className="">
                              Saldo atual: {endereco.quantidade}
                            </p>
                          </div>
                          <div className="flex-grow flex-shrink text-center mx-auto">
                            <Button
                              variant="link"
                              className="border-2 flex-grow flex-shrink"
                              onClick={() => {
                                acessarEntradaForm(endereco);
                              }}
                            >
                              Entrada do Produto
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : isprodutoSelecionado ? (
                  <div className="text-center">
                    <BipadorEndereco />
                  </div>
                ) : null}
                {enderecoBipado && (
                  <div className="text-center">
                    <EntradaForm
                      enderecoPreenchido={
                        enderecoSelecionado
                          .posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque
                          .endereco
                      }
                      produtosOptions={[
                        {
                          label:
                            String(produtoSelecionado.nome) +
                            " - " +
                            String(produtoSelecionado.descricao),
                          value: "1",
                        },
                      ]}
                      motivosOptions={[]}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {tipoDoCadastro === "Novo" && (
        <div>
          <div className="mx-auto p-3">
            <NovoProdutoForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default CadastroProduto;
