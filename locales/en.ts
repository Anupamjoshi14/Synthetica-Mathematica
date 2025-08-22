import { IMOSubject, ProblemDifficulty, EleganceLevel } from '../types';

export const en = {
  headerTitle: 'Synthetica Mathematica',
  headerSubtitle: 'IMO-Level Geometry',

  modeSolve: 'Solve Problem',
  modeGenerate: 'Generate Problem',
  modeWorkbench: 'Workbench',

  inputLabel: 'Enter a Geometry Problem',
  inputPlaceholder: 'e.g., Let M be the midpoint of side BC in a triangle ABC. Prove that AM < (AB + AC) / 2.',
  domainLabel: 'IMO Subject',
  difficultyLabel: 'Select Problem Difficulty',

  generateConceptsLabel: 'Key Concepts (Optional)',
  generateConceptsPlaceholder: 'e.g., Triangle Inequality, Circles',

  synthesizeButton: 'Synthesize & Discover',
  synthesizingButton: 'Synthesizing...',
  generateButton: 'Generate Problem',
  generatingButton: 'Generating...',

  statusTitle: 'Performance Metrics',
  statusConfidence: 'Axiomatic Confidence',
  statusDiscoveryRate: 'Discovery Rate',
  statusDiscoveryRateHigh: 'High',
  statusDiscoveryRateNominal: 'Nominal',
  statusThroughput: 'Comp. Throughput',
  statusSelfCorrection: 'Self-Correction',
  statusSelfCorrectionActive: 'Active',
  statusSolveRate: 'IMO Solve Rate',
  statusSolveTime: 'Avg. Solve Time',
  statusProofElegance: 'Proof Elegance',
  statusEleganceOptimal: 'Optimal',

  synthesisFailed: 'Synthesis Failed',
  generationFailed: 'Problem Generation Failed',

  classicProblemsTitle: 'Or, start with a classic problem:',
  visualizationTabGraph: 'Proof Graph',
  visualizationTabDiagram: 'Geometric Diagram',
  visualizationTitle: 'Proof Structure Graph',
  visualizationAwaiting: 'Awaiting proof structure...',

  synthesisOutputTitle: 'Synthesis Output',

  formalizationTitle: 'Formalization',
  formalizationAwaiting: 'Awaiting output...',
  formalizationSynthesizing: 'Synthesizing formal representation...',

  reasoningTraceTitle: 'Reasoning Trace',
  reasoningTraceAwaiting: 'Awaiting reasoning trace...',
  reasoningTraceGenerating: 'Generating logical proof steps...',

  stepJustification: 'Justification',
  stepDependencies: 'Depends on',

  generatedProblemTitle: 'Generated Problem',
  solveThisProblemButton: 'Solve This Problem',

  solutionMethods: 'Solution Methods',
  solutionElegance: 'Elegance',
  eleganceLevel: {
    High: 'High',
    Medium: 'Medium',
    Low: 'Low',
  } as Record<EleganceLevel, string>,

  // Workbench translations
  workbenchTitle: 'Collaborative Proof Workbench',
  workbenchProblemStatement: 'Problem Statement',
  workbenchProofSteps: 'Proof Steps',
  workbenchStepInputLabel: 'Propose Next Step',
  workbenchStepInputPlaceholder: 'e.g., "Consider point D on AM such that..."',
  workbenchAddStepButton: 'Add & Verify Step',
  workbenchVerifyingButton: 'Verifying...',
  workbenchAwaitingInput: 'Awaiting your first step...',
  workbenchAIFeedback: 'AI Feedback',
  workbenchAISuggestions: 'AI Suggestions',

  subjectNames: {
    [IMOSubject.Geometry]: 'Geometry',
    [IMOSubject.NumberTheory]: 'Number Theory',
    [IMOSubject.Algebra]: 'Algebra',
    [IMOSubject.Combinatorics]: 'Combinatorics',
  } as Record<IMOSubject, string>,
  difficultyNames: {
    [ProblemDifficulty.HighSchool]: 'High School',
    [ProblemDifficulty.Undergraduate]: 'Undergraduate',
    [ProblemDifficulty.IMO]: 'IMO Level',
    [ProblemDifficulty.GrandChallenge]: 'Grand Challenge',
  } as Record<ProblemDifficulty, string>,
};