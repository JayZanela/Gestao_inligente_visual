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
import { Button }from '../../components/ui/Button'

type tiposCadastro = 'Desconhecido'| 'Novo' | 'Existente';

export const CadastroProduto: React.FC = () => {


    const [inputvalor, setInputValor] = useState('');
    const [produtosPesquisados, setProdutosPesquisados] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState({});
    const [isprodutoSelecionado, setisprodutoSelecionado] = useState(false)
    const [enderecosSugestao, setenderecosSugestao ] = useState<any>([]
    );

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
        if (e.target.value.length < 3) return null 
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
            console.log(resultProdutos)
            } 
        catch (error) {
                console.log(error)
            }
    } 
    
    //--------------------
    const buscarOcupacoesDoProduto = async (produto : any) => {
        console.log('cuzans ' + JSON.stringify(produto, null, 2));

        const resultOcups = await api.buscaOcupacoesDoProduto({produtoId: Number(produto.id)});


        return resultOcups
        




    }

    //--------------------  
    const selecionarProduto = async (produto : any) => {
        setProdutoSelecionado(produto);
        setisprodutoSelecionado(true);
        console.log(produto)
        setTipoDoCadastro('Existente');
        const padraoRetorno = [];
        const result = await buscarOcupacoesDoProduto(produto);
        console.log('CUZANS' +  JSON.stringify(result , null, 2))
        if (result.length === 0 ) {
            setenderecosSugestao(padraoRetorno)
        } else {
            setenderecosSugestao(result)
        }
        
    } 

    //---------------------
    const destacarTextoJSX = (texto: string, termo: string) => {
  if (!termo) return texto;

  const partes = texto.split(new RegExp(`(${termo})`, 'gi'));

  return partes.map((parte, i) =>
    parte.toLowerCase() === termo.toLowerCase()
      ? <strong key={i} className="font-bold">{parte}</strong>
      : (parte.toLowerCase() === 'em branco' ? <p key={i} className="text-neutral-400">{parte}</p> : parte )
  );
};

    //------------------
    const ModalRedirecionar = () => {

        return (
            <div>
                <Card title="" description="">
                    <div className="text-center">
                        <h2 className="text-4xl font-semibold m-4">Redirecionando...</h2>

                    </div>
                </Card>
            </div>

        )
    }






    return (
        <div className="">
        
        
        {/*Buscar Produto, no caso vou primeiro buscar ele, se existir, sigo com o existente e so executo a entrada dele.*/}    
        {tipoDoCadastro === "Desconhecido" && (
            <div>
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
                            placeholder="Digite Detalhes do Produto (Min: 3 Digitos)" 
                            value={inputvalor} 
                            onChange={(e) => {
                            handleChange(e);                                
                            }}></Input>
                        </div>

                </div>
            </div>
            <div>        
                <div className="p-2 mx-auto">
                    

                    {inputvalor ? (
                        <Card title="" description="" >
                    <Table>
                            <TableHeader>
                                <TableHead  className="text-center"></TableHead>
                                <TableHead>Nome</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Embalagem</TableHead>
                                <TableHead>Unidade Medida</TableHead>
                                <TableHead>Codigo Barras Importação</TableHead>
                            </TableHeader>
                            <TableBody>
                            {produtosPesquisados.length > 0 ? (produtosPesquisados.map(produto => (

                            <TableRow 
                            onClick={() => {
                                selecionarProduto(produto)
                            }}>
                                <TableCell> <Button className="font-semibold" variant="link">Selecionar</Button> </TableCell>
                                <TableCell> {destacarTextoJSX(produto.nome, inputvalor)} </TableCell>
                                <TableCell> {destacarTextoJSX(produto.descricao, inputvalor)}  </TableCell>
                                <TableCell> {destacarTextoJSX(produto.sku? produto.sku : 'Em Branco', inputvalor)}  </TableCell>
                                <TableCell> {destacarTextoJSX(produto.tipo_embalagem, inputvalor)}  </TableCell>
                                <TableCell> {destacarTextoJSX(produto.unidade_medida, inputvalor)}  </TableCell>
                                <TableCell> {destacarTextoJSX(produto.codigo_barras? produto.codigo_barras : 'Em Branco', inputvalor)}  </TableCell>

                                </TableRow>



                        
                    
                    ))) : (
                        <div className="text-center">
                            <h2>Zero Resultados</h2>
                        </div>
                        
                    )}
                            </TableBody>

                    </Table>

                </Card>
                    ) : (
                        <h2 className="font-semibold text-center">Digite para Apresentar os resultados</h2>
                    )}
                                                                  
                </div>
               
            </div>
                    </div>  

        )}
        {/*Selecionei qual o propduto que eu quieria, basta fazer a entrada*/}
        {tipoDoCadastro === 'Existente' && (
            <div>
                
                <div className="container p-3">
                {enderecosSugestao.length > 0 ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {enderecosSugestao.map((endereco, index) => (
      <Card key={index} title="">
        <div className="flex">
            <div>
            <p className="text-3xl font-bold">
          {endereco.posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque.endereco}
        </p>
        <p className="font-semibold">
          Saldo atual: {endereco.quantidade}
        </p>
            </div>
            <div className="flex text-center mx-auto">
                <Button variant="link" className="border-2">Entrada</Button>
            </div>
        </div>
      </Card>
    ))}
  </div>
        ) : ( isprodutoSelecionado ? (<ModalRedirecionar />) : (null)
            
           
        )}

                </div>

            </div>








        )}




        </div>
    )


}

export default CadastroProduto