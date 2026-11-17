import test from "node:test";
import assert from "node:assert/strict";
import { calculateAverageSalary, calculateCandidateScore, calculateVacancyFillRate, countCandidatesByStatus, findTopSkills, groupCandidatesBySeniority, rankCandidatesForVacancy } from "../src/utils/transformations.ts";
import { makeCandidate, makeProcess, makeVacancy } from "./fixtures.mjs";

test("calculateCandidateScore comprueba cada componente con valores numéricos exactos", async (t) => {
  const vacancy = makeVacancy({ requiredSkills: ["TypeScript"], preferredSkills: ["React"], minYearsExperience: 5, maxYearsExperience: 7, requiredEnglishLevel: "B2", requiredSeniority: "Senior", salaryRangeMin: 50000, salaryRangeMax: 60000 });
  const base = makeCandidate("SCORE", { skills: [], yearsOfExperience: 20, seniority: "Junior", englishLevel: "A1", expectedSalary: 30000 });
  const scoreWith = (changes) => calculateCandidateScore({ ...base, ...changes }, vacancy);
  await t.test("habilidades requeridas: 40 exacto, 20 con coincidencia parcial y 0 sin match", () => {
    assert.equal(scoreWith({ skills: ["TypeScript"] }), 40);
    assert.equal(calculateCandidateScore({ ...base, skills: ["TypeScript"] }, makeVacancy({ requiredSkills: ["TypeScript", "Node.js"] , preferredSkills: [], minYearsExperience: 100, maxYearsExperience: 110, requiredEnglishLevel: "Native", requiredSeniority: "Executive" })), 20);
    assert.equal(scoreWith({ skills: ["Other"] }), 0);
  });
  await t.test("habilidades preferidas: 10 por match hasta 20", () => {
    assert.equal(calculateCandidateScore({ ...base, skills: ["React"] }, makeVacancy({ requiredSkills: ["Missing"], preferredSkills: ["React"], minYearsExperience: 100, maxYearsExperience: 110, requiredEnglishLevel: "Native", requiredSeniority: "Executive" })), 10);
    assert.equal(calculateCandidateScore({ ...base, skills: ["React", "Docker", "AWS"] }, makeVacancy({ requiredSkills: ["Missing"], preferredSkills: ["React", "Docker", "AWS"], minYearsExperience: 100, maxYearsExperience: 110, requiredEnglishLevel: "Native", requiredSeniority: "Executive" })), 20);
  });
  await t.test("experiencia: 20 en rango, 10 a distancia 2, 0 fuera", () => {
    assert.equal(scoreWith({ yearsOfExperience: 5 }), 20);
    assert.equal(scoreWith({ yearsOfExperience: 3 }), 10);
    assert.equal(scoreWith({ yearsOfExperience: 2 }), 0);
  });
  await t.test("seniority: 15 igual, 7 adyacente, 0 distante", () => {
    assert.equal(scoreWith({ seniority: "Senior" }), 15);
    assert.equal(scoreWith({ seniority: "Lead" }), 7);
    assert.equal(scoreWith({ seniority: "Junior" }), 0);
  });
  await t.test("inglés: 15 al nivel requerido o superior, 0 inferior", () => {
    assert.equal(scoreWith({ englishLevel: "B2" }), 15);
    assert.equal(scoreWith({ englishLevel: "C1" }), 15);
    assert.equal(scoreWith({ englishLevel: "B1" }), 0);
  });
  await t.test("salario: 10 dentro, 5 hasta 20% sobre el máximo, 0 fuera", () => {
    assert.equal(scoreWith({ expectedSalary: 55000 }), 10);
    assert.equal(scoreWith({ expectedSalary: 72000 }), 5);
    assert.equal(scoreWith({ expectedSalary: 72001 }), 0);
  });
});

