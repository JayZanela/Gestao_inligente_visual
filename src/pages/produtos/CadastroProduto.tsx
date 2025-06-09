import React, {useState} from "react"
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { api } from '../../lib/api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";


type tiposCadastro = 'Desconhecido'| 'Novo' | 'Existente';

export const CadastroProduto: React.FC = () => {


    const [inputvalor, setInputValor] = useState('');
    const [produtosPesquisados, setProdutosPesquisados] = useState([]);

    const [tipoDoCadastro, setTipoDoCadastro] = useState<tiposCadastro>('Desconhecido');
    const [opcoesPesquisa, setOpcoesPesquisa] = useState([
      { nome: "nome", ativo: true },
      { nome: "sku", ativo: false },
      { nome: "codigo_barras", ativo: false },
    ]);
    


   //----------------- 
   const toggleOpcaoPesquisa = (nomeSelecionado: string) => {
      setOpcoesPesquisa(prev =>
        prev.map(opcao =>
          opcao.nome === nomeSelecionado && opcao.nome !== "Nome"
            ? { ...opcao, ativo: !opcao.ativo } // inverte apenas a selecionada
            : opcao
        )
      );
    };


    //---------------------
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setInputValor(e.target.value)
        pesquisaTexto(e.target.value)
    };

    //-----------------------
    const pesquisaTexto = async (termo: string) => {
        try {

            const coluansAtivas = opcoesPesquisa.filter(op => op.ativo).map(op => op.nome);
                console.log(termo)
            const resultProdutos = await api.buscarProdutosLike(  {colunasParam: coluansAtivas,
                termoParam: termo});
    
            setProdutosPesquisados(resultProdutos);
            } 
        catch (error) {
                console.log(error)
            }
    } 
    








    return (
        <div>
        {tipoDoCadastro === "Desconhecido" && (
            <div className="container p-3">
                <div className="max-w-[100%]">
                    <div className="">
                        <h2 className="m-4 text-2xl">Buscar Produto Existente no Sistema:</h2>

                        
                    </div>
                    <div className="ms-5 max-w-[60%]">
                            {opcoesPesquisa.map(opcao => (
                                <button
                                    key={opcao.nome}
                                    onClick={() => toggleOpcaoPesquisa(opcao.nome)}
                                    className={`m-1 px-2 py-1 rounded border ${
                                      opcao.ativo ? 'bg-green-900 text-white' : 'bg-gray-200 text-black'
                                    }`}
                                  >
                                    {opcao.nome}
                                </button>
                            ))}
                            <Input 
                            className="ml-1"
                            id='' 
                            placeholder="Digite Detalhes do Produto" 
                            value={inputvalor} 
                            onChange={(e) => {
                            handleChange(e);                                
                            }}></Input>
                        </div>

                </div>    
                <div className="p-2">
                <Card>
                    <Table>
                            <TableHeader>
                                <TableHead>Nome</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Embalagem</TableHead>
                                <TableHead>Unidade Medida</TableHead>
                                <TableHead>Codigo Barras Importação</TableHead>
                            </TableHeader>
                            <TableBody>
                                                {produtosPesquisados.map(produto => (

                            <TableRow>
                                <TableCell> {produto.nome} </TableCell>
                                <TableCell> {produto.nome} </TableCell>
                                <TableCell> {produto.nome} </TableCell>
                                <TableCell> {produto.nome} </TableCell>
                                                    
                                </TableRow>



                        
                    ))}
                            </TableBody>

                    </Table>

                </Card>                                                  
                </div>
               
            </div>


        )}
        </div>
    )


}

export default CadastroProduto