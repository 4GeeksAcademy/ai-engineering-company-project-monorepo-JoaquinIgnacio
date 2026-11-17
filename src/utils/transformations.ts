import type {
  CandidateStatus,
  Candidate,
  EnglishLevel,
  ProcessStage,
  SelectionProcess,
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

/** Groups candidates by seniority, including empty arrays for every official level. */
export function groupCandidatesBySeniority(
  candidates: Candidate[],
): Record<SeniorityLevel, Candidate[]> {
  const emptyGroups: Record<SeniorityLevel, Candidate[]> = {
    Junior: [],
    "Semi-Senior": [],
    Senior: [],
    Lead: [],
    Executive: [],
  };

  return candidates.reduce((groups, candidate) => {
    groups[candidate.seniority].push(candidate);
    return groups;
  }, emptyGroups);
}

/** Counts candidates in each status, returning zero for statuses with no matches. */
export function countCandidatesByStatus(
  candidates: Candidate[],
): Record<CandidateStatus, number> {
  const initialCounts: Record<CandidateStatus, number> = {
    Active: 0,
    "In process": 0,
    Hired: 0,
    Inactive: 0,
  };

  return candidates.reduce((counts, candidate) => {
    counts[candidate.status] += 1;
    return counts;
  }, initialCounts);
}

/**
 * Returns the average expected salary rounded to two decimals. An empty list
 * returns 0 as a technical convention because the briefing leaves that case undefined.
 */
export function calculateAverageSalary(candidates: Candidate[]): number {
  if (candidates.length === 0) {
    return 0;
  }

  const totalExpectedSalary = candidates.reduce(
    (total, candidate) => total + candidate.expectedSalary,
    0,
  );
  const averageExpectedSalary = totalExpectedSalary / candidates.length;

  return Number(averageExpectedSalary.toFixed(2));
}

/**
 * Counts distinct skills per candidate, ignoring case. The first spelling seen
 * is kept for display, and equal counts are ordered alphabetically by normalized name.
 */
export function findTopSkills(
  candidates: Candidate[],
  topN: number,
): { skill: string; count: number }[] {
  if (candidates.length === 0 || topN <= 0) {
    return [];
  }

  const skillCounts = candidates.reduce((counts, candidate) => {
    const seenForCandidate = new Set<string>();

    candidate.skills.forEach((skill) => {
      const normalizedSkill = skill.toLowerCase();
      if (seenForCandidate.has(normalizedSkill)) {
        return;
      }

      seenForCandidate.add(normalizedSkill);
      const current = counts.get(normalizedSkill);
      if (current) {
        current.count += 1;
      } else {
        counts.set(normalizedSkill, { skill, count: 1 });
      }
    });

    return counts;
  }, new Map<string, { skill: string; count: number }>());

  return [...skillCounts.entries()]
    .sort(([skillA, valueA], [skillB, valueB]) => {
      if (valueB.count !== valueA.count) {
        return valueB.count - valueA.count;
      }
      return skillA < skillB ? -1 : skillA > skillB ? 1 : 0;
    })
    .slice(0, topN)
    .map(([, value]) => ({ ...value }));
}

/**
 * Calculates the percentage of processes whose stage is exactly "Hired".
 * An empty process list returns 0 because the briefing does not define that case.
 */
export function calculateVacancyFillRate(
  processes: SelectionProcess[],
): number {
  if (processes.length === 0) {
    return 0;
  }

  const hiredStage: ProcessStage = "Hired";
  const hiredProcesses = processes.filter(
    (process) => process.stage === hiredStage,
  ).length;
  const fillRate = (hiredProcesses / processes.length) * 100;

  return Number(fillRate.toFixed(2));
}
