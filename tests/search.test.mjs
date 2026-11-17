import test from "node:test";
import assert from "node:assert/strict";
import { binarySearchCandidateBySalary, findCandidateByEmail, findCandidateById } from "../src/utils/search.ts";
import { makeCandidate } from "./fixtures.mjs";

const candidates = [
  makeCandidate("C-FIRST", { email: "first@example.test", expectedSalary: 40000 }),
  makeCandidate("C-MIDDLE", { email: "middle@example.test", expectedSalary: 50000 }),
  makeCandidate("C-LAST", { email: "last@example.test", expectedSalary: 70000 }),
];

test("findCandidateById encuentra primer, intermedio y último elemento", () => {
  assert.equal(findCandidateById(candidates, "C-FIRST"), candidates[0]);
  assert.equal(findCandidateById(candidates, "C-MIDDLE"), candidates[1]);
  assert.equal(findCandidateById(candidates, "C-LAST"), candidates[2]);
});
test("findCandidateById devuelve null si falta o la lista está vacía", () => {
  assert.equal(findCandidateById(candidates, "C-MISSING"), null);
  assert.equal(findCandidateById([], "C-FIRST"), null);
});
test("findCandidateByEmail compara exacto e ignorando mayúsculas", async (t) => {
  await t.test("coincidencia exacta", () => assert.equal(findCandidateByEmail(candidates, "middle@example.test"), candidates[1]));
  await t.test("diferencias de mayúsculas", () => assert.equal(findCandidateByEmail(candidates, "MIDDLE@EXAMPLE.TEST"), candidates[1]));
  await t.test("no encontrado", () => assert.equal(findCandidateByEmail(candidates, "absent@example.test"), null));
  await t.test("arreglo vacío", () => assert.equal(findCandidateByEmail([], "first@example.test"), null));
});

test("binarySearchCandidateBySalary busca únicamente en array ascendente", async (t) => {
  await t.test("primer elemento", () => assert.equal(binarySearchCandidateBySalary(candidates, 40000), 0));
  await t.test("elemento central", () => assert.equal(binarySearchCandidateBySalary(candidates, 50000), 1));
  await t.test("último elemento", () => assert.equal(binarySearchCandidateBySalary(candidates, 70000), 2));
  await t.test("salario inexistente", () => assert.equal(binarySearchCandidateBySalary(candidates, 60000), -1));
  await t.test("arreglo vacío", () => assert.equal(binarySearchCandidateBySalary([], 50000), -1));
  await t.test("un único elemento", () => assert.equal(binarySearchCandidateBySalary([candidates[0]], 40000), 0));
  await t.test("salarios duplicados devuelven un índice válido", () => {
    const duplicates = [candidates[0], makeCandidate("C-DUP", { expectedSalary: 40000 }), candidates[1]];
    const index = binarySearchCandidateBySalary(duplicates, 40000);
    assert.ok(index >= 0 && index < duplicates.length);
    assert.equal(duplicates[index].expectedSalary, 40000);
  });
  await t.test("no muta la entrada", () => {
    const before = structuredClone(candidates);
    binarySearchCandidateBySalary(candidates, 50000);
    assert.deepEqual(candidates, before);
  });
});
