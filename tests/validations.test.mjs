import test from "node:test";
import assert from "node:assert/strict";
import { isValidEmail, validateCandidate, validateVacancy } from "../src/utils/validations.ts";
import { makeCandidate, makeVacancy } from "./fixtures.mjs";

test("isValidEmail acepta formato básico y rechaza entradas inválidas", async (t) => {
  await t.test("email válido", () => assert.equal(isValidEmail("persona@example.test"), true));
  for (const email of ["", "sin-arroba.example.test", "persona@dominio", "a@@b.test", "persona @example.test", null, 42]) {
    await t.test(`rechaza ${String(email)}`, () => assert.equal(isValidEmail(email), false));
  }
});

test("validateCandidate acepta candidato válido y no lo modifica", () => {
  const candidate = makeCandidate("C-VALID");
  const original = structuredClone(candidate);
  assert.deepEqual(validateCandidate(candidate), { valid: true, errors: [] });
  assert.deepEqual(candidate, original);
});

test("validateCandidate cubre experiencia, salarios, skills, teléfono y múltiples errores", async (t) => {
  const cases = [
    ["experiencia negativa", { yearsOfExperience: -1 }, "Los años de experiencia deben estar entre 0 y 50, inclusive."],
    ["experiencia sobre 50", { yearsOfExperience: 51 }, "Los años de experiencia deben estar entre 0 y 50, inclusive."],
    ["salarios en cero", { currentSalary: 0, expectedSalary: 0 }, null],
    ["skills vacío", { skills: [] }, "El candidato debe tener al menos una habilidad."],
    ["teléfono vacío", { phone: "   " }, "El teléfono no debe estar vacío."],
  ];
  for (const [label, changes, expectedError] of cases) {
    await t.test(label, () => {
      const result = validateCandidate(makeCandidate("C-INVALID", changes));
      assert.equal(result.valid, false);
      if (expectedError) assert.ok(result.errors.includes(expectedError));
      else assert.equal(result.errors.filter((error) => error.includes("salario")).length, 2);
    });
  }
  await t.test("varios errores simultáneos", () => {
    const result = validateCandidate(makeCandidate("C-MULTI", { yearsOfExperience: -2, currentSalary: 0, expectedSalary: 0, skills: [], email: "invalido", phone: "" }));
    assert.equal(result.valid, false);
    assert.equal(result.errors.length, 6);
  });
});

test("validateCandidate maneja entradas inválidas en runtime", () => {
  for (const value of [null, undefined, "no es objeto", 12]) {
    const result = validateCandidate(value);
    assert.equal(result.valid, false);
    assert.ok(result.errors.length > 0);
  }
});

test("validateVacancy cubre válida, límites invertidos, skills vacías y no mutación", async (t) => {
  const valid = makeVacancy();
  const original = structuredClone(valid);
  await t.test("vacante válida", () => assert.deepEqual(validateVacancy(valid), { valid: true, errors: [] }));
  assert.deepEqual(valid, original);
  await t.test("experiencia máxima inferior a mínima", () => assert.ok(validateVacancy(makeVacancy({ minYearsExperience: 9, maxYearsExperience: 8 })).errors.includes("La experiencia máxima debe ser mayor o igual a la mínima.")));
  await t.test("salario máximo inferior al mínimo", () => assert.ok(validateVacancy(makeVacancy({ salaryRangeMin: 80000, salaryRangeMax: 70000 })).errors.includes("El salario máximo debe ser mayor o igual al mínimo.")));
  await t.test("habilidades requeridas vacías", () => assert.ok(validateVacancy(makeVacancy({ requiredSkills: [] })).errors.includes("La vacante debe requerir al menos una habilidad.")));
});

test("validateVacancy rechaza entradas inválidas en runtime", () => {
  for (const value of [null, undefined, "vacante", false]) {
    assert.equal(validateVacancy(value).valid, false);
  }
});
