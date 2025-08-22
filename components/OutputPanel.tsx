
import React from 'react';

interface OutputPanelProps {
  formalization: string;
  solution: string;
  isLoading: boolean;
}

const OutputSection = ({ title, content }: { title: string; content: string }) => (
  <div>
    <h3 className="text-lg font-semibold text-brand-cyan mb-2 tracking-wide">{title}</h3>
    <div className="p-4 bg-slate-900/70 rounded-md border border-slate-700/50">
      {content ? (
        <p className="whitespace-pre-wrap font-mono text-sm text-slate-300">{content}</p>
      ) : (
        <p className="text-slate-500 italic">Awaiting output...</p>
      )}
    </div>
  </div>
);

const OutputPanel = ({ formalization, solution, isLoading }: OutputPanelProps) => {
  const displayedFormalization = formalization.replace('## FORMALIZATION', '').trim();
  const displayedSolution = solution.replace('## SOLUTION', '').trim();

  return (
    <div className="flex flex-col space-y-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <OutputSection title="Formalization" content={displayedFormalization} />
      <OutputSection title="Solution / Proof / Hypothesis" content={displayedSolution} />
    </div>
  );
};

export default OutputPanel;
