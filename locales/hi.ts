import { IMOSubject, ProblemDifficulty, EleganceLevel } from '../types';

export const hi = {
  headerTitle: 'सिंथेटिका मैथमेटिका',
  headerSubtitle: 'IMO-स्तरीय ज्यामिति',

  modeSolve: 'समस्या हल करें',
  modeGenerate: 'समस्या उत्पन्न करें',
  modeWorkbench: 'कार्यशाला (Workbench)',

  inputLabel: 'एक ज्यामिति समस्या दर्ज करें',
  inputPlaceholder: 'उदा., एक त्रिभुज ABC में BC का मध्यबिंदु M है। सिद्ध करें कि AM < (AB + AC) / 2।',
  domainLabel: 'IMO विषय',
  difficultyLabel: 'समस्या की कठिनाई चुनें',

  generateConceptsLabel: 'मुख्य अवधारणाएँ (वैकल्पिक)',
  generateConceptsPlaceholder: 'उदा., त्रिभुज असमानता, वृत्त',

  synthesizeButton: 'संश्लेषित करें और खोजें',
  synthesizingButton: 'संश्लेषित हो रहा है...',
  generateButton: 'समस्या उत्पन्न करें',
  generatingButton: 'उत्पन्न हो रहा है...',

  statusTitle: 'प्रदर्शन मेट्रिक्स',
  statusConfidence: 'स्वयंसिद्ध विश्वास',
  statusDiscoveryRate: 'खोज दर',
  statusDiscoveryRateHigh: 'उच्च',
  statusDiscoveryRateNominal: 'सामान्य',
  statusThroughput: 'संगणनात्मक थ्रुपुट',
  statusSelfCorrection: 'स्वतः सुधार',
  statusSelfCorrectionActive: 'सक्रिय',
  statusSolveRate: 'IMO समाधान दर',
  statusSolveTime: 'औसत समाधान समय',
  statusProofElegance: 'प्रमाण लालित्य',
  statusEleganceOptimal: 'इष्टतम',

  synthesisFailed: 'संश्लेषण विफल रहा',
  generationFailed: 'समस्या निर्माण विफल',
  
  classicProblemsTitle: 'या, किसी क्लासिक समस्या से शुरू करें:',
  visualizationTabGraph: 'प्रमाण ग्राफ़',
  visualizationTabDiagram: 'ज्यामितीय आरेख',
  visualizationTitle: 'प्रमाण संरचना ग्राफ़',
  visualizationAwaiting: 'प्रमाण संरचना की प्रतीक्षा है...',

  synthesisOutputTitle: 'संश्लेषण आउटपुट',

  formalizationTitle: 'औपचारिकता',
  formalizationAwaiting: 'आउटपुट की प्रतीक्षा है...',
  formalizationSynthesizing: 'औपचारिक निरूपण संश्लेषित हो रहा है...',

  reasoningTraceTitle: 'तर्क का पता',
  reasoningTraceAwaiting: 'तर्क ट्रेस की प्रतीक्षा है...',
  reasoningTraceGenerating: 'तार्किक प्रमाण चरण उत्पन्न हो रहे हैं...',

  stepJustification: 'औचित्य',
  stepDependencies: 'इस पर निर्भर करता है',

  generatedProblemTitle: 'उत्पन्न समस्या',
  solveThisProblemButton: 'इस समस्या को हल करें',

  solutionMethods: 'समाधान के तरीके',
  solutionElegance: 'लालित्य',
  eleganceLevel: {
    High: 'उच्च',
    Medium: 'मध्यम',
    Low: 'कम',
  } as Record<EleganceLevel, string>,

  // Workbench translations
  workbenchTitle: 'सहयोगी प्रमाण कार्यशाला',
  workbenchProblemStatement: 'समस्या विवरण',
  workbenchProofSteps: 'प्रमाण के चरण',
  workbenchStepInputLabel: 'अगला चरण प्रस्तावित करें',
  workbenchStepInputPlaceholder: 'उदा., "बिंदु D को AM पर ऐसे मानें कि..."',
  workbenchAddStepButton: 'जोड़ें और सत्यापित करें',
  workbenchVerifyingButton: 'सत्यापित हो रहा है...',
  workbenchAwaitingInput: 'आपके पहले चरण की प्रतीक्षा है...',
  workbenchAIFeedback: 'AI फ़ीडबैक',
  workbenchAISuggestions: 'AI सुझाव',

  subjectNames: {
    [IMOSubject.Geometry]: 'ज्यामिति',
    [IMOSubject.NumberTheory]: 'संख्या सिद्धांत',
    [IMOSubject.Algebra]: 'बीजगणित',
    [IMOSubject.Combinatorics]: 'कॉम्बिनेटरिक्स',
  } as Record<IMOSubject, string>,
  difficultyNames: {
    [ProblemDifficulty.HighSchool]: 'हाई स्कूल',
    [ProblemDifficulty.Undergraduate]: 'स्नातक',
    [ProblemDifficulty.IMO]: 'IMO स्तर',
    [ProblemDifficulty.GrandChallenge]: 'ग्रैंड चैलेंज',
  } as Record<ProblemDifficulty, string>,
};