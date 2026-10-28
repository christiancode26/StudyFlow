/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, Clock, Hourglass, Target, Award } from 'lucide-react';
import { StudyGoal } from '../types/studyGoal';

interface StatsOverviewProps {
  goals: StudyGoal[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ goals }) => {
  const total = goals.length;
  const pendentes = goals.filter((g) => g.status === 'pendente').length;
  const emAndamento = goals.filter((g) => g.status === 'em_andamento').length;
  const concluidos = goals.filter((g) => g.status === 'concluido').length;

  const percentualConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Banner de boas-vindas com progresso */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-medium backdrop-blur-sm">
              <Award className="w-3.5 h-3.5" />
              <span>Construindo seu hábito de estudos</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Olá, estudante! Vamos em frente?
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base leading-relaxed">
              Divida seu aprendizado em pequenos passos. Cada objetivo concluído é uma vitória rumo ao seu sucesso.
            </p>
          </div>

          {/* Medidor visual de taxa de conclusão */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl p-4 min-w-[220px] flex flex-col justify-center">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-indigo-200">Progresso Geral</span>
              <span className="text-sm font-bold text-emerald-400">{percentualConclusao}% Concluído</span>
            </div>
            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-300 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentualConclusao}%` }}
              />
            </div>
            <p className="text-[11px] text-indigo-300 mt-2 text-right">
              {concluidos} de {total} metas finalizadas
            </p>
          </div>
        </div>
      </div>

      {/* Cartões de Métricas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total de Objetivos */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-600">Total</span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900">{total}</div>
          <p className="text-xs text-slate-500 mt-1">
            {total === 1 ? 'Objetivo cadastrado' : 'Objetivos cadastrados'}
          </p>
        </div>

        {/* Pendentes */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-amber-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700">Pendentes</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Hourglass className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-600">{pendentes}</div>
          <p className="text-xs text-slate-500 mt-1">A iniciar estudos</p>
        </div>

        {/* Em Andamento */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">Em Curso</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">{emAndamento}</div>
          <p className="text-xs text-slate-500 mt-1">Estudando agora</p>
        </div>

        {/* Concluídos */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Concluídos</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-600">{concluidos}</div>
          <p className="text-xs text-slate-500 mt-1">Metas cumpridas</p>
        </div>
      </div>
    </div>
  );
};
