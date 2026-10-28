/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudyGoal, StudyGoalInput } from '../types/studyGoal';

const STORAGE_KEY = 'studyflow_goals_v1';
const INITIALIZED_KEY = 'studyflow_has_initialized_v1';

// Dados iniciais acolhedores para estudantes iniciantes no primeiro acesso
const DEFAULT_INITIAL_GOALS: StudyGoal[] = [
  {
    id: 'goal-intro-1',
    title: 'Criar uma rotina de estudos de 45 minutos',
    description: 'Separar um horário fixo sem celular para estudar um tema específico e fazer anotações.',
    deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-intro-2',
    title: 'Resumir o Módulo 1 com mapas mentais',
    description: 'Revisar os conceitos fundamentais e desenhar as conexões principais em uma folha.',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pendente',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'goal-intro-3',
    title: 'Organizar local e materiais de estudo',
    description: 'Limpar a mesa de estudos, separar caderno, canetas e salvar os links das aulas.',
    deadline: new Date().toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage
   */
  getAllGoals(): StudyGoal[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const hasInitialized = localStorage.getItem(INITIALIZED_KEY);

      // Se for a primeira vez que o usuário abre o aplicativo, oferece metas de exemplo amigáveis
      if (!hasInitialized && !stored) {
        localStorage.setItem(INITIALIZED_KEY, 'true');
        this.saveAllGoals(DEFAULT_INITIAL_GOALS);
        return DEFAULT_INITIAL_GOALS;
      }

      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Grava a lista completa no localStorage
   */
  saveAllGoals(goals: StudyGoal[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
      localStorage.setItem(INITIALIZED_KEY, 'true');
    } catch (error) {
      console.error('Erro ao gravar objetivos no localStorage:', error);
    }
  },

  /**
   * Cria um novo objetivo
   */
  addGoal(input: StudyGoalInput): StudyGoal {
    const goals = this.getAllGoals();
    const now = new Date().toISOString();
    
    // Gerador de ID compatível e seguro
    const id = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `goal-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const newGoal: StudyGoal = {
      id,
      title: input.title.trim(),
      description: input.description.trim(),
      deadline: input.deadline,
      status: input.status,
      createdAt: now,
      updatedAt: now,
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveAllGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Edita um objetivo existente
   */
  updateGoal(id: string, input: Partial<StudyGoalInput>): StudyGoal | null {
    const goals = this.getAllGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const existing = goals[index];
    const updated: StudyGoal = {
      ...existing,
      ...input,
      title: input.title !== undefined ? input.title.trim() : existing.title,
      description: input.description !== undefined ? input.description.trim() : existing.description,
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updated;
    this.saveAllGoals(goals);
    return updated;
  },

  /**
   * Exclui um objetivo pelo ID
   */
  deleteGoal(id: string): boolean {
    const goals = this.getAllGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) return false;

    this.saveAllGoals(filtered);
    return true;
  },

  /**
   * Reseta para os exemplos iniciais (útil para exploração e testes)
   */
  resetToSampleData(): StudyGoal[] {
    this.saveAllGoals(DEFAULT_INITIAL_GOALS);
    return DEFAULT_INITIAL_GOALS;
  },
};
