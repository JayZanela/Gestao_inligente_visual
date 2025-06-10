import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import { Search, PlusCircle } from "lucide-react";
import CadastroProduto from "./CadastroProduto";

export const Produtos: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"consulta" | "cadastro">(
    "cadastro"
  );

  return (
    <div className=" mx-auto">
      <h1 className="text-2xl font-bold mb-6">Produtos</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <Button
            variant={activeTab === "cadastro" ? "primary" : "outline"}
            onClick={() => setActiveTab("cadastro")}
            className="flex items-center gap-2"
          >
            <PlusCircle size={18} />
            Cadastro
          </Button>
          <Button
            variant={activeTab === "consulta" ? "primary" : "outline"}
            onClick={() => setActiveTab("consulta")}
            className="flex items-center gap-2"
          >
            <Search size={18} />
            Consulta
          </Button>
        </div>

        {activeTab === "consulta" && (
          <div>
            <p className="text-gray-600 mb-4">
              Consulte os produtos cadastrados no sistema.
            </p>
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <p className="text-gray-500">
                Funcionalidade de consulta em desenvolvimento.
              </p>
            </div>
          </div>
        )}

        {activeTab === "cadastro" && (
          <div>
            <p className="text-gray-600 mb-4">
              Cadastre novos produtos no sistema.
            </p>
            <div className="mt-4">
              <ProdutoCadastro />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ProdutoCadastro: React.FC = () => {
  // Esta parte será implementada em um arquivo separado
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <CadastroProduto />
    </div>
  );
};

export default Produtos;