test("scoring cubre cero, resultado intermedio, máximo y tope 100", async (t) => {
  await t.test("cero", () => assert.equal(calculateCandidateScore(makeCandidate("ZERO", { skills: [], yearsOfExperience: 20, seniority: "Junior", englishLevel: "A1", expectedSalary: 30000 }), makeVacancy({ requiredSkills: ["Missing"], preferredSkills: [], minYearsExperience: 2, maxYearsExperience: 5, requiredEnglishLevel: "C1", requiredSeniority: "Executive", salaryRangeMin: 50000, salaryRangeMax: 60000 })), 0));
  await t.test("resultado intermedio exacto", () => assert.equal(calculateCandidateScore(makeCandidate("MID", { skills: ["TypeScript"], yearsOfExperience: 5, seniority: "Senior", englishLevel: "B2", expectedSalary: 50000 }), makeVacancy({ requiredSkills: ["TypeScript", "Node.js"], preferredSkills: [], minYearsExperience: 4, maxYearsExperience: 7, requiredEnglishLevel: "B2", requiredSeniority: "Senior", salaryRangeMin: 45000, salaryRangeMax: 70000 })), 80));
  await t.test("máximo bruto 100", () => assert.equal(calculateCandidateScore(makeCandidate("MAX", { skills: ["TypeScript", "React"], yearsOfExperience: 5, seniority: "Senior", englishLevel: "B2", expectedSalary: 55000 }), makeVacancy({ requiredSkills: ["TypeScript"], preferredSkills: ["React"], minYearsExperience: 4, maxYearsExperience: 7, requiredEnglishLevel: "B2", requiredSeniority: "Senior", salaryRangeMin: 45000, salaryRangeMax: 70000 })), 100));
  await t.test("total bruto superior permanece limitado a 100", () => assert.equal(calculateCandidateScore(makeCandidate("CAPPED", { skills: ["TypeScript", "React", "Docker"], yearsOfExperience: 5, seniority: "Senior", englishLevel: "B2", expectedSalary: 55000 }), makeVacancy({ requiredSkills: ["TypeScript"], preferredSkills: ["React", "Docker"], minYearsExperience: 4, maxYearsExperience: 7, requiredEnglishLevel: "B2", requiredSeniority: "Senior", salaryRangeMin: 45000, salaryRangeMax: 70000 })), 100));
});

test("rankCandidatesForVacancy ordena descendentemente, conserva empates y no muta", () => {
  const vacancy = makeVacancy();
  const candidates = [makeCandidate("LOW", { skills: [], yearsOfExperience: 30, seniority: "Junior", englishLevel: "A1", expectedSalary: 10000 }), makeCandidate("TIE-1"), makeCandidate("TIE-2")];
  const before = structuredClone(candidates);
  const ranked = rankCandidatesForVacancy(candidates, vacancy);
  assert.deepEqual(ranked.map((item) => item.score), [80, 80, 0]);
  assert.deepEqual(ranked.map((item) => item.candidate.id), ["TIE-1", "TIE-2", "LOW"]);
  assert.deepEqual(candidates, before);
  assert.deepEqual(rankCandidatesForVacancy([], vacancy), []);
});

test("reportes agrupan por todos los niveles y cuentan todos los estados", () => {
  const candidates = [makeCandidate("J", { seniority: "Junior", status: "Active" }), makeCandidate("S1", { seniority: "Senior", status: "Hired" }), makeCandidate("S2", { seniority: "Senior", status: "Hired" })];
  const groups = groupCandidatesBySeniority(candidates);
  assert.deepEqual(Object.keys(groups).sort(), ["Executive", "Junior", "Lead", "Semi-Senior", "Senior"].sort());
  assert.deepEqual(groups.Junior.map((candidate) => candidate.id), ["J"]);
  assert.deepEqual(groups.Senior.map((candidate) => candidate.id), ["S1", "S2"]);
  assert.deepEqual(groups.Lead, []);
  assert.deepEqual(countCandidatesByStatus(candidates), { Active: 1, "In process": 0, Hired: 2, Inactive: 0 });
  assert.deepEqual(countCandidatesByStatus([]), { Active: 0, "In process": 0, Hired: 0, Inactive: 0 });
});

test("calculateAverageSalary promedia, redondea y maneja lista vacía", () => {
  assert.equal(calculateAverageSalary([makeCandidate("SAL-1", { expectedSalary: 100.111 }), makeCandidate("SAL-2", { expectedSalary: 200.222 })]), 150.17);
  assert.equal(calculateAverageSalary([makeCandidate("SAL-3", { expectedSalary: 10.126 })]), 10.13);
  assert.equal(calculateAverageSalary([]), 0);
});

test("findTopSkills cuenta por frecuencia case-insensitive, deduplica por candidato y resuelve empates", () => {
  const candidates = [makeCandidate("SK-1", { skills: ["Node", "NODE", "React"] }), makeCandidate("SK-2", { skills: ["node", "Python", "React"] })];
  assert.deepEqual(findTopSkills(candidates, 5), [{ skill: "Node", count: 2 }, { skill: "React", count: 2 }, { skill: "Python", count: 1 }]);
  assert.deepEqual(findTopSkills(candidates, 0), []);
  assert.deepEqual(findTopSkills([], 3), []);
});

test("calculateVacancyFillRate cubre cero, parcial, completo, decimal y vacío", () => {
  const processes = [makeProcess("P-1", "C-1"), makeProcess("P-2", "C-2"), makeProcess("P-3", "C-3")];
  assert.equal(calculateVacancyFillRate(processes), 0);
  assert.equal(calculateVacancyFillRate(processes.map((process, index) => ({ ...process, stage: index === 0 ? "Hired" : "Interview" }))), 33.33);
  assert.equal(calculateVacancyFillRate(processes.map((process) => ({ ...process, stage: "Hired" }))), 100);
  assert.equal(calculateVacancyFillRate([]), 0);
});
