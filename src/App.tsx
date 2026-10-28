/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { StatsOverview } from './components/StatsOverview';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { storageService } from './services/storageService';
import { StudyGoal, StudyGoalInput, GoalStatus, FilterStatus } from './types/studyGoal';
import { CheckCircle, AlertCircle, Plus, Sparkles, BookOpen } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'info';
  message: string;
}

export default function App() {
  // Estado principal de objetivos
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados dos Modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<StudyGoal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<StudyGoal | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Estados de Filtro e Busca
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'deadline' | 'recent' | 'title'>('deadline');

  // Sistema simples e acolhedor de Toast para feedback imediato
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Carrega objetivos do localStorage na inicialização
  useEffect(() => {
    const loadedGoals = storageService.getAllGoals();
    setGoals(loadedGoals);
    setIsLoaded(true);
  }, []);

  // Handler: Criar ou Editar Objetivo
  const handleSaveGoal = (input: StudyGoalInput) => {
    if (goalToEdit) {
      const updated = storageService.updateGoal(goalToEdit.id, input);
      if (updated) {
        setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.addGoal(input);
      setGoals((prev) => [created, ...prev]);
      showToast('Novo objetivo de estudo cadastrado!');
    }
    setGoalToEdit(null);
  };

  // Handler: Mudança Rápida de Status pelo Card
  const handleQuickStatusChange = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateGoal(id, { status: newStatus });
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === id ? updated : g)));
      if (newStatus === 'concluido') {
        showToast('Parabéns! Mais um objetivo concluído com sucesso! 🎉');
      } else {
        showToast('Status do objetivo atualizado.');
      }
    }
  };

  // Handler: Abrir formulário para edição
  const handleStartEdit = (goal: StudyGoal) => {
    setGoalToEdit(goal);
    setIsFormOpen(true);
  };

  // Handler: Solicitar exclusão (abre confirmação)
  const handleRequestDelete = (goal: StudyGoal) => {
    setGoalToDelete(goal);
    setIsDeleteModalOpen(true);
  };

  // Handler: Confirmar exclusão
  const handleConfirmDelete = (goalId: string) => {
    const success = storageService.deleteGoal(goalId);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
      showToast('Objetivo excluído com segurança.', 'info');
    }
  };

  // Handler: Restaurar exemplos de demonstração
  const handleRestoreSamples = () => {
    const sampleGoals = storageService.resetToSampleData();
    setGoals(sampleGoals);
    showToast('Exemplos de estudos restaurados!');
  };

  // Filtros e ordenação computados
  const filteredAndSortedGoals = useMemo(() => {
    return goals
      .filter((goal) => {
        // Filtro por status
        if (activeFilter !== 'todos' && goal.status !== activeFilter) {
          return false;
        }
        // Filtro por texto
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchTitle = goal.title.toLowerCase().includes(query);
          const matchDesc = (goal.description || '').toLowerCase().includes(query);
          return matchTitle || matchDesc;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          // Objetivos sem prazo ficam por último, prazos mais próximos primeiro
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return a.deadline.localeCompare(b.deadline);
        } else if (sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title, 'pt-BR');
        }
        return 0;
      });
  }, [goals, activeFilter, searchQuery, sortBy]);

  const isFilterActive = activeFilter !== 'todos' || searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Toast Notifier */}
      <aside aria-label="Notificações" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium shadow-xl border border-slate-800 animate-in fade-in slide-in-from-bottom-3 duration-200"
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </aside>

      {/* Barra de Navegação */}
      <Navbar
        onOpenNewModal={() => {
          setGoalToEdit(null);
          setIsFormOpen(true);
        }}
        totalGoals={goals.length}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Painel de Métricas e Quantidade de Objetivos */}
        <StatsOverview goals={goals} />

        {/* Barra de Ferramentas: Busca, Filtros de Status e Ordenação */}
        {goals.length > 0 && (
          <FilterBar
            goals={goals}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        )}

        {/* Listagem de Objetivos ou Estado Vazio */}
        {filteredAndSortedGoals.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>Objetivos de Estudo</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                  {filteredAndSortedGoals.length}
                </span>
              </h2>

              {isFilterActive && (
                <button
                  onClick={() => {
                    setActiveFilter('todos');
                    setSearchQuery('');
                  }}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  Ver todos os objetivos
                </button>
              )}
            </div>

            {/* Grid Responsivo de Cartões de Objetivos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredAndSortedGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onEdit={handleStartEdit}
                  onDeleteRequest={handleRequestDelete}
                  onQuickStatusChange={handleQuickStatusChange}
                />
              ))}
            </div>
          </div>
        ) : (
          <EmptyState
            isFiltered={isFilterActive}
            onOpenNewModal={() => {
              setGoalToEdit(null);
              setIsFormOpen(true);
            }}
            onClearFilter={() => {
              setActiveFilter('todos');
              setSearchQuery('');
            }}
            onRestoreSamples={goals.length === 0 ? handleRestoreSamples : undefined}
          />
        )}
      </main>

      {/* Rodapé Simples e Acolhedor */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-slate-700">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>StudyFlow &bull; Seu companheiro de aprendizado diário</span>
          </div>
          <p className="text-slate-400">
            Dados salvos automaticamente no seu navegador via localStorage.
          </p>
        </div>
      </footer>

      {/* Modal de Formulário (Cadastrar / Editar) */}
      <GoalFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setGoalToEdit(null);
        }}
        onSubmit={handleSaveGoal}
        goalToEdit={goalToEdit}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        goal={goalToDelete}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setGoalToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
