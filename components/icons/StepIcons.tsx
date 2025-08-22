
import React from 'react';

// A generic icon wrapper
const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const HypothesisIcon = () => <IconWrapper><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 16v-6"/><path d="M12 8h.01"/></IconWrapper>;
export const AxiomIcon = () => <IconWrapper><path d="M12 22V2"/><path d="m7 7-5 5 5 5"/><path d="m17 17 5-5-5-5"/></IconWrapper>;
export const LemmaIcon = () => <IconWrapper><path d="m9 11 4 4L17 7"/><path d="M3 11v-1a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v1a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/></IconWrapper>;
export const DeductionIcon = () => <IconWrapper><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></IconWrapper>;
export const ConclusionIcon = () => <IconWrapper><polyline points="20 6 9 17 4 12"/></IconWrapper>;
