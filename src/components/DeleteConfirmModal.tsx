/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AlertCircle, Trash2, X } from 'lucide-react';
import { StudyGoal } from '../types/studyGoal';

interface DeleteConfirmModalProps {
  goal: StudyGoal | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (goalId: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  goal,
  isOpen,
  onClose,
  onConfirm,
}) => {
  // Fechar no ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !goal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
        className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="text-lg font-bold text-slate-900">
              Confirmar exclusão
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Tem certeza que deseja excluir este objetivo de estudo?
            </p>
          </div>
        </div>

        {/* Destaque do objetivo */}
        <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs uppercase font-semibold tracking-wider text-slate-600 mb-1">
            Objetivo a ser removido:
          </p>
          <p className="text-sm font-semibold text-slate-800 line-clamp-2">
            "{goal.title}"
          </p>
          {goal.deadline && (
            <p className="text-xs text-slate-500 mt-1">
              Prazo registrado: {goal.deadline}
            </p>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-3">
          Essa ação não pode ser desfeita. Todos os dados desse objetivo serão apagados da sua lista.
        </p>

        {/* Botões de Ação */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(goal.id);
              onClose();
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir objetivo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
