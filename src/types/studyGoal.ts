/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GoalStatus = 'pendente' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string;
  updatedAt: string;
}

export type StudyGoalInput = Omit<StudyGoal, 'id' | 'createdAt' | 'updatedAt'>;

export interface StatusConfig {
  label: string;
  description: string;
  bgLight: string;
  textClass: string;
  borderClass: string;
  badgeBg: string;
  dotColor: string;
}

export const STATUS_MAP: Record<GoalStatus, StatusConfig> = {
  pendente: {
    label: 'Pendente',
    description: 'Ainda não iniciado',
    bgLight: 'bg-amber-50',
    textClass: 'text-amber-800',
    borderClass: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
    dotColor: 'bg-amber-500',
  },
  em_andamento: {
    label: 'Em Andamento',
    description: 'Estudos em progresso',
    bgLight: 'bg-blue-50',
    textClass: 'text-blue-800',
    borderClass: 'border-blue-200',
    badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
    dotColor: 'bg-blue-500',
  },
  concluido: {
    label: 'Concluído',
    description: 'Objetivo alcançado!',
    bgLight: 'bg-emerald-50',
    textClass: 'text-emerald-800',
    borderClass: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    dotColor: 'bg-emerald-500',
  },
};

export type FilterStatus = 'todos' | GoalStatus;
