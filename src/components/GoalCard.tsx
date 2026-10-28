/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Calendar,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { StudyGoal, GoalStatus, STATUS_MAP } from '../types/studyGoal';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onQuickStatusChange: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onQuickStatusChange,
}) => {
  const statusInfo = STATUS_MAP[goal.status];

  // Helper para formatar prazo e calcular proximidade
  const getDeadlinMeta = (deadlineStr: string) => {
    if (!deadlineStr) return { text: 'Sem prazo', isUrgent: false, isOverdue: false };

    // Evitar problemas de timezone decompondo a string YYYY-MM-DD
    const [year, month, day] = deadlineStr.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = targetDate.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (diffDays < 0) {
      const daysAgo = Math.abs(diffDays);
      return {
        text: `Venceu há ${daysAgo} ${daysAgo === 1 ? 'dia' : 'dias'} (${formattedDate})`,
        isUrgent: true,
        isOverdue: true,
      };
    } else if (diffDays === 0) {
      return {
        text: `Vence hoje! (${formattedDate})`,
        isUrgent: true,
        isOverdue: false,
      };
    } else if (diffDays === 1) {
      return {
        text: `Vence amanhã (${formattedDate})`,
        isUrgent: true,
        isOverdue: false,
      };
    } else {
      return {
        text: `Prazo: ${formattedDate} (${diffDays} dias restantes)`,
        isUrgent: false,
        isOverdue: false,
      };
    }
  };

  const deadlineMeta = getDeadlinMeta(goal.deadline);
  const isConcluido = goal.status === 'concluido';

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden ${
        isConcluido
          ? 'border-emerald-200 bg-emerald-50/20'
          : deadlineMeta.isOverdue
          ? 'border-rose-200'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      {/* Top accent line */}
      <div
        className={`h-1.5 w-full ${
          goal.status === 'concluido'
            ? 'bg-emerald-500'
            : goal.status === 'em_andamento'
            ? 'bg-blue-500'
            : 'bg-amber-500'
        }`}
      />

      <div className="p-5 flex-1 flex flex-col">
        {/* Cabeçalho do Card: Status & Ações rápidas */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="relative inline-block">
            <label className="sr-only" htmlFor={`status-select-${goal.id}`}>
              Alterar status de {goal.title}
            </label>
            <select
              id={`status-select-${goal.id}`}
              value={goal.status}
              onChange={(e) => onQuickStatusChange(goal.id, e.target.value as GoalStatus)}
              className={`appearance-none text-xs font-semibold py-1 pl-2.5 pr-7 rounded-full border cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-offset-1 transition-all ${statusInfo.badgeBg}`}
              title="Clique para alterar status rapidamente"
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
            <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
              title="Editar este objetivo"
              aria-label={`Editar objetivo ${goal.title}`}
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(goal)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Excluir este objetivo"
              aria-label={`Excluir objetivo ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug mb-2 ${
            isConcluido ? 'line-through text-slate-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição */}
        {goal.description ? (
          <p
            className={`text-sm leading-relaxed mb-4 flex-1 whitespace-pre-line ${
              isConcluido ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4 flex-1">
            Sem descrição complementar
          </p>
        )}

        {/* Rodapé do Card: Prazo e indicador */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs mt-auto">
          <div
            className={`flex items-center gap-1.5 font-medium ${
              isConcluido
                ? 'text-emerald-700'
                : deadlineMeta.isOverdue
                ? 'text-rose-600'
                : deadlineMeta.isUrgent
                ? 'text-amber-700'
                : 'text-slate-500'
            }`}
          >
            {isConcluido ? (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : deadlineMeta.isOverdue ? (
              <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            ) : (
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className="truncate">{deadlineMeta.text}</span>
          </div>

          {/* Atalho rápido para concluir com um clique */}
          {!isConcluido ? (
            <button
              onClick={() => onQuickStatusChange(goal.id, 'concluido')}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer shrink-0 ml-2"
            >
              Concluir
            </button>
          ) : (
            <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
              Finalizado 🎉
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
