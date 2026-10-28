/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { FilterStatus, StudyGoal } from '../types/studyGoal';

interface FilterBarProps {
  goals: StudyGoal[];
  activeFilter: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: 'deadline' | 'recent' | 'title';
  onSortChange: (sort: 'deadline' | 'recent' | 'title') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  goals,
  activeFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) => {
  const counts = {
    todos: goals.length,
    pendente: goals.filter((g) => g.status === 'pendente').length,
    em_andamento: goals.filter((g) => g.status === 'em_andamento').length,
    concluido: goals.filter((g) => g.status === 'concluido').length,
  };

  const filterTabs: { id: FilterStatus; label: string; count: number }[] = [
    { id: 'todos', label: 'Todos', count: counts.todos },
    { id: 'pendente', label: 'Pendentes', count: counts.pendente },
    { id: 'em_andamento', label: 'Em Andamento', count: counts.em_andamento },
    { id: 'concluido', label: 'Concluídos', count: counts.concluido },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou anotações..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/80 focus:bg-white rounded-xl border border-slate-200 focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Ordenação */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pl-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Ordenar:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as 'deadline' | 'recent' | 'title')}
            className="text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-200"
          >
            <option value="deadline">Prazo mais próximo</option>
            <option value="recent">Mais recentes</option>
            <option value="title">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas de filtro por status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200/80 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
