export interface ActivityOptions {
    value: string;
    label: string;
    description: string;
  }
  
  export const ActivityOptions: ActivityOptions[] = [
    {
      value: 'sedentario',
      label: 'Sedentário:',
      description: 'pouco ou nenhum exercício',
    },
    {
      value: 'leve',
      label: 'Levemente ativo:',
      description: 'exercício leve 1–3 dias por semana',
    },
    {
      value: 'moderado',
      label: 'Moderadamente ativo:',
      description: 'exercício moderado 3–5 dias por semana',
    },
    {
      value: 'ativo',
      label: 'Muito ativo:',
      description: 'exercício intenso 6–7 dias por semana',
    },
    {
      value: 'muitoAtivo',
      label: 'Extremamente ativo:',
      description: 'treinamento pesado diário ou trabalho físico intenso',
    },
  ];
  