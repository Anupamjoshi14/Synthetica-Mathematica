import React, { useState } from 'react';
import { ReasoningStep, VerificationResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ReasoningStepCard from './ReasoningStepCard';
import SpinnerIcon from './icons/SpinnerIcon';
import { CheckCircleIcon, XCircleIcon } from './icons/FeedbackIcons';

interface WorkbenchPanelProps {
  problemStatement: string;
  steps: ReasoningStep[];
  onAddStep: (newStepText: string) => void;
  isLoading: boolean;
  verificationResult: VerificationResult | null;
}

const WorkbenchPanel = ({ problemStatement, steps, onAddStep, isLoading, verificationResult }: WorkbenchPanelProps) => {
  const { t } = useLanguage();
  const [newStepText, setNewStepText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStepText.trim()) {
      onAddStep(newStepText);
      setNewStepText('');
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    setNewStepText(suggestion);
  };

  return (
    <div className="flex flex-col space-y-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <h3 className="text-xl font-semibold text-brand-cyan tracking-wide">{t.workbenchTitle}</h3>
      
      <div>
        <h4 className="text-md font-semibold text-slate-300 mb-2">{t.workbenchProblemStatement}</h4>
        <div className="p-4 bg-slate-900/70 rounded-md border border-slate-700/50">
          <p className="whitespace-pre-wrap font-mono text-sm text-slate-300">{problemStatement}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-md font-semibold text-slate-300">{t.workbenchProofSteps}</h4>
        {steps.length > 0 ? (
          steps.map(step => <ReasoningStepCard key={step.id} step={step} />)
        ) : (
           !isLoading && !verificationResult && (
            <div className="p-4 text-center bg-slate-900/50 rounded-md border-dashed border-slate-700">
                <p className="text-slate-500 italic">{t.workbenchAwaitingInput}</p>
            </div>
           )
        )}
      </div>

      {verificationResult && (
        <div className={`p-4 rounded-lg border animate-text-focus-in ${verificationResult.isValid ? 'bg-green-900/30 border-green-700' : 'bg-red-900/30 border-red-700'}`}>
          <h5 className={`flex items-center space-x-2 font-bold mb-2 ${verificationResult.isValid ? 'text-green-400' : 'text-red-400'}`}>
            {verificationResult.isValid ? <CheckCircleIcon /> : <XCircleIcon />}
            <span>{t.workbenchAIFeedback}</span>
          </h5>
          <p className="text-sm text-slate-300 mb-3">{verificationResult.feedback}</p>
          {verificationResult.suggestions.length > 0 && (
            <div>
              <h6 className="text-sm font-semibold text-slate-400 mb-2">{t.workbenchAISuggestions}</h6>
              <div className="flex flex-wrap gap-2">
                {verificationResult.suggestions.map((s, i) => (
                  <button key={i} onClick={() => handleSuggestionClick(s)} className="px-2 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded-md text-slate-300 transition-colors">
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="step-input" className="block text-sm font-medium text-slate-300">{t.workbenchStepInputLabel}</label>
        <textarea
          id="step-input"
          value={newStepText}
          onChange={(e) => setNewStepText(e.target.value)}
          placeholder={t.workbenchStepInputPlaceholder}
          className="w-full h-24 p-3 bg-slate-900/70 border border-slate-600 rounded-md focus:ring-2 focus:ring-brand-cyan focus:border-brand-cyan transition-shadow duration-200 resize-none"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newStepText.trim()}
          className="w-full flex items-center justify-center space-x-2 bg-brand-violet hover:bg-violet-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-100 shadow-lg shadow-violet-500/20"
        >
          {isLoading ? (
            <>
              <SpinnerIcon className="w-5 h-5" />
              <span>{t.workbenchVerifyingButton}</span>
            </>
          ) : (
            <span>{t.workbenchAddStepButton}</span>
          )}
        </button>
      </form>
    </div>
  );
};

export default WorkbenchPanel;
