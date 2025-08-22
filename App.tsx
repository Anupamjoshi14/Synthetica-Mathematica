import React, { useState, useCallback, useEffect } from 'react';
import { IMOSubject, SynthesisResult, Language, ProblemDifficulty, AppMode, GeneratedProblem, ReasoningStep, VerificationResult } from './types';
import { PRESET_PROMPT } from './constants';
import { synthesize, generateProblem, verifyAndSuggestStep } from './services/geminiService';
import Header from './components/Header';
import InputPanel from './components/InputPanel';
import ReasoningTracePanel from './components/ReasoningTracePanel';
import StatusPanel from './components/StatusPanel';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import GeneratedProblemPanel from './components/GeneratedProblemPanel';
import SpinnerIcon from './components/icons/SpinnerIcon';
import WorkbenchPanel from './components/WorkbenchPanel';
import VisualizationsContainer from './components/VisualizationsContainer';

const AppContent = () => {
  const { language, t } = useLanguage();
  const [prompt, setPrompt] = useState<string>(PRESET_PROMPT);
  const [selectedSubject, setSelectedSubject] = useState<IMOSubject>(IMOSubject.Geometry);
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty>(ProblemDifficulty.IMO);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [synthesisResult, setSynthesisResult] = useState<SynthesisResult | null>(null);
  const [generatedProblem, setGeneratedProblem] = useState<GeneratedProblem | null>(null);
  const [selectedSolutionIndex, setSelectedSolutionIndex] = useState<number>(0);

  const [mode, setMode] = useState<AppMode>('solve');
  const [keyConcepts, setKeyConcepts] = useState<string>('');

  // State for Workbench mode
  const [workbenchSteps, setWorkbenchSteps] = useState<ReasoningStep[]>([]);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);


  const handleSolve = useCallback(async () => {
    if (!prompt) return;
    
    setIsLoading(true);
    setError(null);
    setSynthesisResult(null);

    try {
      const result = await synthesize(prompt, selectedSubject, selectedDifficulty, language);
      setSynthesisResult(result);
      setSelectedSolutionIndex(0);
      if (result.subject) {
        setSelectedSubject(result.subject);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
      setSynthesisResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, selectedSubject, selectedDifficulty, language]);

  const handleGenerate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedProblem(null);
    setSynthesisResult(null);

    try {
      const result = await generateProblem(selectedSubject, selectedDifficulty, language, keyConcepts);
      setGeneratedProblem(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during generation.');
      setGeneratedProblem(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSubject, selectedDifficulty, language, keyConcepts]);

  const handleSelectGeneratedProblem = useCallback((problem: GeneratedProblem) => {
    setMode('solve');
    setPrompt(problem.problem);
    setSelectedSubject(problem.subject);
    setSelectedDifficulty(problem.difficulty);
    setGeneratedProblem(null);
    setSynthesisResult(null);
    setError(null);
  }, []);

  const handleAddAndVerifyStep = useCallback(async (newStepText: string) => {
    if (!newStepText) return;
    setIsLoading(true);
    setError(null);
    setVerificationResult(null);

    try {
      const result = await verifyAndSuggestStep(prompt, workbenchSteps, newStepText, language);
      setVerificationResult(result);
      if (result.isValid && result.formalizedStep) {
        setWorkbenchSteps(prevSteps => [...prevSteps, result.formalizedStep!]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during step verification.');
      setVerificationResult(null);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, workbenchSteps, language]);

  const handleSelectClassicProblem = useCallback((problemPrompt: string) => {
    setPrompt(problemPrompt);
    setSynthesisResult(null);
    setGeneratedProblem(null);
    setError(null);
  }, []);


  useEffect(() => {
    setSynthesisResult(null);
    setGeneratedProblem(null);
    setError(null);
    setWorkbenchSteps([]);
    setVerificationResult(null);
  }, [mode, language]);


  return (
    <div className="min-h-screen bg-slate-900 font-sans animate-text-focus-in">
      <Header />
      <main className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 flex flex-col space-y-6">
          <InputPanel
            prompt={prompt}
            setPrompt={setPrompt}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            isLoading={isLoading}
            onSynthesize={handleSolve}
            mode={mode}
            setMode={setMode}
            onGenerate={handleGenerate}
            keyConcepts={keyConcepts}
            setKeyConcepts={setKeyConcepts}
            onSelectClassicProblem={handleSelectClassicProblem}
          />
        </div>

        <div className="lg:col-span-2 flex flex-col space-y-6">
          {mode === 'solve' && <StatusPanel isLoading={isLoading} result={synthesisResult} />}
          
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-300">
                <h3 className="font-bold">{t.synthesisFailed}</h3>
                <p>{error}</p>
            </div>
          )}
          
          {mode === 'solve' && synthesisResult && (
            <VisualizationsContainer 
              result={synthesisResult}
              selectedSolutionIndex={selectedSolutionIndex}
            />
          )}

          {mode === 'solve' && (
            <ReasoningTracePanel
              result={synthesisResult}
              isLoading={isLoading}
              selectedSolutionIndex={selectedSolutionIndex}
              setSelectedSolutionIndex={setSelectedSolutionIndex}
            />
          )}
          
          {mode === 'workbench' && (
            <WorkbenchPanel
              problemStatement={prompt}
              steps={workbenchSteps}
              onAddStep={handleAddAndVerifyStep}
              isLoading={isLoading}
              verificationResult={verificationResult}
            />
          )}

          {mode === 'generate' && isLoading && (
             <div className="flex items-center justify-center h-full p-6 bg-slate-800/50 rounded-lg border border-slate-700/50 min-h-[400px]">
                <div className="text-center">
                    <SpinnerIcon className="w-8 h-8 mx-auto text-brand-cyan" />
                    <p className="mt-4 text-slate-400">{t.generatingButton}</p>
                </div>
            </div>
          )}

          {mode === 'generate' && !isLoading && generatedProblem && (
            <GeneratedProblemPanel 
              problem={generatedProblem}
              onSolve={handleSelectGeneratedProblem}
            />
          )}

        </div>
      </main>
    </div>
  );
};

const App = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);


export default App;