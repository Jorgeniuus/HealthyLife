export interface OpcaoAtividade {
    value: string;
    label: string;
    descricao: string;
  }
  
  export const opcoesAtividade: OpcaoAtividade[] = [
    {
      value: 'sedentario',
      label: 'Sedentário:',
      descricao: 'pouco ou nenhum exercício',
    },
    {
      value: 'leve',
      label: 'Levemente ativo:',
      descricao: 'exercício leve 1–3 dias por semana',
    },
    {
      value: 'moderado',
      label: 'Moderadamente ativo:',
      descricao: 'exercício moderado 3–5 dias por semana',
    },
    {
      value: 'ativo',
      label: 'Muito ativo:',
      descricao: 'exercício intenso 6–7 dias por semana',
    },
    {
      value: 'muitoAtivo',
      label: 'Extremamente ativo:',
      descricao: 'treinamento pesado diário ou trabalho físico intenso',
    },
  ];
  