import type {
  Candidate,
  EnglishLevel,
  SeniorityLevel,
  Vacancy,
} from "../types/models";

const SENIORITY_HIERARCHY: readonly SeniorityLevel[] = [
  "Junior",
  "Semi-Senior",
  "Senior",
  "Lead",
  "Executive",
];

const ENGLISH_HIERARCHY: readonly EnglishLevel[] = [
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "Native",
];

/** Returns a set of distinct skill names in lowercase for consistent matching. */
function getNormalizedSkills(skills: string[]): Set<string> {
  return new Set(skills.map((skill) => skill.toLowerCase()));
}

/**
 * Scores a candidate using the briefing's original component weights.
 * Because those weights can total 120 while the briefing states a 0-100 result,
 * the raw total is capped at 100; distinct high-scoring candidates may therefore tie.
 */
export function calculateCandidateScore(
  candidate: Candidate,
  vacancy: Vacancy,
): number {
  const candidateSkills = getNormalizedSkills(candidate.skills);
  const requiredSkills = [...getNormalizedSkills(vacancy.requiredSkills)];
  const preferredSkills = [...getNormalizedSkills(vacancy.preferredSkills)];

  const matchedRequiredCount = requiredSkills.filter((skill) =>
    candidateSkills.has(skill),
  ).length;

  let requiredSkillsScore = 0;
  if (requiredSkills.length > 0) {
    if (matchedRequiredCount === requiredSkills.length) {
      requiredSkillsScore = 40;
    } else if (matchedRequiredCount / requiredSkills.length >= 0.5) {
      requiredSkillsScore = 20;
    }
  }

  const preferredSkillsScore = Math.min(
    20,
    preferredSkills.filter((skill) => candidateSkills.has(skill)).length * 10,
  );

  const isExperienceInRange =
    candidate.yearsOfExperience >= vacancy.minYearsExperience &&
    candidate.yearsOfExperience <= vacancy.maxYearsExperience;
  const distanceFromExperienceRange =
    candidate.yearsOfExperience < vacancy.minYearsExperience
      ? vacancy.minYearsExperience - candidate.yearsOfExperience
      : candidate.yearsOfExperience - vacancy.maxYearsExperience;
  const experienceScore = isExperienceInRange
    ? 20
    : distanceFromExperienceRange <= 2
      ? 10
      : 0;

  const candidateSeniorityIndex = SENIORITY_HIERARCHY.indexOf(candidate.seniority);
  const vacancySeniorityIndex = SENIORITY_HIERARCHY.indexOf(vacancy.requiredSeniority);
  const seniorityDistance = Math.abs(candidateSeniorityIndex - vacancySeniorityIndex);
  const seniorityScore =
    seniorityDistance === 0 ? 15 : seniorityDistance === 1 ? 7 : 0;

  const candidateEnglishIndex = ENGLISH_HIERARCHY.indexOf(candidate.englishLevel);
  const vacancyEnglishIndex = ENGLISH_HIERARCHY.indexOf(vacancy.requiredEnglishLevel);
  const englishScore = candidateEnglishIndex >= vacancyEnglishIndex ? 15 : 0;

  const isSalaryInRange =
    candidate.expectedSalary >= vacancy.salaryRangeMin &&
    candidate.expectedSalary <= vacancy.salaryRangeMax;
  const salaryScore = isSalaryInRange
    ? 10
    : candidate.expectedSalary > vacancy.salaryRangeMax &&
        candidate.expectedSalary <= vacancy.salaryRangeMax * 1.2
      ? 5
      : 0;

  const totalScore =
    requiredSkillsScore +
    preferredSkillsScore +
    experienceScore +
    seniorityScore +
    englishScore +
    salaryScore;

  return Math.min(100, Math.max(0, totalScore));
}

/** Ranks candidates by score without changing the input list or candidate data. */
export function rankCandidatesForVacancy(
  candidates: Candidate[],
  vacancy: Vacancy,
): { candidate: Candidate; score: number }[] {
  return candidates
    .map((candidate, index) => ({
      candidate,
      score: calculateCandidateScore(candidate, vacancy),
      originalIndex: index,
    }))
    .sort(
      (candidateA, candidateB) =>
        candidateB.score - candidateA.score ||
        candidateA.originalIndex - candidateB.originalIndex,
    )
    .map(({ candidate, score }) => ({ candidate, score }));
}
