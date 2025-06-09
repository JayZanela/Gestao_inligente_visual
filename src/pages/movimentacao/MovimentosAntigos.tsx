import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import './DropdownCards.css';
import { format, parseISO } from 'date-fns';

import { Button } from '../../components/ui/Button';
import { PackagePlus, ArrowRightLeft, ArrowRightCircle, PackageMinus } from 'lucide-react';

interface paramMovimentosAntigoPrps {
    enderecoBusca: string;
}

interface Movimento {
  id: string | number;
  tipo: string;
  quantidade: number;
  dataMovi: string;
  endereco_de: string;
  endereco_para: string;
}


export const MovimentosAntigos: React.FC<paramMovimentosAntigoPrps> = ({enderecoBusca}) => {

    const [paramBuscaEndereco, setparamBuscaEndereco] = useState(enderecoBusca);
      const [aberto, setAberto] = useState(false);
      const [listaMovimentos, setListaMovimentos] = useState<Movimento[]>([]);
      const [loadingMovimentos, setloadingMovimentos ] = useState(true)
      const [listaFiltradaMovimentos, setlistaFiltradaMovimentos] = useState(listaMovimentos);


    useEffect(() => {
        console.log('effecct lista');
        setparamBuscaEndereco(enderecoBusca);
        requestBuscaDetalhes();



    }, [enderecoBusca])

    useEffect(() => {
      if (enderecoBusca === '') return setlistaFiltradaMovimentos(listaMovimentos);
      const listaFiltrada = [];
      listaMovimentos.map((movimento) => {
        if ( movimento.endereco_de === enderecoBusca || movimento.endereco_para === enderecoBusca) {
          listaFiltrada.push(movimento)
        }
      return setlistaFiltradaMovimentos(listaFiltrada)
      })

    })



    const requestBuscaDetalhes =  async () => {
    try {
      setloadingMovimentos(true);
    const runBuscadetalhes = await api.buscarMovimentosLike( {colunasParam: [],
  termoParam: ''} );

     
    const movimentos = runBuscadetalhes.map((movimento: any) => ({
      id: movimento.id,
      tipo: movimento.tipo,
      quantidade: movimento.quantidade,
      dataMovi: parseISO(movimento.data_hora),
      endereco_de: movimento.ocupacoes_estoque_movimentacoes_ocupacao_origem_idToocupacoes_estoque?.posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque?.endereco || '',
      endereco_para:  movimento.ocupacoes_estoque_movimentacoes_ocupacao_destino_idToocupacoes_estoque?.posicoes_estoque_ocupacoes_estoque_posicao_idToposicoes_estoque?.endereco || '',
    }));

        if (paramBuscaEndereco) {
            movimentos
        }
    setListaMovimentos(movimentos);
    setloadingMovimentos(false);

    } catch (error: any) {
        console.log(error)
    }
        };




    return (
    <div className="dropdown-container max-w-[90%]">
      {loadingMovimentos ? (<div className='font-bold'> Carregando.. </div>) :       <button onClick={() => setAberto(!aberto)} className="dropdown-button font-bold ">
        {aberto ? 'Fechar Historico ▲' : 'Ultimas Movimentações ▼'}
      </button>}


      {aberto && (
        <div className="dropdown-content">




        {listaFiltradaMovimentos.length === 0 && (
          <h3>Sem Movimentos parao Endereço Buscado.</h3>

        )}

          {listaFiltradaMovimentos.map((card) => (
            <div key={card.id} className={'card text-start'}>



                <div className='flex'>
                    <div className='m-2'>                            
        {card.tipo === 'Entrada' && (<PackagePlus size={35} />)}
        {card.tipo === 'Saída' && (<PackageMinus size={35} />)}
        {card.tipo === 'Transferência' && (<ArrowRightLeft size={35} />)}</div>
        <div className='m-3 text-left w-[100px]'>
            <h3 className='font-bold'> {card.tipo}</h3>
        </div>
        <div className='ml-5 w-[40%]'>
            <div>
                <p> Quantidade: {card.quantidade}</p> 
                </div>
            <div>
                <p> Data do movimento: {format(card.dataMovi, 'dd/MM/yyyy HH:mm')}</p> 
                </div>
        </div>

            <div className='ml-4'>
                <div className={`text-gray-600 ${!card.endereco_de ? 'text-red-300' : (card.endereco_de === enderecoBusca && enderecoBusca !== '') ? 'font-bold': ''}`}>
                  DE: {card.endereco_de ? card.endereco_de : 'Não Encontrado.'}
                </div>
                <div className={`text-gray-600 ${!card.endereco_para ? 'text-red-300' : (card.endereco_para === enderecoBusca && enderecoBusca !== '') ? 'font-bold': ''}`}>
                  PARA: {card.endereco_para? card.endereco_para : 'Não Encontrado.   '}
                </div>
            </div>    

                </div>



            


            </div>
        ))}
        </div>
      )}
    </div>
  );


};


export default MovimentosAntigos;