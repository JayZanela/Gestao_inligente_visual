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

export const ConsultaProdutos: React.FC = () => {
  const [opcoesPesquisa, setOpcoesPesquisa] = useState([
    { nome: "nome", ativo: true },
    { nome: "sku", ativo: false },
    { nome: "codigo_barras", ativo: false },
    { nome: "descricao", ativo: false },
  ]);
  const [produtosPesquisados, setProdutosPesquisados] = useState([]);

  const pesquisaTextoProduto = async (termo: string) => {
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

  return (
    <div className="items-center text-center">
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
          onChange={() => {}}
        ></Input>
        <Button variant="link">Limpar Busca</Button>
      </div>
    </div>
  );
};

export default ConsultaProdutos;
