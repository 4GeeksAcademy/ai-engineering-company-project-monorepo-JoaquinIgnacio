import test from "node:test";
import assert from "node:assert/strict";
import { filterCandidatesByAvailability, filterCandidatesBySeniority, filterCandidatesBySkills, sortCandidatesByExperience, sortCandidatesBySalary } from "../src/utils/collections.ts";
import { makeCandidate } from "./fixtures.mjs";

const candidates = [
  makeCandidate("C-A", { skills: ["TypeScript", "React"], seniority: "Senior", availability: "Immediate", expectedSalary: 60000, yearsOfExperience: 6 }),
  makeCandidate("C-B", { skills: ["Node.js", "TypeScript"], seniority: "Junior", availability: "2 weeks", expectedSalary: 40000, yearsOfExperience: 2 }),
  makeCandidate("C-C", { skills: ["React", "Node.js"], seniority: "Senior", availability: "Not available", expectedSalary: 40000, yearsOfExperience: 6 }),
];

test("filterCandidatesBySkills requiere todas las habilidades y compara sin distinguir mayúsculas", async (t) => {
  await t.test("todas las habilidades requeridas", () => assert.deepEqual(filterCandidatesBySkills(candidates, ["typescript", "REACT"]).map((candidate) => candidate.id), ["C-A"]));
  await t.test("coincidencia parcial no basta", () => assert.deepEqual(filterCandidatesBySkills(candidates, ["React", "Node.js"]).map((candidate) => candidate.id), ["C-C"]));
  await t.test("lista de requisitos vacía no restringe resultados", () => assert.equal(filterCandidatesBySkills(candidates, []).length, 3));
});

test("filterCandidatesBySeniority es exacto", () => assert.deepEqual(filterCandidatesBySeniority(candidates, "Senior").map((candidate) => candidate.id), ["C-A", "C-C"]));
test("filterCandidatesByAvailability acepta uno o varios estados", async (t) => {
  await t.test("un estado", () => assert.deepEqual(filterCandidatesByAvailability(candidates, ["Immediate"]).map((candidate) => candidate.id), ["C-A"]));
  await t.test("varios estados", () => assert.deepEqual(filterCandidatesByAvailability(candidates, ["2 weeks", "Not available"]).map((candidate) => candidate.id), ["C-B", "C-C"]));
});

test("ordenamiento por salario ascendente y descendente preserva el array original y empates", async (t) => {
  const before = [...candidates];
  await t.test("ascendente", () => assert.deepEqual(sortCandidatesBySalary(candidates, "asc").map((candidate) => candidate.id), ["C-B", "C-C", "C-A"]));
  await t.test("descendente", () => assert.deepEqual(sortCandidatesBySalary(candidates, "desc").map((candidate) => candidate.id), ["C-A", "C-B", "C-C"]));
  assert.deepEqual(candidates, before);
});

test("ordenamiento por experiencia ascendente/descendente y empates", () => {
  assert.deepEqual(sortCandidatesByExperience(candidates, "asc").map((candidate) => candidate.id), ["C-B", "C-A", "C-C"]);
  assert.deepEqual(sortCandidatesByExperience(candidates, "desc").map((candidate) => candidate.id), ["C-A", "C-C", "C-B"]);
});

test("filtros y ordenamientos manejan arreglos vacíos sin mutación", () => {
  assert.deepEqual(filterCandidatesBySkills([], ["TypeScript"]), []);
  assert.deepEqual(filterCandidatesBySeniority([], "Junior"), []);
  assert.deepEqual(filterCandidatesByAvailability([], ["Immediate"]), []);
  assert.deepEqual(sortCandidatesBySalary([], "asc"), []);
  assert.deepEqual(sortCandidatesByExperience([], "desc"), []);
});
