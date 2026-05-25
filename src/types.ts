/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DiaSemana = "Seg" | "Ter" | "Qua" | "Qui" | "Sex" | "Sab" | "Dom";

export type CategoriaTarefa = "Casa" | "Compras" | "Financeiro" | "Outro";

export interface CasalState {
  id: string; // casalId
  nome: string;
  criadoEm: string;
  streakAtual: number;
  streakUltimaData: string | null;
  xpCasal: number;
  nivelTerreno: number;
}

export interface UsuarioState {
  id: string; // usuarioId ("karina-id" | "yuri-id")
  nome: string;
  papel: "ela" | "ele";
  xpIndividual: number;
  avatar: string; // Emoji ou ID do avatar
  badges: string[];
}

export interface TarefaState {
  id: string; // tarefaId
  titulo: string;
  responsavel: string; // usuarioId
  dia: DiaSemana;
  xp: number;
  tag: CategoriaTarefa;
  concluida: boolean;
  concluidaEm: string | null;
  trocaDisponivel: boolean;
}

export interface RitualState {
  id: string; // ritualId
  titulo: string;
  descricao: string;
  dia: string; // ex: "Diário", "Sábado", "Seg-Sex"
  horario: string; // ex: "22:00"
  xpBonus: number;
  confirmacaoEla: boolean;
  confirmacaoEle: boolean;
  ultimaConfirmacao: string | null;
}

export interface RecompensaState {
  id: string; // recompensaId
  titulo: string;
  custoXP: number;
  configuradaPor: string; // usuarioId
  resgatada: boolean;
  resgatadaEm: string | null;
}

export type StatusTroca = "pendente" | "aceita" | "recusada" | "contraproposta";

export interface TrocaState {
  id: string; // trocaId
  tarefaId: string;
  proponenteId: string; // usuarioId (quem pediu a troca)
  recompensaOferecida: string; // Título da recompensa ou texto livre
  status: StatusTroca;
  contrapropostaTexto: string | null;
  criadaEm: string;
}

// Global App Integration State
export interface CoupleAppState {
  currentUserId: string; // "karina-id" | "yuri-id"
  casalId: string; // "test-couple"
  casal: CasalState;
  usuarios: {
    ela: UsuarioState;
    ele: UsuarioState;
  };
  tarefas: TarefaState[];
  rituais: RitualState[];
  recompensas: RecompensaState[];
  trocas: TrocaState[];
  stars: number; // For virtual currency "Estrelas Karina" (concept of Game design)
  unlockedDecorations: string[]; // List of IDs for unlocked terrain decorations
  activeDecorationStyle: string; // "garden-default" etc
}
