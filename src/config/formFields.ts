// Configuração dos campos de formulário para parametrização

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'email' | 'password';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  defaultValue?: string | number;
  isModal?: boolean
}

// Campos para o formulário de cadastro de produtos
export const produtoFormFields: FieldConfig[] = [
  {
    id: 'nome',
    label: 'Nome do Produto',
    type: 'text',
    placeholder: 'Digite o nome do produto',
    required: true,
  },
  {
    id: 'descricao',
    label: 'Descrição',
    type: 'textarea',
    placeholder: 'Digite a descrição detalhada do produto',
    required: true,
  },
  {
    id: 'tipo_embalagem',
    label: 'Tipo de Embalagem',
    type: 'select',
    required: true,
    options: [
      { value: 'caixa', label: 'Caixa' },
      { value: 'unidade', label: 'Unidade' },
      { value: 'pacote', label: 'Pacote' },
      { value: 'pallet', label: 'Pallet' },
      { value: 'container', label: 'Container' },
    ],
  },
  {
    id: 'unidade_medida',
    label: 'Unidade de Medida',
    type: 'select',
    required: true,
    options: [
      { value: 'un', label: 'Unidade' },
      { value: 'kg', label: 'Quilograma' },
      { value: 'l', label: 'Litro' },
      { value: 'm', label: 'Metro' },
      { value: 'm2', label: 'Metro Quadrado' },
      { value: 'm3', label: 'Metro Cúbico' },
    ],
  },
  {
    id: 'modelo',
    label: 'Modelo',
    type: 'text',
    placeholder: 'Digite o modelo do produto',
    required: true,
  },
  {
    id: 'codigo_barras',
    label: 'Código de Barras',
    type: 'text',
    placeholder: 'Digite o código de barras (opcional)',
    required: false,
  },
];

// Campos para o formulário de entrada de estoque
export const entradaFormFields: FieldConfig[] = [


  {
    id: 'produto_id',
    label: 'Produto',
    type: 'select',
    placeholder: 'Selecione o produto',
    required: true,
    options: [],
    isModal: true, // Será preenchido dinamicamente
  },
  {
    id: 'quantidade',
    label: 'Quantidade',
    type: 'number',
    placeholder: 'Digite a quantidade',
    required: true,
    min: 1,
  },
  {
    id: 'motivo',
    label: 'Motivo',
    type: 'select',
    required: true,
    options: [
      { value: 'Compra', label: 'Compra' },
      { value: 'devolucao', label: 'Devolução' },
      { value: 'ajuste', label: 'Ajuste de Inventário' },
      { value: 'producao', label: 'Produção' },
    ], 
  },
  {
    id: 'observacoes',
    label: 'Observações',
    type: 'textarea',
    placeholder: 'Observações adicionais (opcional)',
    required: false,
  },
];

// Campos para o formulário de transferência de estoque
export const transferenciaFormFields: FieldConfig[] = [
   {
    id: 'produto_id',
    label: 'Produto',
    type: 'select',
    placeholder: 'Selecione o produto',
    required: true,
    options: [], // Será preenchido dinamicamente
  },

  {
    id: 'quantidade',
    label: 'Quantidade',
    type: 'number',
    placeholder: 'Digite a quantidade',
    required: true,
    min: 1,
  },
  {
    id: 'motivo',
    label: 'Motivo',
    type: 'select',
    required: true,
    options: [
      { value: 'reorganizacao', label: 'Reorganização' },
      { value: 'consolidacao', label: 'Consolidação' },
      { value: 'picking', label: 'Picking' },
      { value: 'outro', label: 'Outro' },
    ],
  },
    {
    id: 'endereco_para',
    label: 'Endereço de Destino',
    type: 'text',
    placeholder: 'Digite o código do endereço de destino',
    required: true,
  },
  {
    id: 'observacoes',
    label: 'Observações',
    type: 'textarea',
    placeholder: 'Observações adicionais (opcional)',
    required: false,
  },
];

// Campos para o formulário de saída de estoque
export const saidaFormFields: FieldConfig[] = [
  {
    id: 'endereco_de',
    label: 'Endereço de Origem',
    type: 'text',
    placeholder: 'Digite o código do endereço',
    required: true,
  },
  {
    id: 'quantidade',
    label: 'Quantidade',
    type: 'number',
    placeholder: 'Digite a quantidade',
    required: true,
    min: 1,
  },
  {
    id: 'produto_id',
    label: 'Produto',
    type: 'select',
    placeholder: 'Selecione o produto',
    required: true,
    options: [], // Será preenchido dinamicamente
  },
  {
    id: 'motivo',
    label: 'Motivo',
    type: 'select',
    required: true,
    options: [
      { value: 'venda', label: 'Venda' },
      { value: 'descarte', label: 'Descarte' },
      { value: 'ajuste', label: 'Ajuste de Inventário' },
      { value: 'consumo', label: 'Consumo Interno' },
    ],
  },
  {
    id: 'observacoes',
    label: 'Observações',
    type: 'textarea',
    placeholder: 'Observações adicionais (opcional)',
    required: false,
  },
];

// Usuários autorizados para login (simulação de banco de dados)
export const authorizedUsers = [
  'admin@estoque.com',
  'usuario@estoque.com',
  'teste@estoque.com',
];

// Configuração das páginas do menu
export interface MenuConfig {
  id: string;
  title: string;
  description: string;
  icon: string;
  subPages?: {
    id: string;
    title: string;
    description: string;
    path: string;
  }[];
}

export const menuConfig: MenuConfig[] = [
  {
    id: 'estoque',
    title: 'Estoque',
    description: 'Gerenciamento de estoque e movimentações',
    icon: 'package',
    subPages: [
      {
        id: 'produtos',
        title: 'Produtos',
        description: 'Consulta e cadastro de produtos',
        path: '/estoque/produtos',
      },
      {
        id: 'movimentacao',
        title: 'Movimentação',
        description: 'Entrada, transferência e saída de produtos',
        path: '/estoque/movimentacao',
      },
      {
        id: 'enderecos',
        title: 'Endereços',
        description: 'Gerenciamento de endereços de estoque',
        path: '/estoque/enderecos',
      },
    ],
  },
  /*{
    id: 'pedidos',
    title: 'Pedidos',
    description: 'Gerenciamento de pedidos de compra e venda',
    icon: 'shopping-cart',
    subPages: [
      {
        id: 'consulta',
        title: 'Consulta',
        description: 'Consulta de pedidos',
        path: '/pedidos/consulta',
      },
    ],
  },
  {
    id: 'agendamentos',
    title: 'Agendamentos',
    description: 'Gerenciamento de agendamentos de entrega e coleta',
    icon: 'calendar',
    subPages: [
      {
        id: 'consulta',
        title: 'Consulta',
        description: 'Consulta de agendamentos',
        path: '/agendamentos/consulta',
      },
    ],
  }*/
];
