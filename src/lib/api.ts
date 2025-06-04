// API client para comunicação com o backend

// URL base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Interfaces para os tipos de dados
export interface ProdutoNovo {
  nome: string;
  descricao: string;
  tipo_embalagem: string;
  unidade_medida: string;
  modelo: string;
  codigo_barras?: string;
}

export interface EntradaEstoque {
  param: {
    endereco: string;
    quantidade: number;
    responsavel_id: number;
    motivo: string;
    observacoes?: string;
    produto_id: number;
  }
}

export interface TransferenciaEstoque {
  param: {
    endereco_de: string;
    endereco_para: string;
    quantidade: number;
    responsavel_id: number;
    motivo: string;
    observacoes?: string;
    produto_id: number;
  }
}

export interface SaidaEstoque {
  param: {
    endereco_de: string;
    quantidade: number;
    responsavel_id: number;
    motivo: string;
    observacoes?: string;
    produto_id: number;
  }
}

export interface EnderecoUnico {
  enderecoParam: string;
}


export interface pesquisaParam {
  colunasParam: string[],
  termoParam: string
} 
// Funções para comunicação com a API
export const api = {
  // Produtos
  inserirProdutoNovo: async (produto: ProdutoNovo) => {
    try {
      const response = await fetch(`/api/estoque/inserirProdutoNovo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao inserir produto');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao inserir produto:', error);
      throw error;
    }
  },
  
  // Movimentações
  executarEntrada: async (entrada: EntradaEstoque) => {
    try {
      const response = await fetch(`/api/estoque/executar_entrada`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entrada),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar entrada');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao executar entrada:', error);
      throw error;
    }
  },
  
  executarTransferencia: async (transferencia: TransferenciaEstoque) => {
    try {
      const response = await fetch(`/api/estoque/executar_transferencia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transferencia),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar transferência');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao executar transferência:', error);
      throw error;
    }
  },
  
  executarSaida: async (saida: SaidaEstoque) => {
    try {
      const response = await fetch(`/api/estoque/executar_saida`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saida),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao executar saída');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao executar saída:', error);
      throw error;
    }
  },

    buscarEnderecoUnico: async (enderecoUnico: EnderecoUnico) => {
    try {
      const response = await fetch(`/api/estoque/executar_busca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        function: 'busca_endereco_unico',
        param: enderecoUnico,
      }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao inserir produto');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao inserir produto:', error);
      throw error;
    }
  },


      buscarProdutosLike: async (pesquisaParam: pesquisaParam) => {
    try {
      const response = await fetch(`/api/estoque/executar_busca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        function: 'busca_produto_like',
        param: pesquisaParam,
      }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao inserir produto');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao inserir produto:', error);
      throw error;
    }
  },
};
