import React, { useState } from 'react';
import FrameEnderecosNocoDB from './FrameGaleriaEnderecosNocoDB'
import FrameCalendarioEnderecosNocoDB from './FrameCalendarioEnderecosNocoDB'
import { Button} from '@/components/ui/Button'
import {BookImage, CalendarFold, MapPinned }  from 'lucide-react'


type opcoesVisualizacoes = ''|'Galeria de Endereços' | 'Historico dos Endereços' | 'Consulta de Endereços';



export const Enderecos: React.FC = () => {

  const [opcaoVisualizada, setOpcaoVisualizada] = useState<opcoesVisualizacoes>('');
  const[loading, setloading] = useState(true);

  const handleloading = () => {
    setloading(false)

  }

  
  const toggleOpcaoVizualizacao = (opcao: opcoesVisualizacoes) => {
    setOpcaoVisualizada(prev => (prev === opcao ? '' : opcao))
  }





    return (
      <div className='mx-auto'>
              <h1 className="text-2xl font-bold mb-6">Movimentação</h1>
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">

              <div className="flex flex-wrap gap-4 mb-6">
          <Button variant={opcaoVisualizada === 'Consulta de Endereços' ? 'primary' : 'outline'} onClick={() => (toggleOpcaoVizualizacao('Consulta de Endereços'))} className='ml-3 mr-3 flex items-center'>
          <MapPinned/>

              Consulta de Endereços
          </Button>
        <Button variant={opcaoVisualizada === 'Galeria de Endereços' ? 'primary' : 'outline'} onClick={() => (toggleOpcaoVizualizacao('Galeria de Endereços'))} className='ml-3 mr-3 flex items-center'>
          <BookImage/>

              Galeria de Endereços
          </Button>
          <Button variant={opcaoVisualizada === 'Historico dos Endereços' ? 'primary' : 'outline'} onClick={() => (toggleOpcaoVizualizacao('Historico dos Endereços'))} className='ml-3 mr-3 flex items-center gap-2'>
                      <CalendarFold/>
              Historico dos Endereços
          </Button>
              </div>


        <div>
          {opcaoVisualizada=== 'Galeria de Endereços' && ( <FrameEnderecosNocoDB />)}
          {opcaoVisualizada=== 'Historico dos Endereços' && ( <FrameCalendarioEnderecosNocoDB />)}
          {opcaoVisualizada=== 'Consulta de Endereços' && ( <p>teste</p> )}
        </div>

      </div>

</div>
    )


}

export default Enderecos;