import React from 'react';
import { GeneratedProblem } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface GeneratedProblemPanelProps {
  problem: GeneratedProblem;
  onSolve: (problem: GeneratedProblem) => void;
}

const GeneratedProblemPanel = ({ problem, onSolve }: GeneratedProblemPanelProps) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-4 p-6 bg-slate-800/50 rounded-lg border border-slate-700/50 animate-text-focus-in">
      <h3 className="text-xl font-semibold text-brand-cyan mb-2 tracking-wide">{t.generatedProblemTitle}</h3>
      
      <div className="p-4 bg-slate-900/70 rounded-md border border-slate-700/50">
        <p className="whitespace-pre-wrap font-mono text-base text-slate-200">{problem.problem}</p>
      </div>

      <div className="flex justify-between items-center text-sm text-slate-400">
        <span>{t.difficultyLabel}: <span className="font-semibold text-amber-400">{t.difficultyNames[problem.difficulty]}</span></span>
        <span>{t.domainLabel}: <span className="font-semibold text-amber-400">{t.subjectNames[problem.subject]}</span></span>
      </div>

      <button
        onClick={() => onSolve(problem)}
        className="w-full flex items-center justify-center space-x-2 bg-brand-violet hover:bg-violet-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-100 shadow-lg shadow-violet-500/20"
      >
        <span>{t.solveThisProblemButton}</span>
      </button>
    </div>
  );
};

export default GeneratedProblemPanel;
