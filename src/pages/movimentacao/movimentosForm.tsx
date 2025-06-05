



export interface FieldOption {
  label: string;
  value: string | number;
}

interface MovimentoForm {
    tipo: 'entrada'| 'transferencia' | 'saida';
    enderecoBipado: string;
    produtosOptions: { label: string; value: string }[];
    fields: {  id: string;
        label: string;
        type: 'text' | 'number' | 'select' | 'textarea';
        placeholder?: string;
        required?: boolean;
        options?: FieldOption[]; // Apenas usado quando type === 'select'
        min?: number; // Para campos numéricos
        max?: number;
        isModal?: boolean;
    }


}

export const MovimentosForm: React.FC<MovimentoForm> = ({ tipo, fields, enderecoBipado, produtosOptions }) => {



    return (

        <p>teste</p>



    )


};

export default MovimentosForm;
