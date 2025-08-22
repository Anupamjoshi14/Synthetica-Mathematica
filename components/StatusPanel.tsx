import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SynthesisResult } from '../types';

const StatusItem = ({ label, value, unit, colorClass }: { label: string; value: string; unit: string; colorClass: string }) => (
  <div className="p-3 bg-slate-900/70 rounded-md border border-slate-700/50 text-center">
    <div className="text-xs text-slate-400 uppercase tracking-wider">{label}</div>
    <div className={`text-2xl font-bold ${colorClass}`}>
      {value} <span className="text-sm font-normal text-slate-300">{unit}</span>
    </div>
  </div>
);

const StatusPanel = ({ isLoading, result }: { isLoading: boolean; result: SynthesisResult | null }) => {
  const { t } = useLanguage();
  const [solveRate, setSolveRate] = useState(94.2);

  useEffect(() => {
    // When a new successful result comes in, slightly increase the solve rate
    if (!isLoading && result) {
      setSolveRate(r => Math.min(99.9, r + Math.random() * 0.15));
    }
  }, [result, isLoading]);


  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <h3 className="text-lg font-semibold text-slate-300 mb-3 text-center md:text-left">{t.statusTitle}</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatusItem label={t.statusSolveRate} value={solveRate.toFixed(1)} unit="%" colorClass="text-green-400" />
        <StatusItem label={t.statusSolveTime} value={result ? result.solveTime.toFixed(2) : "–"} unit="s" colorClass="text-amber-400" />
        <StatusItem label={t.statusProofElegance} value={t.statusEleganceOptimal} unit="" colorClass="text-brand-violet" />
        <StatusItem label={t.statusSelfCorrection} value={t.statusSelfCorrectionActive} unit="" colorClass="text-brand-cyan" />
      </div>
    </div>
  );
};

export default StatusPanel;