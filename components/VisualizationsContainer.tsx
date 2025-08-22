import React, { useState } from 'react';
import { SynthesisResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import VisualizationPanel from './VisualizationPanel';
import GeometricVisualizer from './GeometricVisualizer';

interface VisualizationsContainerProps {
  result: SynthesisResult | null;
  selectedSolutionIndex: number;
}

type Tab = 'graph' | 'diagram';

const VisualizationsContainer = ({ result, selectedSolutionIndex }: VisualizationsContainerProps) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('diagram');

  const selectedSolution = result?.solutions?.[selectedSolutionIndex];

  if (!result || !selectedSolution) {
    return null; // Don't render if no result
  }

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 flex flex-col min-h-[450px]">
      <div className="flex-shrink-0 flex items-center space-x-2 border-b border-slate-700 mb-4">
        <TabButton
          label={t.visualizationTabDiagram}
          isActive={activeTab === 'diagram'}
          onClick={() => setActiveTab('diagram')}
        />
        <TabButton
          label={t.visualizationTabGraph}
          isActive={activeTab === 'graph'}
          onClick={() => setActiveTab('graph')}
        />
      </div>
      <div className="flex-grow">
        {activeTab === 'diagram' && (
          <GeometricVisualizer svgString={selectedSolution.geometricVisualization} />
        )}
        {activeTab === 'graph' && (
          <VisualizationPanel
            reasoningTrace={selectedSolution.reasoningTrace}
            result={result}
          />
        )}
      </div>
    </div>
  );
};

const TabButton = ({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    role="tab"
    aria-selected={isActive}
    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors duration-200 ${
      isActive
        ? 'border-brand-cyan text-brand-cyan'
        : 'border-transparent text-slate-400 hover:text-white'
    }`}
  >
    {label}
  </button>
);

export default VisualizationsContainer;
