// Tipos específicos do agente Architect

export interface ConceptVariant {
  id: string;
  title: string;
  subtitle: string;
  genre: string;
  tone: string;
  logline: string;
  concept: string;
  structure: BookStructure;
}

export interface BookStructure {
  format: 'standalone' | 'duology' | 'trilogy' | 'series';
  books: BookOutline[];
}

export interface BookOutline {
  number: number;
  title: string;
  subtitle?: string;
  arc: string;
  chapters: number;
  summary: string;
}

export interface ArchitectSuggestion {
  id: string;
  prompt: string;
  variants: ConceptVariant[];
  createdAt: Date;
}

// Mock data baseado no universo real: Reset Infinito
export const MOCK_ARCHITECT_SUGGESTIONS: ArchitectSuggestion = {
  id: 'mock-reset-infinito',
  prompt: 'Um homem descobre que pode voltar no tempo ao morrer, mas não controla quando. Ele precisa proteger outros como ele de organizações que os caçam.',
  createdAt: new Date(),
  variants: [
    {
      id: 'v1',
      title: 'Reset Infinito',
      subtitle: 'A Saga do Sistema Aion',
      genre: 'Ficção Científica / Thriller Temporal',
      tone: 'Complexidade moral de GRRM, realismo processual de Stieg Larsson, estruturas filosóficas dos irmãos Nolan',
      logline: 'Um analista desempregado descobre que pode resetar o tempo ao morrer — e que é um anticorpo humano de uma consciência cósmica chamada Aion.',
      concept: 'Em 1947, uma catástrofe feriu o tecido do tempo e criou os Especiais: indivíduos com poderes temporais que são, sem saber, o sistema imunológico de Aion. Marcus Chen, um analista de dados desempregado, desperta seu poder ao morrer em um acidente. Agora ele lidera a Fundação Temporal para proteger outros Especiais de facções que os exploram, caçam ou usam como peças — sem saber que heróis e vilões foram criados pela mesma fonte.',
      structure: {
        format: 'series',
        books: [
          {
            number: 1,
            title: 'O Despertar do Paradoxo',
            subtitle: 'Reset Infinito #1',
            arc: 'Descoberta do poder. Formação da Fundação. Primeiro confronto com a Chronos Analytics.',
            chapters: 33,
            summary: 'Marcus descobre seus resets caóticos e sem controle. Une forças com Elena (ex-investigadora), Tom (médico militar) e Maya (hacker) para resgatar Especiais da Chronos. O clímax custa a perna de Tom. Primeiro vislumbre do Arquiteto.'
          },
          {
            number: 2,
            title: 'O Adversário',
            subtitle: 'Reset Infinito #2',
            arc: 'Fundação operacional. Crise de recursos. Chegada de Agent Zero. Sacrifício de Nakamura.',
            chapters: 28,
            summary: 'Agent Zero — que lembra os resets de Marcus — muda as regras do jogo. O Blip testa a Maldição da Ganância. Damien Jordan aparece em coma, vazando ecos de 1947. Nakamura morre protegendo a equipe.'
          },
          {
            number: 3,
            title: 'Segredos do Tempo',
            subtitle: 'Reset Infinito #3',
            arc: 'Investigação das origens. Revelação das três facções do Coletivo. Morte de Lena.',
            chapters: 26,
            summary: 'Marcus desenvolve controle parcial sobre os resets. A equipe descobre que o Arquiteto monitorava anomalias antes de 1947. Lena morre — golpe devastador. Os Transcendentes emergem como rumor perturbador.'
          },
          {
            number: 4,
            title: 'Guerra Temporal',
            subtitle: 'Reset Infinito #4',
            arc: 'Confronto aberto. Revelação de Aion. Despertar de Damien. Aliança impossível.',
            chapters: 30,
            summary: 'Fundação sitiada. Missões no passado. Marcus tem contato direto com Aion e descobre que todos os Especiais são anticorpos — incluindo o Arquiteto. Damien desperta. Agent Zero entra em zona cinzenta.'
          },
          {
            number: 5,
            title: 'O Destino da Realidade',
            subtitle: 'Reset Infinito #5',
            arc: 'Confronto final. A Quarta Opção. Resolução definitiva.',
            chapters: 24,
            summary: 'O Arquiteto tenta fundir-se com o fluxo temporal. Os Transcendentes oferecem uma chave perigosa. A Quarta Opção — algo que subverte a lógica do próprio reset. Só funciona porque Marcus construiu a equipe que tem.'
          }
        ]
      }
    },
    {
      id: 'v2',
      title: 'Âncora de 1947',
      subtitle: 'O Despertar de Damien Jordan',
      genre: 'Thriller Sci-Fi / Mistério',
      tone: 'Paranoia, investigação, horror cósmico sutil',
      logline: 'Um homem em coma vaza ecos temporais de 1947 — e é a única chave para entender o Evento que criou os poderes.',
      concept: 'Damien Jordan não é apenas um Especial em coma. Seu avô estava no epicentro do Evento de 1947, e a energia temporal marcou o DNA da linhagem. Enquanto dorme, ele funciona como âncora entre 1947 e o presente. Quando facções descobrem que ele pode acessar o "marco zero" dos poderes temporais, torna-se o alvo mais cobiçado do mundo — e o segredo que pode destruir ou salvar a realidade.',
      structure: {
        format: 'trilogy',
        books: [
          {
            number: 1,
            title: 'O Coma que Lembra',
            subtitle: 'Âncora de 1947 #1',
            arc: 'Mistério do coma. Descoberta da ressonância com 1947.',
            chapters: 22,
            summary: 'Uma equipe médica descobre que o paciente em coma reage a eventos históricos de 1947. Ecos temporais escapam de seu corpo. Uma mulher sente suas emoções. Um homem toca sua mão e vê fragmentos do passado. Quem é ele? E por que todos querem ele morto ou desperto?'
          },
          {
            number: 2,
            title: 'O Ponto de Ignição',
            subtitle: 'Âncora de 1947 #2',
            arc: 'Investigação do Evento. Revelação das facções.',
            chapters: 24,
            summary: 'A equipe rastreia a origem do poder de Damien até o Evento de 1947. Descobrem que não foi o primeiro evento temporal, mas foi o que escalou além do controle. Três facções querem Damien: uns querem usá-lo, outros matá-lo, outros libertá-lo.'
          },
          {
            number: 3,
            title: 'O Despertar',
            subtitle: 'Âncora de 1947 #3',
            arc: 'Consciência unida entre eras. Escolha final.',
            chapters: 20,
            summary: 'Damien desperta — mas o que desperta é mais que um homem. É 1947 e o presente simultaneamente. A escolha final: preservar a memória do Evento (mantendo os poderes) ou apagá-lo (eliminando todas as anomalias, incluindo ele mesmo)?'
          }
        ]
      }
    },
    {
      id: 'v3',
      title: 'Agent Zero',
      subtitle: 'O Preço da Ordem',
      genre: 'Thriller de Espionagem / Drama Psicológico',
      tone: 'Frio, paranoico, tragédia de Shakespeare',
      logline: 'Ele lembra cada reset. E por isso, enlouqueceu.',
      concept: 'O que acontece quando alguém com poder temporal não tem equipe? Agent Zero foi como Marcus — um Especial que despertou o poder de reset. Mas sem o Protocolo Testemunha, sem Lena para validar sua experiência, sem Tom para ser âncora moral, cada reset o fragmentou mais. Agora ele caça outros Especiais para a Ordem, acreditando que está purificando o tempo. Mas o que o diferencia de Marcus não é o poder. É a ausência de conexão humana.',
      structure: {
        format: 'standalone',
        books: [
          {
            number: 1,
            title: 'Agent Zero',
            subtitle: 'O Preço da Ordem',
            arc: 'Origem, queda e redenção impossível',
            chapters: 28,
            summary: 'A história de como um operativo de inteligência se tornou o caçador mais letal de Especiais. Flashbacks paralelos mostram cada reset que ele sobreviveu sozinho, cada memória que carrega sem ninguém para dizer "eu acredito em você". O confronto com Marcus não é uma batalha — é um espelho. E no final, ele não se converte. Apenas para. Entra em zona cinzenta, entre herói e vilão, para sempre.'
          }
        ]
      }
    }
  ]
};
