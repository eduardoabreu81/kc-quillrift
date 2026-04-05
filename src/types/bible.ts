// Tipos para o módulo Bible (Worldbuilding)

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  age?: number;
  occupation?: string;
  // Aparência
  appearance?: string;
  // Personalidade
  personality?: string;
  // Background
  backstory?: string;
  // Motivação
  motivation?: string;
  // Arco
  arc?: string;
  // Relações
  relationships?: Array<{
    characterId: string;
    type: 'ally' | 'enemy' | 'family' | 'romantic' | 'neutral';
    description: string;
  }>;
  // Notas
  notes?: string;
  // Metadados
  isSpecial?: boolean; // É um Especial (no universo Reset Infinito)
  power?: string; // Poder temporal, se aplicável
  status: 'active' | 'inactive' | 'deceased' | 'unknown';
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Location {
  id: string;
  name: string;
  aliases: string[];
  type: 'city' | 'building' | 'landmark' | 'region' | 'world' | 'other';
  // Descrição
  description: string;
  // Aparência física
  appearance?: string;
  // História
  history?: string;
  // Significância
  significance?: string;
  // Localização
  parentLocationId?: string; // ID da localização pai (ex: cidade dentro de país)
  // Notas
  notes?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  name: string;
  aliases: string[];
  type: 'weapon' | 'artifact' | 'technology' | 'document' | 'other';
  // Descrição
  description: string;
  // História
  history?: string;
  // Significância
  significance?: string;
  // Proprietário atual
  currentOwnerId?: string;
  // Notas
  notes?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface Concept {
  id: string;
  name: string;
  category: 'magic' | 'technology' | 'system' | 'organization' | 'term' | 'other';
  // Definição
  definition: string;
  // Explicação detalhada
  explanation?: string;
  // Regras/limitações
  rules?: string[];
  // Exemplos
  examples?: string[];
  // Notas
  notes?: string;
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineEvent {
  id: string;
  title: string;
  // Data (pode ser específica ou relativa)
  date: string;
  dateDisplay: string; // Como mostrar para o usuário (ex: "1947", "Livro 1 - Cap 5")
  // Descrição
  description: string;
  // Personagens envolvidos
  characterIds: string[];
  // Local
  locationId?: string;
  // Tipo
  type: 'major' | 'minor' | 'flashback' | 'future';
  // Ordem
  order: number;
  // Conexões com outros eventos
  relatedEventIds?: string[];
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Dados de exemplo do universo Reset Infinito
export const EXAMPLE_CHARACTERS: Character[] = [
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    aliases: ['O Resetador'],
    age: 28,
    occupation: 'Analista de dados (desempregado) / Líder da Fundação Temporal',
    appearance: 'Descendente de asiáticos. Cabelos escuros e lisos. Aparência inicialmente cansada e desleixada, evoluindo para postura focada e determinada. Olhos expressivos que carregam o peso dos resets.',
    personality: 'Analítico, protetor, determinado. Carrega o fardo da responsabilidade.',
    backstory: 'Seus pais morreram em uma anomalia temporal, o que o expôs à energia que despertou seu potencial.',
    motivation: 'Começa com sobrevivência. Evolui para responsabilidade profunda e proteção dos outros Especiais.',
    arc: 'De sobrevivente reativo a portador do fardo cósmico',
    isSpecial: true,
    power: 'Reset Temporal por Morte: ao morrer, sua consciência retorna a um ponto no passado. Percepção Temporal Amplificada. Maldição da Ganância.',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'elena-vasquez',
    name: 'Elena Vasquez',
    aliases: [],
    age: 32,
    occupation: 'Ex-investigadora particular',
    appearance: 'Cabelos castanhos escuros, geralmente presos em coque profissional. Postura alerta. Olhos inteligentes e penetrantes. Físico atlético e ágil.',
    personality: 'Determinada, protetora, leal',
    motivation: 'Vingança pela morte do irmão mais novo, Especial capturado e morto pela Chronos Analytics.',
    arc: 'De vingança pessoal a liderança moral plena',
    isSpecial: false,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tom-bradley',
    name: 'Tom Bradley',
    aliases: ['Thomas Bradley'],
    age: 30,
    occupation: 'Ex-médico de combate militar',
    appearance: '1,90m, constituição poderosa. Carisma e calma confiante. No final do Livro 1, sofre lesão grave na perna que o deixa com claudicação permanente.',
    personality: 'Calmo, leal, coração moral da equipe',
    motivation: 'Lealdade feroz a Marcus e ao juramento médico.',
    arc: 'De soldado a mentor resiliente com limitação permanente',
    isSpecial: false,
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'elena-hanson',
    name: 'Dra. Lena Hanson',
    aliases: [],
    age: 40,
    occupation: 'Neuropsiquiatra',
    appearance: 'Cabelos louros com fios de prata. Olhos azuis marcantes, calmos e perceptivos.',
    personality: 'Empática, protetora, âncora emocional',
    motivation: 'Curar e proteger a equipe, especialmente Marcus e Tom.',
    arc: 'Testemunha Temporal e guardiã da sanidade dos Especiais',
    isSpecial: true,
    power: 'Empatia Temporal: sente os ecos emocionais e cicatrizes que os resets deixam nas pessoas. Base do Protocolo Testemunha.',
    status: 'deceased',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'arquiteto',
    name: 'O Arquiteto',
    aliases: ['A Anomalia Primordial'],
    occupation: 'Líder dos Renovadores',
    appearance: 'Instável e disforme. Aparece como figura de contornos que mudam como fumaça escura, com olhos como estrelas mortas.',
    personality: 'Megalomaníaco, isolado, acredita estar consertando a realidade defeituosa',
    motivation: 'Reescrever a realidade à sua imagem. Acredita que está consertando algo quebrado.',
    arc: 'Anticorpo primordial corrompido - confronto final no Livro 5',
    isSpecial: true,
    power: 'Vasto e refinado controle sobre o tempo e a realidade.',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const EXAMPLE_CONCEPTS: Concept[] = [
  {
    id: 'aion',
    name: 'Aion',
    category: 'system',
    definition: 'A força senciente subjacente ao tempo. A consciência coletiva da realidade tentando se autocorrigir.',
    explanation: 'Opera como um sistema imunológico cósmico: cria anticorpos (Especiais) para neutralizar ameaças ao fluxo temporal. Sua existência é um mistério para quase todos até o Livro 4.',
    rules: [
      'Cria Especiais como anticorpos da realidade',
      'Não concede poderes - apenas desperta potencial latente',
      'Cada poder tem função estrutural no equilíbrio temporal',
      'Só se revela a Marcus no Livro 4',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'evento-1947',
    name: 'O Evento de 1947',
    category: 'system',
    definition: 'Uma catástrofe que feriu o tecido do tempo, liberando energia temporal no mundo.',
    explanation: 'O Big Bang dos poderes temporais na era moderna. Marcou o DNA de linhagens inteiras, criando o potencial para Especiais.',
    rules: [
      'Não foi o primeiro evento temporal da história',
      'Foi o primeiro a gerar Especiais em escala',
      'O Arquiteto já monitorava anomalias menores antes disso',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'reset-temporal',
    name: 'Reset Temporal',
    category: 'magic',
    definition: 'Poder de Marcus: ao morrer, sua consciência retorna a um ponto no passado.',
    explanation: 'O ponto de retorno é variável e imprevisível no Livro 1. Controle parcial começa no Livro 3.',
    rules: [
      'Só ativa com a morte (sem ativação voluntária no Livro 1)',
      'Cada reset carrega memória integral',
      'Todo reset tem custo físico: dor de cabeça, sangramento nasal, vertigem',
      'Maldição da Ganância: uso para ganho pessoal = consequências catastróficas',
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'especiais',
    name: 'Especiais',
    category: 'term',
    definition: 'Indivíduos com poderes temporais que são, sem saber, o sistema imunológico de Aion.',
    explanation: 'Criados como anticorpos humanos para proteger o fluxo temporal. Heróis e vilões vieram da mesma fonte.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'fundacao-temporal',
    name: 'Fundação Temporal',
    category: 'organization',
    definition: 'Organização liderada por Marcus para proteger Especiais de facções que os exploram.',
    explanation: 'Base de operações para resgatar, proteger e organizar Especiais. Financiada pela Aliança do Curador.',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];
