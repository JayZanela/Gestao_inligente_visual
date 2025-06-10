// API client para comunicação com o backend

// URL base da API
const urlAPI = "https://estoque-inteligente-pearl.vercel.app";

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
  enderecoParam: string | undefined;
}


export interface pesquisaParam {
  colunasParam: string[],
  termoParam: string
} 

export interface movimentacaoLikeParam {
  colunasParam: string[],
  termoParam: string

}

export interface buscaOcupacoesdoProdutoParam {
  produtoId: number,
}


// Funções para comunicação com a API
export const api = {
  // Produtos
  inserirProdutoNovo: async (produto: ProdutoNovo) => {
    try {
      const response = await fetch(`${urlAPI}/api/estoque/inserirProdutoNovo`, {
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
      const response = await fetch(`${urlAPI}/api/estoque/entrada_estoque`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '#'
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
      const response = await fetch(`${urlAPI}/api/estoque/transferencia_estoque`, {
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
      const response = await fetch(`${urlAPI}/api/estoque/saida_estoque`, {
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
    const isEnderecoVazio = !enderecoUnico || Object.values(enderecoUnico).every(value => !value);

    const response = await fetch(`${urlAPI}/api/estoque/executar_busca`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        isEnderecoVazio
          ? { function: 'busca_endereco_unico' }
          : { function: 'busca_endereco_unico', param: enderecoUnico }
      ),
    });

    if (response.status === 415) {
      return { status: 415, error: 'Endereço não existente' };
    }

    if (!response.ok) {
      throw new Error('Erro ao buscar endereço');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro na função buscarEnderecoUnico:', error);
    throw error;
  }
},


      buscarProdutosLike: async (pesquisaParam: pesquisaParam) => {
    try {
      const response = await fetch(`${urlAPI}/api/estoque/executar_busca`, {
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

  buscarMovimentosLike: async (movimentacaoLikeParam: movimentacaoLikeParam) => {
    try {
      const response = await fetch(`${urlAPI}/api/estoque/executar_busca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify( movimentacaoLikeParam.termoParam === "" ? {
        function: 'busca_movimentos_like'
      } : {
        function: 'busca_movimentos_like',
        param: movimentacaoLikeParam,
      } ),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar Moviments');
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao inserir produto:', error);
      throw error;
    }
  },

  buscaOcupacoesDoProduto: async (produtoParam: buscaOcupacoesdoProdutoParam) => {
    try {
      const response = await fetch(`${urlAPI}/api/estoque/executar_busca`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          function: 'busca_ocupacoes_produto', 
          param: produtoParam,
        }),
      })

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao buscar Moviments');
      }
      
      return data;

    }
    catch (error) {
      console.error('Erro ao Buscar Ocupaçoes do Produto:', error);
      throw error;

    }




    return null

  }
};




