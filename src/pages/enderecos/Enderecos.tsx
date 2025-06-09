import React, { useState } from 'react';
import FrameEnderecosNocoDB from './FrameGaleriaEnderecosNocoDB'
import FrameCalendarioEnderecosNocoDB from './FrameCalendarioEnderecosNocoDB'
import { Button} from '@/components/ui/Button'
import {BookImage, CalendarFold }  from 'lucide-react'


type opcoesVisualizacoes = ''|'Galeria de Endereços' | 'Historico dos Endereços';



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
      <div>
        <div className='text-center m-4'>
          <div className='items-center'>
              <h2 className='font-bold'> Acesse alguma funcionalidade:</h2>
            
        <Button variant={opcaoVisualizada === 'Galeria de Endereços' ? 'primary' : 'outline'} onClick={() => (toggleOpcaoVizualizacao('Galeria de Endereços'))} className='ml-3 mr-3 flex items-center'>
          <BookImage/>

              Galeria de Endereços
          </Button>
                    <Button variant={opcaoVisualizada === 'Historico dos Endereços' ? 'primary' : 'outline'} onClick={() => (toggleOpcaoVizualizacao('Historico dos Endereços'))} className='ml-3 mr-3 flex items-center gap-2'>
                      <CalendarFold/>
              Historico dos Endereços
          </Button>

          </div>
          
        </div>
        <div>
          {opcaoVisualizada=== 'Galeria de Endereços' && ( <FrameEnderecosNocoDB />)}
          {opcaoVisualizada=== 'Historico dos Endereços' && ( <FrameCalendarioEnderecosNocoDB />)}
        </div>

      </div>


    )


}

export default Enderecos;