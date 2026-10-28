/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  X,
  Target,
  Calendar,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  Hourglass,
} from 'lucide-react';
import { StudyGoal, StudyGoalInput, GoalStatus } from '../types/studyGoal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudyGoalInput) => void;
  goalToEdit: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}) => {
  const isEditing = Boolean(goalToEdit);

  // Estados dos campos
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('pendente');
  const [errors, setErrors] = useState<{ title?: string; deadline?: string }>({});

  // Data mínima sugerida (hoje)
  const todayStr = new Date().toISOString().split('T')[0];

  // Preenche dados ao abrir para edição ou limpa para novo
  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || '');
      setDeadline(goalToEdit.deadline || '');
      setStatus(goalToEdit.status);
    } else {
      setTitle('');
      setDescription('');
      // Sugere por padrão prazo de 3 dias para incentivar agilidade no estudo
      const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setDeadline(defaultDate);
      setStatus('pendente');
    }
    setErrors({});
  }, [goalToEdit, isOpen]);

  // Tecla Escape fecha
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { title?: string; deadline?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Por favor, informe o que você pretende estudar.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres.';
    }

    if (!deadline) {
      newErrors.deadline = 'Por favor, escolha uma data limite para o objetivo.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline,
      status,
    });
    onClose();
  };

  // Atalhos rápidos para seleção de prazo
  const setQuickDeadline = (daysFromNow: number) => {
    const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
    setDeadline(date.toISOString().split('T')[0]);
    if (errors.deadline) {
      setErrors((prev) => ({ ...prev, deadline: undefined }));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
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
        aria-labelledby="goal-form-title"
        className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 my-8 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fechar janela"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cabeçalho */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h2 id="goal-form-title" className="text-xl sm:text-2xl font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditing
                ? 'Atualize as informações ou altere o status de conclusão.'
                : 'Defina uma meta clara para focar no seu aprendizado diário.'}
            </p>
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-sm font-semibold text-slate-800 mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              placeholder="Ex: Aprender laços de repetição (for e while) em JavaScript"
              className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-offset-1 transition-all ${
                errors.title
                  ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                  : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
              }`}
            />
            {errors.title ? (
              <p className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1">
                {errors.title}
              </p>
            ) : (
              <p className="text-xs text-slate-400 mt-1.5">
                Dica: Escolha um tema direto e prático que você consiga concluir.
              </p>
            )}
          </div>

          {/* Campo: Descrição */}
          <div>
            <label
              htmlFor="goal-description"
              className="block text-sm font-semibold text-slate-800 mb-1.5"
            >
              Descrição ou Anotações <span className="text-xs text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir aos vídeos 4 a 7 do curso, resolver os 5 exercícios propostos e anotar dúvidas no caderno."
              className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:ring-offset-1 transition-all resize-none"
            />
          </div>

          {/* Campo: Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-deadline" className="block text-sm font-semibold text-slate-800">
                Prazo de Conclusão <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400 hidden sm:inline">Sugestões:</span>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(0)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer text-[11px]"
                >
                  Hoje
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(2)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer text-[11px]"
                >
                  2 dias
                </button>
                <button
                  type="button"
                  onClick={() => setQuickDeadline(7)}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer text-[11px]"
                >
                  1 semana
                </button>
              </div>
            </div>

            <div className="relative">
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => {
                  setDeadline(e.target.value);
                  if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: undefined }));
                }}
                className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-offset-1 transition-all ${
                  errors.deadline
                    ? 'border-rose-300 focus:ring-rose-500 bg-rose-50/20'
                    : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-500'
                }`}
              />
            </div>
            {errors.deadline && (
              <p className="text-xs text-rose-600 font-medium mt-1.5">{errors.deadline}</p>
            )}
          </div>

          {/* Campo: Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-800 mb-2">
              Status do Objetivo
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Pendente */}
              <button
                type="button"
                onClick={() => setStatus('pendente')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'pendente'
                    ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    status === 'pendente' ? 'bg-amber-500 text-white' : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  <Hourglass className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Pendente</p>
                  <p className="text-[11px] text-slate-500">A iniciar</p>
                </div>
              </button>

              {/* Em Andamento */}
              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'border-blue-500 bg-blue-50/70 ring-2 ring-blue-400/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    status === 'em_andamento' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Em Curso</p>
                  <p className="text-[11px] text-slate-500">Estudando agora</p>
                </div>
              </button>

              {/* Concluído */}
              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-400/50'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                    status === 'concluido' ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Concluído</p>
                  <p className="text-[11px] text-slate-500">Meta batida!</p>
                </div>
              </button>
            </div>
          </div>

          {/* Botões do Rodapé */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 transition-all shadow-md shadow-indigo-100 hover:shadow-indigo-200 cursor-pointer"
            >
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
