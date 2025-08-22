import React from 'react';
import { ReasoningStep, StepType } from '../types';
import { AxiomIcon, ConclusionIcon, DeductionIcon, HypothesisIcon, LemmaIcon } from './icons/StepIcons';
import { useLanguage } from '../contexts/LanguageContext';

const stepTypeToIcon: Record<StepType, React.ReactNode> = {
  Hypothesis: <HypothesisIcon />,
  Axiom: <AxiomIcon />,
  Lemma: <LemmaIcon />,
  Deduction: <DeductionIcon />,
  Conclusion: <ConclusionIcon />,
};

const stepTypeToColor: Record<StepType, string> = {
    Hypothesis: 'text-fuchsia-400',
    Axiom: 'text-amber-400',
    Lemma: 'text-green-400',
    Deduction: 'text-sky-400',
    Conclusion: 'text-brand-cyan',
};

const ReasoningStepCard = ({ step }: { step: ReasoningStep }) => {
    const { t } = useLanguage();
    return (
        <div className="flex items-start space-x-4 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50 transition-colors duration-300 hover:border-slate-500">
            <div className={`flex flex-col items-center space-y-2 ${stepTypeToColor[step.type]}`}>
            <div className="w-8 h-8">{stepTypeToIcon[step.type]}</div>
            <span className="font-bold text-lg">{step.id}</span>
            </div>
            <div className="flex-1">
            <div className="flex justify-between items-baseline">
                <h4 className={`text-lg font-bold tracking-wide ${stepTypeToColor[step.type]}`}>{step.type}</h4>
            </div>
            <p className="mt-1 font-mono text-slate-200">{step.statement}</p>
            <p className="mt-3 text-sm text-slate-400 italic">
                <span className="font-semibold not-italic">{t.stepJustification}:</span> {step.justification}
            </p>
            {step.dependencies && step.dependencies.length > 0 && (
                <p className="mt-2 text-xs text-slate-500">
                {t.stepDependencies}: {step.dependencies.join(', ')}
                </p>
            )}
            </div>
        </div>
    );
};

export default ReasoningStepCard;
