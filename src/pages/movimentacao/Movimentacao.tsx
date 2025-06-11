import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { PackagePlus, ArrowRightLeft, PackageMinus } from "lucide-react";
import EntradaForm from "./EntradaForm";
import TransferenciaForm from "./TransferenciaForm";
import MovimentosAntigos from "./MovimentosAntigos";
import SaidaForm from "./SaidaForm";
import { api } from "../../lib/api";

type MovimentoTipo = "entrada" | "transferencia" | "saida" | "" | "todos";
type movimentoOpcoes = "entrada" | "todos" | "nenhum";

type produtosQuantificados = [{ id: number; quantidade: number }];
export const Movimentos: React.FC = () => {
  const [tipoMovimento, setTipoMovimento] = useState<MovimentoTipo>("");
  const [valorDetalhes, setValorDetalhes] = useState<{ any }[]>([]);
  const [opcoesMovimento, setOpcoesMovimento] =
    useState<movimentoOpcoes>("nenhum");
  const [endereco, setEndereco] = useState("");
  const [enderecoError, setEnderecoError] = useState("");
  const [enderecoSucesso, setEnderecoSucesso] = useState("");
  const [produtosOptions, setProdutosOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [listaQuantidades, setListaQuantidades] =
    useState<produtosQuantificados>(null);

  React.useEffect(() => {
    if (valorDetalhes) {
      console.log(valorDetalhes);
    }
  }, [valorDetalhes]);

  const regexEndereco = /^[A-Za-z0-9]{3,}-[A-Za-z0-9]{3,}-[A-Za-z0-9]{2,}$/;

  const toggleTipo = (tipo: MovimentoTipo) => {
    setTipoMovimento((prev) => (prev === tipo ? "" : tipo));
  };

  const verificarExibicao = (tipo: MovimentoTipo): boolean => {
    if (opcoesMovimento === "todos") return true;
    if (opcoesMovimento === "entrada") return tipo === "entrada";
    return false;
  };

  const handleEnderecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnderecoError("");
    setTipoMovimento("");

    if (e.target.value === "") {
      setEnderecoSucesso("");
      setEnderecoError("");
      setEndereco(e.target.value);
      setOpcoesMovimento("nenhum");
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

      const produtosRaw = result.produtos || [];

      const opcoes = produtosRaw.map((p) => {
        const produto = p.runBuscaProdutoUnico;

        return {
          label: `${produto.nome} - ${produto.descricao} `,
          value: produto.id?.toString() ?? "",
        };
      });

      const quantidades = produtosRaw.map((p) => {
        const ocup = p.ocupacao;
        const produto = p.runBuscaProdutoUnico;

        return {
          id: produto.id,
          quantidade: ocup.quantidade,
        };
      });

      setListaQuantidades(quantidades);
      setProdutosOptions(opcoes);
      if (opcoes.length > 0) {
        setOpcoesMovimento("todos");
      } else if (opcoes.length === 0) {
        setOpcoesMovimento("entrada");
      } else {
        setOpcoesMovimento("nenhum");
      }
    } catch (error) {
      setEnderecoError("Erro ao buscar produtos do endereço");
    }
  };
  return (
    <div className="max-w-[100%] mx-auto">
      <h1 className="text-2xl font-bold mb-6">Movimentação</h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mx-auto text-center container">
          <div className="mb-6">
            <h1 className="text-lg font-bold mb-4 ">Bipar Endereço</h1>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  id="endereco_bipar"
                  placeholder="Digite ou bipe o código do endereço"
                  value={endereco}
                  onChange={handleEnderecoChange}
                  autoFocus
                  className="text-lg"
                />
              </div>

              <Button
                variant="primary"
                onClick={() => {
                  handleBiparEndereco(endereco);
                }}
              >
                Confirmar
              </Button>
            </div>

            {enderecoError !== "" && (
              <p className="text-red-400 text-aling-center">{enderecoError}</p>
            )}
            {enderecoSucesso !== "" && (
              <p className="text-green-800 text-aling-center">
                Endereço válido!
              </p>
            )}
          </div>

          {opcoesMovimento !== "nenhum" && (
            <h2 className="text-lg font-medium mb-4">Tipo de Movimento</h2>
          )}

          <div className="mb-6">
            <div className="p-2 flex-wrap">
              {verificarExibicao("entrada") && (
                <Button
                  variant={tipoMovimento === "entrada" ? "primary" : "outline"}
                  onClick={() => toggleTipo("entrada")}
                  className="flex items-center gap-2"
                >
                  <PackagePlus size={tipoMovimento === "entrada" ? 25 : 18} />
                  Entrada
                </Button>
              )}

              {verificarExibicao("transferencia") && (
                <Button
                  variant={
                    tipoMovimento === "transferencia" ? "primary" : "outline"
                  }
                  onClick={() => toggleTipo("transferencia")}
                  className="ml-3 mr-3 flex items-center gap-2"
                >
                  <ArrowRightLeft
                    size={tipoMovimento === "transferencia" ? 25 : 18}
                  />
                  Transferência
                </Button>
              )}

              {verificarExibicao("saida") && (
                <Button
                  variant={tipoMovimento === "saida" ? "primary" : "outline"}
                  onClick={() => toggleTipo("saida")}
                  className="flex items-center gap-2"
                >
                  <PackageMinus size={tipoMovimento === "saida" ? 25 : 18} />
                  Saída
                </Button>
              )}

              {opcoesMovimento !== "nenhum" && tipoMovimento === "" ? (
                <h2 className="mt-2">Selecione alguma função para seguir</h2>
              ) : opcoesMovimento === "nenhum" ? (
                <h2 className="mt-2">Busque por algum endereço existente</h2>
              ) : null}
            </div>
          </div>

          <div className="mt-8">
            {tipoMovimento === "entrada" && (
              <EntradaForm
                enderecoPreenchido={endereco}
                produtosOptions={produtosOptions}
                motivosOptions={produtosOptions}
              />
            )}
            {tipoMovimento === "transferencia" && (
              <TransferenciaForm
                enderecoOrigem={endereco}
                produtosOptions={produtosOptions}
                motivosOptions={produtosOptions}
                quantidadesOptions={listaQuantidades}
              />
            )}
            {tipoMovimento === "saida" && (
              <SaidaForm
                enderecoOrigem={endereco}
                produtosOptions={produtosOptions}
                motivosOptions={produtosOptions}
                quantidadesOptions={listaQuantidades}
              />
            )}
          </div>
          <div>______________</div>
          <div>
            <MovimentosAntigos enderecoBusca={endereco} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movimentos;
