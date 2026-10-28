/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpenCheck, SearchX, Plus, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onOpenNewModal: () => void;
  onClearFilter?: () => void;
  onRestoreSamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onOpenNewModal,
  onClearFilter,
  onRestoreSamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">
          Não encontramos nenhum objetivo com os termos de busca ou filtros selecionados.
        </p>
        {onClearFilter && (
          <button
            onClick={onClearFilter}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
          >
            Limpar filtros e busca
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-dashed border-indigo-200 p-8 sm:p-14 text-center max-w-xl mx-auto my-8 shadow-xs">
      <div className="w-18 h-18 rounded-3xl bg-gradient-to-tr from-indigo-100 to-emerald-100 text-indigo-600 mx-auto flex items-center justify-center mb-5 shadow-inner">
        <BookOpenCheck className="w-9 h-9" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
        Comece com clareza
      </span>
      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-3 mb-2">
        Sua jornada de estudos começa aqui!
      </h3>
      <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        Você ainda não cadastrou nenhum objetivo. Que tal criar sua primeira meta de estudo agora mesmo? Pequenos passos diários constroem grandes conquistas.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenNewModal}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-100 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar Meu Primeiro Objetivo</span>
        </button>

        {onRestoreSamples && (
          <button
            onClick={onRestoreSamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            title="Carrega 3 exemplos práticos para demonstrar o funcionamento"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ver exemplos prontos</span>
          </button>
        )}
      </div>
    </div>
  );
};
