import test from "node:test";
import assert from "node:assert/strict";
import { filterCandidatesBySkills, sortCandidatesBySalary } from "../src/utils/collections.ts";
import { findCandidateByEmail } from "../src/utils/search.ts";
import { validateCandidate, validateVacancy } from "../src/utils/validations.ts";
import { calculateAverageSalary, calculateCandidateScore, calculateVacancyFillRate, countCandidatesByStatus, findTopSkills, groupCandidatesBySeniority, rankCandidatesForVacancy } from "../src/utils/transformations.ts";
import { makeCandidate, makeProcess, makeVacancy } from "./fixtures.mjs";

test("integración: valida, filtra, ordena, busca, puntúa, rankea y reporta el flujo de selección", () => {
  const candidates = [
    makeCandidate("C-INT-1", { fullName: "Candidato A Ficticio", email: "a@example.test", skills: ["TypeScript", "Node.js", "React"], yearsOfExperience: 6, seniority: "Senior", englishLevel: "C1", expectedSalary: 60000, status: "Active" }),
    makeCandidate("C-INT-2", { fullName: "Candidato B Ficticio", email: "b@example.test", skills: ["TypeScript", "Node.js"], yearsOfExperience: 4, seniority: "Senior", englishLevel: "B2", expectedSalary: 50000, status: "In process" }),
    makeCandidate("C-INT-3", { fullName: "Candidato C Ficticio", email: "c@example.test", skills: ["Python"], yearsOfExperience: 8, seniority: "Lead", englishLevel: "C1", expectedSalary: 70000, status: "Hired" }),
  ];
  const vacancy = makeVacancy();

  assert.deepEqual(candidates.map((candidate) => validateCandidate(candidate).valid), [true, true, true]);
  assert.equal(validateVacancy(vacancy).valid, true);
  const matching = filterCandidatesBySkills(candidates, vacancy.requiredSkills);
  assert.deepEqual(matching.map((candidate) => candidate.id), ["C-INT-1", "C-INT-2"]);
  const sorted = sortCandidatesBySalary(matching, "asc");
  assert.deepEqual(sorted.map((candidate) => candidate.expectedSalary), [50000, 60000]);
  assert.equal(findCandidateByEmail(sorted, "A@EXAMPLE.TEST").id, "C-INT-1");
  assert.deepEqual(matching.map((candidate) => calculateCandidateScore(candidate, vacancy)), [100, 100]);
  assert.deepEqual(rankCandidatesForVacancy(candidates, vacancy).map((entry) => [entry.candidate.id, entry.score]), [["C-INT-1", 100], ["C-INT-2", 100], ["C-INT-3", 52]]);
  const groups = groupCandidatesBySeniority(candidates);
  assert.deepEqual(groups.Senior.map((candidate) => candidate.id), ["C-INT-1", "C-INT-2"]);
  assert.deepEqual(countCandidatesByStatus(candidates), { Active: 1, "In process": 1, Hired: 1, Inactive: 0 });
  assert.equal(calculateAverageSalary(candidates), 60000);
  assert.deepEqual(findTopSkills(candidates, 2), [{ skill: "Node.js", count: 2 }, { skill: "TypeScript", count: 2 }]);
  assert.equal(calculateVacancyFillRate([makeProcess("P-INT-1", "C-INT-1", { stage: "Hired" }), makeProcess("P-INT-2", "C-INT-2", { stage: "Interview" })]), 50);
});
