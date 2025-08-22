import React from 'react';
import { IMOSubject, ProblemDifficulty, AppMode } from '../types';
import { IMO_SUBJECTS, DIFFICULTIES, CLASSIC_PROBLEMS } from '../constants';
import SpinnerIcon from './icons/SpinnerIcon';
import { useLanguage } from '../contexts/LanguageContext';

interface InputPanelProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedSubject: IMOSubject;
  setSelectedSubject: (domain: IMOSubject) => void;
  selectedDifficulty: ProblemDifficulty;
  setSelectedDifficulty: (difficulty: ProblemDifficulty) => void;
  isLoading: boolean;
  onSynthesize: () => void;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onGenerate: () => void;
  keyConcepts: string;
  setKeyConcepts: (concepts: string) => void;
  onSelectClassicProblem: (prompt: string) => void;
}

const InputPanel = ({
  prompt,
  setPrompt,
  selectedSubject,
  setSelectedSubject,
  selectedDifficulty,
  setSelectedDifficulty,
  isLoading,
  onSynthesize,
  mode,
  setMode,
  onGenerate,
  keyConcepts,
  setKeyConcepts,
  onSelectClassicProblem,
}: InputPanelProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex w-full bg-slate-900/70 rounded-lg p-1 border border-slate-700">
        <button
          onClick={() => setMode('solve')}
          disabled={isLoading}
          aria-pressed={mode === 'solve'}
          className={`w-1/3 py-2 text-sm font-bold rounded-md transition-colors duration-200 disabled:cursor-not-allowed ${mode === 'solve' ? 'bg-brand-violet text-white shadow-inner' : 'text-slate-300 hover:bg-slate-700'}`}
        >
          {t.modeSolve}
        </button>
        <button
          onClick={() => setMode('generate')}
          disabled={isLoading}
          aria-pressed={mode === 'generate'}
          className={`w-1/3 py-2 text-sm font-bold rounded-md transition-colors duration-200 disabled:cursor-not-allowed ${mode === 'generate' ? 'bg-brand-violet text-white shadow-inner' : 'text-slate-300 hover:bg-slate-700'}`}
        >
          {t.modeGenerate}
        </button>
        <button
          onClick={() => setMode('workbench')}
          disabled={isLoading}
          aria-pressed={mode === 'workbench'}
          className={`w-1/3 py-2 text-sm font-bold rounded-md transition-colors duration-200 disabled:cursor-not-allowed ${mode === 'workbench' ? 'bg-brand-violet text-white shadow-inner' : 'text-slate-300 hover:bg-slate-700'}`}
        >
          {t.modeWorkbench}
        </button>
      </div>

      {mode !== 'generate' && (
        <div>
          <label htmlFor="problem-input" className="block text-sm font-medium text-slate-300 mb-2">
            {t.inputLabel}
          </label>
          <textarea
            id="problem-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.inputPlaceholder}
            className="w-full h-36 p-3 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-shadow duration-200 resize-none"
            disabled={isLoading}
          />
        </div>
      )}

      {mode === 'solve' && (
        <div className="space-y-3 pt-2">
            <h4 className="text-sm font-medium text-slate-300">{t.classicProblemsTitle}</h4>
            <div className="flex flex-wrap gap-2">
            {CLASSIC_PROBLEMS.map(p => (
                <button
                key={p.name}
                onClick={() => onSelectClassicProblem(p.prompt)}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 rounded-full text-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {p.name}
                </button>
            ))}
            </div>
        </div>
      )}

      {mode === 'generate' && (
        <div>
          <label htmlFor="key-concepts-input" className="block text-sm font-medium text-slate-300 mb-2">
            {t.generateConceptsLabel}
          </label>
          <input
            type="text"
            id="key-concepts-input"
            value={keyConcepts}
            onChange={(e) => setKeyConcepts(e.target.value)}
            placeholder={t.generateConceptsPlaceholder}
            className="w-full p-3 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-shadow duration-200"
            disabled={isLoading}
          />
        </div>
      )}


      <div className="space-y-3">
        <div>
          <span className="block text-sm font-medium text-slate-300 mb-2">{t.domainLabel}</span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {IMO_SUBJECTS.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                disabled={isLoading}
                className={`px-3 py-2 text-sm font-semibold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    selectedSubject === subject
                      ? 'bg-brand-cyan text-slate-900 shadow-md shadow-brand-cyan/20'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }
                `}
              >
                {t.subjectNames[subject]}
              </button>
            ))}
          </div>
        </div>
        <div>
           <span className="block text-sm font-medium text-slate-300 mb-2">{t.difficultyLabel}</span>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {DIFFICULTIES.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setSelectedDifficulty(difficulty)}
                disabled={isLoading}
                className={`px-2 py-2 text-xs font-semibold rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  ${
                    selectedDifficulty === difficulty
                      ? 'bg-amber-500 text-slate-900 shadow-md shadow-amber-500/20'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
              >
                {t.difficultyNames[difficulty]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode !== 'workbench' && (
        <button
            onClick={mode === 'solve' ? onSynthesize : onGenerate}
            disabled={isLoading || (mode === 'solve' && !prompt)}
            className="w-full flex items-center justify-center space-x-2 bg-brand-violet hover:bg-violet-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-100 shadow-lg shadow-violet-500/20"
        >
            {isLoading ? (
            <>
                <SpinnerIcon className="w-5 h-5" />
                <span>{mode === 'solve' ? t.synthesizingButton : t.generatingButton}</span>
            </>
            ) : (
            <span>{mode === 'solve' ? t.synthesizeButton : t.generateButton}</span>
            )}
        </button>
      )}
    </div>
  );
};

export default InputPanel;