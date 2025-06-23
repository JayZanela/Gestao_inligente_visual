import React, { useState, useEffect } from "react";
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
import { ArrowDown, ArrowUp, Divide } from "lucide-react";
import { Button } from "../../components/ui/Button";
import EditarProdutoForm from "../produtos/EditarProdutoForm";
import { InputEndereco } from "@/components/layout/FieldsForm";
import { run } from "node:test";
import { useNavigate } from "react-router-dom";

interface OcupacaoDetalhada {
  ocupacao: {
    quantidade: number;
    // … outros campos que vêm em ocupacao …
  };
  runBuscaProdutoUnico: {
    nome: string;
    sku: string;
    // … outros campos que vêm em runBuscaProdutoUnico …
  };
}
interface detalhesLista {
  id_endereco: number;
  isOpen: boolean;
  ocupacoes: OcupacaoDetalhada[];
}

export const ConsultaEndereco: React.FC = () => {
  const navigate = useNavigate();

  const [opcoesPesquisa, setOpcoesPesquisa] = useState([
    { nome: "nome", ativo: true },
    { nome: "sku", ativo: false },
    { nome: "codigo_barras", ativo: false },
    { nome: "descricao", ativo: false },
  ]);
  const [produtosPesquisados, setProdutosPesquisados] = useState([]);
  const [inputPesquisa, setInputPesquisa] = useState("");
  const [listaDetalhes, setListaDetalhes] = useState<detalhesLista[]>([]);
  const [listaFiltrada, setlistaFiltrada] = useState([]);
  const [detalhesOpen, setdetalhesOpen] = useState(false);
  const [ModalQuestion, setModalQuestion] = useState(false);
  const [ProdutoEdicao, setProdutoEdicao] = useState(null);
  const [ModalEdicao, setModalEdicao] = useState(false);
  const [listaCategorias, setlistaCategorias] = useState(null);
  const [listaSubCategorias, setlistaSubCategorias] = useState(null);

  const [listaEnderecos, setlistaEnderecos] = useState([]);
  const [loagrequestEnredeco, setloagrequestEnredeco] = useState(true);
  const [valorEndreco, setvalorEndreco] = useState("");
  const [isOpenCard, setisOpenCard] = useState(false);

  const [desicaoClick, setdesicaoClick] = useState(null);
  const regexEndereco = /^R[A-Za-z0-9]{2,}-C[A-Za-z0-9]{2,}-N[A-Za-z0-9]{1,}$/;

  useEffect(() => {
    if (listaEnderecos.length > 0) return;
    console.log(`EFFECT`);
    const runAPI = async () => {
      await buscarEnderecos();
    };
    runAPI();
  }, [listaEnderecos]);

  const filtrarEnderecos = (param: string) => {
    console.log("LOG FDILTRO", param);
    const filtro = listaEnderecos.filter((e) =>
      e.endereco.endereco.includes(param)
    );
    return setlistaFiltrada(filtro);
  };

  const buscarEnderecos = async () => {
    try {
      const runBuscaEnderecos = await api.buscaTodosEnderecos();
      setlistaEnderecos(runBuscaEnderecos.enderecosDetalhados);
      setlistaFiltrada(runBuscaEnderecos.enderecosDetalhados);
      console.log(`LOG ARRAY`, runBuscaEnderecos.enderecosDetalhados);
      const novosDetalhes = runBuscaEnderecos.enderecosDetalhados.map(
        (endereco) => ({
          id_endereco: endereco.endereco.id,
          isOpen: false,
          ocupacoes: endereco.produtos || [],
        })
      );
      setListaDetalhes(novosDetalhes);

      setloagrequestEnredeco(false);
    } catch (error) {
      console.log(error);
      setlistaEnderecos([]);
    }
  };

  const pesquisaCategorias = async () => {
    try {
      const runBuscaCategorias = await api.buscarCategorias();
      setlistaCategorias(runBuscaCategorias);
      console.log("RUNBUSCA CATEGORIAS", runBuscaCategorias);
    } catch (error) {}
  };

  const pesquisaSubCategorias = async () => {
    try {
      const runBuscaSubCategorias = await api.buscarSubCategorias();
      setlistaSubCategorias(runBuscaSubCategorias);
      console.log("RUNBUSCASUBS", runBuscaSubCategorias);
    } catch (error) {
      console.log(error);
    }
  };

  const atualizarEndereco = (novoEndereco: any) => {
    console.log(novoEndereco);
    setvalorEndreco(novoEndereco);
    filtrarEnderecos(novoEndereco);
  };

  const abrirDetalhes = (index: number) => {
    console.log("INDEX CLICK: ", index);

    const encontrado = listaEnderecos.find(
      (detalhe) => detalhe.endereco.id === index
    );
    if (encontrado) {
      console.log("encontrou algo");
      setListaDetalhes((prev) =>
        prev.map((detalhe) =>
          detalhe.id_endereco === index
            ? { ...detalhe, isOpen: !detalhe.isOpen }
            : detalhe
        )
      );
    } else {
      console.log("Produto não encontrado na lista de detalhes");
    }
  };

  function formatDate(isoString: string): string {
    try {
      const dt = new Date(isoString);
      // Se não for data válida, dt.getTime() é NaN
      if (isNaN(dt.getTime())) {
        throw new Error("Data inválida");
      }
      // Formato curto: 20/06/2025 13:36
      return dt.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short",
      });
    } catch {
      return "—"; // fallback para data inválida
    }
  }

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

  const BipadorEndereco = () => {
    return (
      <div>
        <Card title="" description="">
          <div className="text-center">
            <InputEndereco
              title="Pesquisar Endereço *"
              onValueChange={atualizarEndereco}
              enderecoParam={valorEndreco ? valorEndreco : ""}
            />
            <Button onClick={() => atualizarEndereco(valorEndreco)}>
              Filtrar
            </Button>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="items-center text-center">
      <h2 className="m-4 text-2xl font-semibold">
        Buscar Endereços no Sistema:
      </h2>
      <div className="items-center text-center">
        <BipadorEndereco />
        <Button variant="link" onClick={() => setvalorEndreco("")}>
          Limpar Busca
        </Button>
      </div>
      <div className="p-1 mx-auto">
        <div>
          {loagrequestEnredeco && (
            <div className="font-semibold">
              <p>Carregando Endereços...</p>
            </div>
          )}

          <div className=" max-h-[80vh] overflow-y-auto">
            {listaFiltrada.map((endereco) => (
              <div className="w-100%" key={endereco.endereco.id}>
                {/* Ponto de ancoragem do card */}
                {/* Card suspenso */}
                <Card
                  description=""
                  title=""
                  className="
                flex-grow
       text-start
      left-3 
      mt-2 
      w-100% 
      bg-white 
      shadow-lg 
      rounded-lg 
      p-4 
      transition-transform 
      duration-200 
      transform 
      hover:-translate-y-1 
      hover:shadow-2xl
      z-10
    "
                >
                  <div>
                    {/* conteúdo do card */}
                    <div key={endereco.endereco.id} className="flex">
                      <Button
                        variant="link"
                        onClick={() => abrirDetalhes(endereco.endereco.id)}
                      >
                        {(() => {
                          const detalhe = listaDetalhes.find(
                            (d) => d.id_endereco === endereco.endereco.id
                          );
                          return detalhe?.isOpen ? <ArrowUp /> : <ArrowDown />;
                        })()}
                      </Button>
                    </div>
                    <div className="flex">
                      <div className="font-semibold text-lg">
                        {endereco.endereco.endereco}
                      </div>
                      <div className="mx-auto">
                        Ultimo Movimento:{" "}
                        {endereco.endereco.ultima_movimentacao
                          ? formatDate(endereco.endereco.ultima_movimentacao)
                          : ""}
                      </div>
                      <div className="mx-auto">
                        Materiais Alocados:{" "}
                        {endereco.produtos.length > 0
                          ? endereco.produtos.length
                          : "0"}
                      </div>
                    </div>

                    {/* ... */}
                  </div>
                </Card>
                {(() => {
                  // 1. Encontra o detalhe correspondente
                  const detalhe = listaDetalhes.find(
                    (d) => d.id_endereco === endereco.endereco.id
                  );
                  // 2. Renderiza só se existir e estiver aberto
                  return detalhe && detalhe.isOpen ? (
                    <Card
                      key={detalhe.id_endereco}
                      title=""
                      description=""
                      className="
        flex-grow text-start ml-5 mt-2 w-[90%]
        bg-white shadow-lg rounded-lg p-4
      "
                    >
                      {" "}
                      {detalhe.ocupacoes.length === 0 && (
                        <div className="font-semibold text-center">
                          <p>Sem Produtos</p>
                        </div>
                      )}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mx-auto">
                        {detalhe.ocupacoes.map((ocup) => (
                          <div className="p-2">
                            <Card title="" description="">
                              <div>
                                <p className="font-semibold">
                                  {ocup.runBuscaProdutoUnico.nome} -{" "}
                                  {ocup.runBuscaProdutoUnico.sku}
                                </p>
                                <div className="flex">
                                  <p>Saldo:</p>
                                  <p className="ml-1">
                                    {ocup.ocupacao.quantidade}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-center">
                        <Button
                          variant="link"
                          onClick={() =>
                            navigate("/estoque/movimentacao", {
                              state: { idEndereco: endereco.endereco.endereco },
                            })
                          }
                        >
                          Ação
                        </Button>
                      </div>
                    </Card>
                  ) : null;
                })()}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultaEndereco;
