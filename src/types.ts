/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type DayOfWeek = "segunda" | "terca" | "quarta" | "quinta" | "sexta" | "sabado" | "domingo";

export type TaskCategory = "casa" | "compras" | "financeiro" | "outro";

export interface HomeState {
  id: string;
  partnerAId: string; // Ela
  partnerBId: string; // Ele
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  terrainLevel: number;
  terrainXp: number;
  createdAt: string;
}

export interface UserState {
  id: string;
  homeId: string;
  role: "ela" | "ele";
  displayName: string;
  avatarId: string;
  xp: number;
  badge: string;
  streakBonus: number;
  createdAt: string;
}

export interface TaskState {
  id: string;
  homeId: string;
  title: string;
  category: TaskCategory;
  xpValue: number;
  assigneeId: string;
  dayOfWeek: DayOfWeek;
  completed: boolean;
  completedAt?: string;
  comboCount?: number;
}

export interface RitualState {
  id: string;
  homeId: string;
  title: string;
  description: string;
  dayOfWeek: DayOfWeek;
  confirmedByA: boolean;
  confirmedByB: boolean;
  lastTriggered?: string;
}

export interface RewardState {
  id: string;
  homeId: string;
  title: string;
  xpRequired: number;
  assigneeId: string; // the receiver (configured it)
  progress: number;
}

export type ProposalStatus = "pending" | "accepted" | "declined";

export interface ProposalState {
  id: string;
  homeId: string;
  proposerId: string;
  receiverId: string;
  taskId: string;
  rewardId: string;
  status: ProposalStatus;
}

export interface CoupleAppState {
  currentUserId: string; // 'yuri-id' or 'karina-id'
  home: HomeState;
  users: {
    ela: UserState;
    ele: UserState;
  };
  tasks: TaskState[];
  rituals: RitualState[];
  rewards: RewardState[];
  proposals: ProposalState[];
  stars: number; // Estrelas Karina
}
