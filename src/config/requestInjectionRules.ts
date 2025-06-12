// src/config/requestInjectionRules.ts
export interface InjectionRule {
  /** padrão para identificar o endpoint */
  match: string;          
  /** nome do campo que vai ser injetado no body */
  paramKey: string;       
}

export const injectionRules: InjectionRule[] = [
  { match: '/api/estoque/', paramKey: 'montadora_id' },
  // daqui pra frente basta adicionar novas regras aqui...
];
