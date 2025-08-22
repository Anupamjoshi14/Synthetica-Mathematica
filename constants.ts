import { IMOSubject, ProblemDifficulty } from './types';

export const IMO_SUBJECTS: IMOSubject[] = [
  IMOSubject.Geometry,
  IMOSubject.NumberTheory,
  IMOSubject.Algebra,
  IMOSubject.Combinatorics,
];

export const DIFFICULTIES: ProblemDifficulty[] = [
  ProblemDifficulty.HighSchool,
  ProblemDifficulty.Undergraduate,
  ProblemDifficulty.IMO,
  ProblemDifficulty.GrandChallenge,
];


export const PRESET_PROMPT = `Let M be the midpoint of side BC in a triangle ABC. Prove that AM < (AB + AC) / 2.`;

export const CLASSIC_PROBLEMS = [
  { name: "Triangle Inequality on Median", prompt: PRESET_PROMPT },
  { name: "Ptolemy's Theorem", prompt: "For a cyclic quadrilateral ABCD, prove that the sum of the products of opposite sides equals the product of the diagonals: AB * CD + BC * DA = AC * BD." },
  { name: "Angle Bisector Theorem", prompt: "In a triangle ABC, let the angle bisector of angle A intersect side BC at a point D. Prove that AB/AC = BD/DC." },
  { name: "Ceva's Theorem", prompt: "In a triangle ABC, let lines AD, BE, CF be cevians that intersect at a point P. Prove that (AF/FB) * (BD/DC) * (CE/EA) = 1." }
];
