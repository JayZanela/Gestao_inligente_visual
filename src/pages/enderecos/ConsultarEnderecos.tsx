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
import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "../../components/ui/Button";
import EditarProdutoForm from "../produtos/EditarProdutoForm";
import { InputEndereco } from "@/components/layout/FieldsForm";
import { run } from "node:test";

interface detalhesLista {
  id_endereco: number;
  isOpen: boolean;
}

export const ConsultaEndereco: React.FC = () => {
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

  const filtrarEnderecos = () => {
    return listaEnderecos.filter((e) => e);
  };

  const buscarEnderecos = async () => {
    try {
      const runBuscaEnderecos = await api.buscaTodosEnderecos();
      setlistaEnderecos(runBuscaEnderecos.enderecosDetalhados);
      console.log(`LOG ARRAY`, runBuscaEnderecos.enderecosDetalhados);
      const novosDetalhes = runBuscaEnderecos.enderecosDetalhados.map(
        (endereco) => ({
          id_endereco: endereco.endereco.id,
          isOpen: false,
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

  const ValidarDecisao: React.FC<{ produto: any; desicao: any }> = ({
    produto,
    desicao,
  }) => {
    return (
      <div className="fixed inset-0 z-40 flex justify-center items-start  bg-black bg-opacity-70 overflow-y-auto">
        <div className="text-start bg-white mt-11 ml-1 mr-1  rounded-lg shadow-lg p-4 w-full max-w-[100vh] overflow-y-auto">
          <div>
            <Button
              variant="link"
              onClick={() => {
                setModalQuestion(false);
                setProdutoEdicao(null);
                setdesicaoClick("");
              }}
            >
              X
            </Button>
          </div>
          <div>
            Deseja {desicao} o {produto.nome}? Se sim, prossiga clicando em{" "}
            <a
              className="text-green-700"
              onClick={() => {
                setModalQuestion(false);
                setModalEdicao(true);
                setdesicaoClick("");
              }}
            >
              {" "}
              <strong>aqui</strong>
            </a>
          </div>
        </div>
      </div>
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
            <Button>Filtrar</Button>
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
          {listaEnderecos.map((endereco, index) => (
            <React.Fragment key={index}>
              <div className="w-100%">
                {/* Ponto de ancoragem do card */}
                <div className="flex justify-center cursor-pointer"> </div>

                {/* Card suspenso */}
                <Card
                  description=""
                  key={index}
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
                    <div
                      key={index}
                      className="flex"
                      onClick={() => abrirDetalhes(endereco.endereco.id)}
                    >
                      {(() => {
                        const detalhe = listaDetalhes.find(
                          (d) => d.id_endereco === endereco.endereco.id
                        );
                        return detalhe?.isOpen ? <ArrowUp /> : <ArrowDown />;
                      })()}
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
                  const detalhe = listaDetalhes.find(
                    (d) => d.id_endereco === endereco.endereco.id
                  );
                  return detalhe?.isOpen ? (
                    <Card
                      description=""
                      key={index}
                      title=""
                      className="
                flex-grow
       text-start
      ml-5 
      mt-2 
      w-90% 
      bg-white 
      shadow-lg 
      rounded-lg 
      p-4
    "
                    >
                      {" "}
                      tete
                    </Card>
                  ) : null;
                })()}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultaEndereco;
