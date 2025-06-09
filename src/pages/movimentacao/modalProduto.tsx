import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { api } from '../../lib/api';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
    onSelectProduto: (produto: any) => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, onSelectProduto }) => {
     const [textoPesquisa, setTextoPesquisa] = useState(''); 
        const [opcoesPesquisa, setOpcoesPesquisa] = useState([
  { nome: "nome", ativo: true },
  { nome: "sku", ativo: false },
  { nome: "codigo_barras", ativo: false },
]);
const [erroPesquisa, setErroPesquisa] = useState('');
const [produtosPesquisa, setProdutosPesquisa] = useState<any[]>([]);

  
    if (!isOpen) return null;

    const toggleOpcaoPesquisa = (nomeSelecionado: string) => {
  setOpcoesPesquisa(prev =>
    prev.map(opcao =>
      opcao.nome === nomeSelecionado && opcao.nome !== "Nome"
        ? { ...opcao, ativo: !opcao.ativo } // inverte apenas a selecionada
        : opcao
    )
  );
};

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setTextoPesquisa(e.target.value)

        pesquisaTexto(e.target.value)
            setErroPesquisa('');
  };

    const pesquisaTexto = async (termo: string) => {
        try {

            const coluansAtivas = opcoesPesquisa.filter(op => op.ativo).map(op => op.nome);
            console.log(termo)
    const resultProdutos = await api.buscarProdutosLike(  {colunasParam: coluansAtivas,
  termoParam: termo});
    
    setProdutosPesquisa(resultProdutos);


    } catch (error: any) {
        setErroPesquisa(error.message)
    }
} 



  return (
<div className="fixed inset-0 z-40 flex items-start justify-center bg-black bg-opacity-70 overflow-y-auto">

    
      <div className="text-start bg-white mt-10  rounded-lg shadow-lg p-4 w-full max-w-3xl max-w-[100vh] overflow-y-auto">
         <a
          
          className="font-bold pb-4 hover:underline text-green-900 cursor-pointer"
          onClick={onClose}
        >
          X
        </a>
        <h2 className="text-lg text-start font-medium mb-4">Buscar Produto</h2>
    {opcoesPesquisa.map(opcao => (
  <button
    key={opcao.nome}
    onClick={() => toggleOpcaoPesquisa(opcao.nome)}
    className={`m-1 px-3 py-1 rounded border ${
      opcao.ativo ? 'bg-green-900 text-white' : 'bg-gray-200 text-black'
    }`}
  >
    {opcao.nome}
  </button>
))}
        <div className="flex flex-col md:flex-row gap-2 mb-6">
          <div className="flex-grow">
            <Input
              id="endereco_bipar"
              placeholder="Digite ou bipe o código do endereço"
              value={textoPesquisa}
              autoFocus
              onChange={(e) => handleChange(e)}
              className="text-lg"
            />
          </div>
        </div>
        <div>
        {erroPesquisa && (
            <div>
                <p>{erroPesquisa}</p>
            </div>
        )}

        </div>
        <div className="space-y-2">
            
          {produtosPesquisa.map((produto) => (
            
            <Card
              key={produto.id}
              title={`${produto.nome}`}
              description={`Descrição: ${produto.descricao}` }
              onClick={() => {
                onSelectProduto(produto);
                onClose();}}
            >
                 <div className="flex justify-between items-center">
    <div>
      <p className="text-sm text-gray-700 mb-2">Código: {produto.sku || "*Sem Código"}  </p>
                <p className="text-sm text-gray-600">Tipo Embalagem: {produto.tipo_embalagem} </p>
    </div>
    </div>
            </Card>
          ))
          }
        </div>
      </div>
    </div>
  );
};

export default Modal;
 