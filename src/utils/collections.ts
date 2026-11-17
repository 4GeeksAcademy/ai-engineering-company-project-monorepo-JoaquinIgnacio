import type {
  AvailabilityStatus,
  Candidate,
  SeniorityLevel,
} from "../types/models";

type SortOrder = "asc" | "desc";

/** Returns candidates with every required skill, comparing names case-insensitively. */
export function filterCandidatesBySkills(
  candidates: Candidate[],
  requiredSkills: string[],
): Candidate[] {
  // An empty requirements list means there are no skill restrictions.
  return candidates.filter((candidate) =>
    requiredSkills.every((requiredSkill) =>
      candidate.skills.some(
        (candidateSkill) =>
          candidateSkill.toLowerCase() === requiredSkill.toLowerCase(),
      ),
    ),
  );
}

/** Returns candidates whose seniority exactly matches the requested level. */
export function filterCandidatesBySeniority(
  candidates: Candidate[],
  seniority: SeniorityLevel,
): Candidate[] {
  return candidates.filter((candidate) => candidate.seniority === seniority);
}

/** Returns candidates whose availability is one of the selected statuses. */
export function filterCandidatesByAvailability(
  candidates: Candidate[],
  availability: AvailabilityStatus[],
): Candidate[] {
  return candidates.filter((candidate) =>
    availability.includes(candidate.availability),
  );
}

/** Returns a new array sorted by expected salary. */
export function sortCandidatesBySalary(
  candidates: Candidate[],
  order: SortOrder,
): Candidate[] {
  return [...candidates].sort((candidateA, candidateB) =>
    order === "asc"
      ? candidateA.expectedSalary - candidateB.expectedSalary
      : candidateB.expectedSalary - candidateA.expectedSalary,
  );
}

/** Returns a new array sorted by years of professional experience. */
export function sortCandidatesByExperience(
  candidates: Candidate[],
  order: SortOrder,
): Candidate[] {
  return [...candidates].sort((candidateA, candidateB) =>
    order === "asc"
      ? candidateA.yearsOfExperience - candidateB.yearsOfExperience
      : candidateB.yearsOfExperience - candidateA.yearsOfExperience,
  );
}
