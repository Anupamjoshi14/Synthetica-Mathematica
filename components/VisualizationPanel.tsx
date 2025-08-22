import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Customized } from 'recharts';
import { GraphData, NodeData, ReasoningStep, SynthesisResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-slate-800 border border-slate-600 rounded-md shadow-lg text-sm">
        <p className="text-white font-semibold">{data.label}</p>
        <p className="text-slate-400">{data.type}</p>
      </div>
    );
  }
  return null;
};

// Simple rendering of lines between nodes
const EdgeLine = ({ nodes, edges }: GraphData) => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    
    return (
      <g>
        {edges.map((edge, index) => {
          const sourceNode = nodeMap.get(edge.source);
          const targetNode = nodeMap.get(edge.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={`edge-${index}`}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              stroke="rgba(139, 92, 246, 0.4)"
              strokeWidth={1}
            />
          );
        })}
      </g>
    );
};

const NODE_COLORS: Record<string, string> = {
  Hypothesis: '#ec4899', // fuchsia-500
  Axiom: '#f59e0b',      // amber-500
  Lemma: '#22c55e',      // green-500
  Deduction: '#38bdf8',   // sky-400
  Conclusion: '#22d3ee',  // brand-cyan
  default: '#64748b'     // slate-500
};

const VisualizationPanel = ({ reasoningTrace, result }: { reasoningTrace: ReasoningStep[], result: SynthesisResult | null }) => {
  const { t } = useLanguage();

  const graphData = React.useMemo(() => {
    if (!reasoningTrace || reasoningTrace.length === 0) return { nodes: [], edges: [] };

    // A simple topological sort and layout algorithm
    const nodes: NodeData[] = [];
    const edges: any[] = [];
    const nodeMap = new Map<string, ReasoningStep>(reasoningTrace.map(s => [s.id, s]));

    const levels: Map<string, number> = new Map();
    
    function calculateLevel(nodeId: string): number {
        if (levels.has(nodeId)) return levels.get(nodeId)!;
        
        const node = nodeMap.get(nodeId);
        if (!node || node.dependencies.length === 0) {
            levels.set(nodeId, 0);
            return 0;
        }

        const maxDepLevel = Math.max(...node.dependencies.map(depId => calculateLevel(depId)));
        const level = maxDepLevel + 1;
        levels.set(nodeId, level);
        return level;
    }

    reasoningTrace.forEach(step => calculateLevel(step.id));

    const nodesByLevel: { [level: number]: string[] } = {};
    levels.forEach((level, nodeId) => {
        if (!nodesByLevel[level]) nodesByLevel[level] = [];
        nodesByLevel[level].push(nodeId);
    });

    const yGap = 100;
    const xGap = 100;
    const chartWidth = 500; // Assumed width

    Object.keys(nodesByLevel).forEach(levelStr => {
        const level = parseInt(levelStr, 10);
        const nodesInLevel = nodesByLevel[level];
        const levelWidth = (nodesInLevel.length - 1) * xGap;
        const startX = (chartWidth - levelWidth) / 2;

        nodesInLevel.forEach((nodeId, i) => {
            const step = nodeMap.get(nodeId)!;
            nodes.push({
                id: step.id,
                x: startX + i * xGap,
                y: level * yGap,
                label: `${step.type} (${step.id})`,
                type: step.type,
            });
            step.dependencies.forEach(depId => {
                edges.push({ source: depId, target: step.id });
            });
        });
    });

    return { nodes, edges };
  }, [reasoningTrace]);

  return (
    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 h-full min-h-[400px] flex flex-col">
       <h3 className="text-lg font-semibold text-brand-cyan mb-2 tracking-wide">
        {t.visualizationTitle}
        {result && <span className="ml-2 text-sm text-slate-400 font-normal">({result.difficulty})</span>}
      </h3>
      <div className="flex-grow">
      {graphData.nodes.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <XAxis type="number" dataKey="x" hide />
            <YAxis type="number" dataKey="y" hide reversed/>
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: 'rgba(139, 92, 246, 0.5)' }} />
            <Customized component={() => <EdgeLine {...graphData} />} />
            <Scatter name="Steps" data={graphData.nodes} isAnimationActive={false}>
                {graphData.nodes.map((node) => (
                    <Customized
                        key={node.id}
                        component={({ cx, cy }) => (
                            <circle cx={cx} cy={cy} r={8} fill={NODE_COLORS[node.type] || NODE_COLORS.default} className="transition-all" />
                        )}
                    />
                ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
         ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500 italic">{t.visualizationAwaiting}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VisualizationPanel;