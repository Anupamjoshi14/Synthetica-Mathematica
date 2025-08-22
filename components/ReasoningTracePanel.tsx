import React from 'react';
import { SynthesisResult, EleganceLevel } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import ReasoningStepCard from './ReasoningStepCard';

interface ReasoningTracePanelProps {
  result: SynthesisResult | null;
  isLoading: boolean;
  selectedSolutionIndex: number;
  setSelectedSolutionIndex: (index: number) => void;
}

const EleganceBadge = ({ level }: { level: EleganceLevel }) => {
  const { t } = useLanguage();
  const colorMap: Record<EleganceLevel, string> = {
    'High': 'bg-green-500/20 text-green-300 border-green-500/30',
    'Medium': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    'Low': 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return (
    <div className={`px-2 py-1 text-xs font-bold rounded-full border ${colorMap[level]}`}>
      {t.solutionElegance}: {t.eleganceLevel[level]}
    </div>
  );
};


const ReasoningTracePanel = ({ result, isLoading, selectedSolutionIndex, setSelectedSolutionIndex }: ReasoningTracePanelProps) => {
  const { t } = useLanguage();

  const selectedSolution = result?.solutions?.[selectedSolutionIndex];
  const hasMultipleSolutions = result && result.solutions.length > 1;

  return (
    <div className="flex flex-col space-y-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex justify-between items-baseline">
        <h3 className="text-xl font-semibold text-brand-cyan tracking-wide">{t.synthesisOutputTitle}</h3>
        {result && (
          <div className="text-right text-xs text-slate-400">
              <div>Est. Difficulty: <span className="font-semibold text-amber-400">{result.difficulty}</span></div>
              <div>Est. Solve Time: <span className="font-semibold text-amber-400">{result.solveTime.toFixed(2)}s</span></div>
          </div>
        )}
      </div>

      {hasMultipleSolutions && (
        <div className="flex items-center space-x-2 border-b border-slate-700 overflow-x-auto pb-2">
          <span className="text-sm font-semibold text-slate-400 mr-2">{t.solutionMethods}:</span>
          {result.solutions.map((solution, index) => (
            <button
              key={index}
              onClick={() => setSelectedSolutionIndex(index)}
              className={`px-3 py-1.5 text-sm font-bold rounded-md transition-colors duration-200 whitespace-nowrap ${
                selectedSolutionIndex === index
                  ? 'bg-brand-violet text-white shadow-inner'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {solution.methodName}
            </button>
          ))}
        </div>
      )}

      {selectedSolution ? (
        <div className="animate-text-focus-in space-y-6">
          <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold text-slate-200">{selectedSolution.methodName}</h4>
              <EleganceBadge level={selectedSolution.elegance} />
          </div>

          <div>
            <h5 className="text-md font-semibold text-brand-cyan/80 mb-2">{t.formalizationTitle}</h5>
            <div className="p-4 bg-slate-900/70 rounded-md border border-slate-700/50 min-h-[60px]">
              <p className="whitespace-pre-wrap font-mono text-sm text-slate-300">{selectedSolution.formalization}</p>
            </div>
          </div>
          
          <div>
            <h5 className="text-md font-semibold text-brand-cyan/80 mb-3">{t.reasoningTraceTitle}</h5>
            <div className="space-y-4">
              {selectedSolution.reasoningTrace.map((step) => (
                <ReasoningStepCard key={step.id} step={step} />
              ))}
            </div>
          </div>
        </div>
      ) : (
         <div className="p-4 text-center bg-slate-900/70 rounded-md border border-slate-700/50 min-h-[300px] flex items-center justify-center">
            <p className="text-slate-500 italic">
                {isLoading ? t.synthesizingButton : t.reasoningTraceAwaiting}
            </p>
        </div>
      )}
    </div>
  );
};

export default ReasoningTracePanel;