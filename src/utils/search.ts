import type { Candidate } from "../types/models";

/** Finds the first candidate with an exact ID match using a linear search. */
export function findCandidateById(
  candidates: Candidate[],
  id: string,
): Candidate | null {
  for (let index = 0; index < candidates.length; index += 1) {
    if (candidates[index].id === id) {
      return candidates[index];
    }
  }

  return null;
}

/** Finds the first candidate with a case-insensitive email match. */
export function findCandidateByEmail(
  candidates: Candidate[],
  email: string,
): Candidate | null {
  const normalizedEmail = email.toLowerCase();

  for (let index = 0; index < candidates.length; index += 1) {
    if (candidates[index].email.toLowerCase() === normalizedEmail) {
      return candidates[index];
    }
  }

  return null;
}

/**
 * Finds a candidate's index by expected salary in an array sorted ascending.
 * Binary search requires this ordering to discard half the search range safely.
 */
export function binarySearchCandidateBySalary(
  sortedCandidates: Candidate[],
  targetSalary: number,
): number {
  let left = 0;
  let right = sortedCandidates.length - 1;

  while (left <= right) {
    const middle = Math.floor((left + right) / 2);
    const middleSalary = sortedCandidates[middle].expectedSalary;

    if (middleSalary === targetSalary) {
      return middle;
    }

    if (middleSalary < targetSalary) {
      left = middle + 1;
    } else {
      right = middle - 1;
    }
  }

  return -1;
}
