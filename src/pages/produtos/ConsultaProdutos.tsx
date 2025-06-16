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
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../../components/ui/Button";

interface detalhesLista {
  id_produto: number;
  isOpen: boolean;
}

export const ConsultaProdutos: React.FC = () => {
  const [opcoesPesquisa, setOpcoesPesquisa] = useState([
    { nome: "nome", ativo: true },
    { nome: "sku", ativo: false },
    { nome: "codigo_barras", ativo: false },
    { nome: "descricao", ativo: false },
  ]);
  const [produtosPesquisados, setProdutosPesquisados] = useState([]);
  const [inputPesquisa, setInputPesquisa] = useState("");
  const [listaDetalhes, setListaDetalhes] = useState<detalhesLista[]>(null);
  const [detalhesOpen, setdetalhesOpen] = useState(false);
  const [ModalQuestion, setModalQuestion] = useState(false);
  const [ProdutoEdicao, setProdutoEdicao] = useState(null);

  const [desicaoClick, setdesicaoClick] = useState(null);
  const pesquisaTextoProduto = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const termo = e.target.value;
    if (termo.length < 3) {
      setInputPesquisa(termo);
      return;
    } else {
      setInputPesquisa(termo);
    }

    try {
      const coluansAtivas = opcoesPesquisa
        .filter((op) => op.ativo)
        .map((op) => op.nome);
      console.log(termo);
      const resultProdutos = await api.buscarProdutosLike({
        colunasParam: coluansAtivas,
        termoParam: termo,
      });

      const novosDetalhes = resultProdutos.map((produto) => ({
        id_produto: produto.id,
        isOpen: false,
      }));
      setListaDetalhes(novosDetalhes);

      setProdutosPesquisados(resultProdutos);
      console.log(resultProdutos);
    } catch (error) {
      console.log(error);
    }
  };

  const abrirDetalhes = (index: number) => {
    console.log("INDEX CLICK: ", index);

    const encontrado = listaDetalhes.find(
      (detalhe) => detalhe.id_produto === index
    );
    if (encontrado) {
      console.log("encontrou algo");
      setListaDetalhes((prev) =>
        prev.map((detalhe) =>
          detalhe.id_produto === index
            ? { ...detalhe, isOpen: !detalhe.isOpen }
            : detalhe
        )
      );
    } else {
      console.log("Produto não encontrado na lista de detalhes");
    }
  };

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

  const ValidarDecisao: React.FC<{ produto: any; desicao: any }> = ({
    produto,
    desicao,
  }) => (
    <div className="fixed inset-0 z-40 flex justify-center items-start  bg-black bg-opacity-70 overflow-y-auto">
      <div className="text-start bg-white mt-10  rounded-lg shadow-lg p-4 w-full max-w-3xl max-w-[100vh] overflow-y-auto">
        <div>
          <a
            href=""
            onClick={() => {
              setModalQuestion(false);
              setProdutoEdicao(null);
              setdesicaoClick("");
            }}
          >
            X
          </a>
        </div>
        <div>
          Deseja {desicao} o {produto.nome}? Se sim, prossiga clicando em{" "}
          <a href="" className="text-green-700">
            {" "}
            <strong>aqui</strong>
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <div className="items-center text-center">
      {ModalQuestion && (
        <ValidarDecisao produto={ProdutoEdicao} desicao={desicaoClick} />
      )}
      <h2 className="m-4 text-2xl font-semibold">Buscar Produto no Sistema:</h2>
      <div className="items-center text-center">
        {opcoesPesquisa.map((opcao) => (
          <button
            key={opcao.nome}
            onClick={() => opcao.nome}
            className={`m-1 px-2 py-1 rounded border ${
              opcao.ativo ? "bg-green-900 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {opcao.nome}
          </button>
        ))}
        <Input
          className="items-center text-center ml-1"
          id=""
          placeholder="Digite Detalhes do Produto (Min: 3 Digitos)"
          onChange={(e) => pesquisaTextoProduto(e)}
          value={inputPesquisa}
        ></Input>
        <Button variant="link">Limpar Busca</Button>
      </div>
      <div className="p-1 mx-auto">
        {inputPesquisa ? (
          <Card title="" description="">
            <Table>
              <TableHeader>
                <TableHead className="text-center"></TableHead>
                <TableHead className="text-center">Nome</TableHead>
                <TableHead className="text-center">Descrição</TableHead>
                <TableHead className="text-center">SKU</TableHead>
                <TableHead className="text-center">Embalagem</TableHead>
                <TableHead className="text-center">Unidade Medida</TableHead>
                <TableHead className="text-center">
                  Codigo Barras Importação
                </TableHead>
              </TableHeader>
              <TableBody>
                {produtosPesquisados.length > 0 ? (
                  produtosPesquisados.map((produto, index) => (
                    <React.Fragment key={index}>
                      {/* Primeira linha (dados principais) */}
                      <TableRow>
                        <TableCell>
                          <Button
                            className="font-semibold"
                            variant="link"
                            onClick={() => abrirDetalhes(produto.id)}
                          >
                            {(() => {
                              const detalhe = listaDetalhes.find(
                                (d) => d.id_produto === produto.id
                              );
                              return detalhe?.isOpen ? (
                                <ArrowUp />
                              ) : (
                                <ArrowDown />
                              );
                            })()}
                          </Button>
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
                              inputPesquisa
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Segunda linha (detalhes adicionais) */}
                      {listaDetalhes.find(
                        (d) => d.id_produto === produto.id && d.isOpen
                      ) && (
                        <TableRow>
                          <TableCell align="left" colSpan={7}>
                            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                              {/* Coluna 1 */}
                              <div className="space-y-1.5 ">
                                <p>
                                  <strong>ID:</strong> {produto.id}
                                </p>
                                <p>
                                  <strong>Nome:</strong>{" "}
                                  {produto.nome ?? "Em Branco"}
                                </p>
                                <p>
                                  <strong>Descrição:</strong>{" "}
                                  {produto.descricao ?? "Em Branco"}
                                </p>
                                <p>
                                  <strong>SKU:</strong>{" "}
                                  {produto.sku ?? "Em Branco"}
                                </p>
                              </div>

                              {/* Coluna 2 */}
                              <div className="space-y-1.0 mx-auto">
                                <p>
                                  <strong>Embalagem:</strong>{" "}
                                  {produto.tipo_embalagem ?? "Em Branco"}
                                </p>
                                <p>
                                  <strong>Unidade Medida:</strong>{" "}
                                  {produto.unidade_medida ?? "Em Branco"}
                                </p>
                                <p>
                                  <strong>Código de Barras:</strong>{" "}
                                  {produto.codigo_barras ?? "Em Branco"}
                                </p>
                                <p>
                                  <strong>Cadastrado em:</strong>{" "}
                                  {produto.data_cadastro}
                                </p>
                                <p>
                                  <strong>Observações:</strong>{" "}
                                  {produto.observacoes ?? "Nenhuma"}
                                </p>
                              </div>
                            </div>
                            <div className="gap-3">
                              <Button
                                variant="link"
                                onClick={() => {
                                  setModalQuestion(true);
                                  setProdutoEdicao(produto);
                                  setdesicaoClick("Editar");
                                }}
                              >
                                Editar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
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
            <h2 className="font-semibold text-center">Pesquise o produto</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultaProdutos;
