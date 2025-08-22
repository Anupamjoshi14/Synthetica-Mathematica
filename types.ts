export type Language = 'en' | 'hi';
export type AppMode = 'solve' | 'generate' | 'workbench';

export enum IMOSubject {
  Geometry = 'Geometry',
  NumberTheory = 'Number Theory',
  Algebra = 'Algebra',
  Combinatorics = 'Combinatorics',
}

export enum ProblemDifficulty {
  HighSchool = 'High School',
  Undergraduate = 'Undergraduate',
  IMO = 'IMO Level',
  GrandChallenge = 'Grand Challenge',
}

export interface GeneratedProblem {
  problem: string;
  subject: IMOSubject;
  difficulty: ProblemDifficulty;
}

// For the reasoning trace
export type StepType = 'Hypothesis' | 'Axiom' | 'Lemma' | 'Deduction' | 'Conclusion';

export interface ReasoningStep {
  id: string; // e.g., "S1", "L1"
  type: StepType;
  statement: string;
  justification: string;
  dependencies: string[]; // IDs of previous steps
}

// For the high-level concept interconnection graph
export interface Interconnection {
  source: string;
  target: string;
}

export type EleganceLevel = 'High' | 'Medium' | 'Low';

export interface Solution {
  methodName: string;
  elegance: EleganceLevel;
  formalization: string;
  reasoningTrace: ReasoningStep[];
  geometricVisualization: string; // SVG string for the diagram
}

// The full structured response from the AI in "Solve" mode
export interface SynthesisResult {
  solutions: Solution[];
  interconnections: Interconnection[];
  difficulty: ProblemDifficulty;
  solveTime: number; // in seconds
  subject: IMOSubject;
}

// The response from the AI in "Workbench" mode
export interface VerificationResult {
  isValid: boolean;
  feedback: string;
  formalizedStep: ReasoningStep | null; // Null if invalid
  suggestions: string[];
}


// For graph visualization
export interface NodeData {
  id:string;
  x: number;
  y: number;
  label: string;
  type: StepType | 'concept'; // For styling
}

export interface EdgeData {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: NodeData[];
  edges: EdgeData[];
}