import type { Candidate, Vacancy } from "../types/models";

/** Performs a basic email check without attempting production-grade validation. */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string" || email.trim() === "") {
    return false;
  }

  const atIndex = email.indexOf("@");
  const domainDotIndex = email.indexOf(".", atIndex + 1);

  return (
    atIndex > 0 &&
    atIndex === email.lastIndexOf("@") &&
    domainDotIndex > atIndex + 1 &&
    domainDotIndex < email.length - 1 &&
    !/\s/.test(email)
  );
}

/** Validates a candidate against the business rules defined in the Nexova briefing. */
export function validateCandidate(
  candidate: Candidate,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (candidate == null || typeof candidate !== "object") {
    return { valid: false, errors: ["El candidato es obligatorio y debe ser un objeto válido."] };
  }

  if (
    !Number.isFinite(candidate.yearsOfExperience) ||
    candidate.yearsOfExperience < 0 ||
    candidate.yearsOfExperience > 50
  ) {
    errors.push("Los años de experiencia deben estar entre 0 y 50, inclusive.");
  }

  if (!Number.isFinite(candidate.currentSalary) || candidate.currentSalary <= 0) {
    errors.push("El salario actual debe ser un número mayor que 0.");
  }

  if (!Number.isFinite(candidate.expectedSalary) || candidate.expectedSalary <= 0) {
    errors.push("El salario esperado debe ser un número mayor que 0.");
  }

  if (!Array.isArray(candidate.skills) || candidate.skills.length < 1) {
    errors.push("El candidato debe tener al menos una habilidad.");
  }

  if (!isValidEmail(candidate.email)) {
    errors.push("El correo electrónico no tiene un formato válido.");
  }

  if (typeof candidate.phone !== "string" || candidate.phone.trim() === "") {
    errors.push("El teléfono no debe estar vacío.");
  }

  return { valid: errors.length === 0, errors };
}

/** Validates a vacancy against the business rules defined in the Nexova briefing. */
export function validateVacancy(
  vacancy: Vacancy,
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (vacancy == null || typeof vacancy !== "object") {
    return { valid: false, errors: ["La vacante es obligatoria y debe ser un objeto válido."] };
  }

  if (!Array.isArray(vacancy.requiredSkills) || vacancy.requiredSkills.length < 1) {
    errors.push("La vacante debe requerir al menos una habilidad.");
  }

  if (!Number.isFinite(vacancy.minYearsExperience) || vacancy.minYearsExperience < 0) {
    errors.push("La experiencia mínima debe ser un número mayor o igual a 0.");
  }

  if (
    !Number.isFinite(vacancy.maxYearsExperience) ||
    !Number.isFinite(vacancy.minYearsExperience) ||
    vacancy.maxYearsExperience < vacancy.minYearsExperience
  ) {
    errors.push("La experiencia máxima debe ser mayor o igual a la mínima.");
  }

  if (!Number.isFinite(vacancy.salaryRangeMin) || vacancy.salaryRangeMin <= 0) {
    errors.push("El salario mínimo debe ser un número mayor que 0.");
  }

  if (!Number.isFinite(vacancy.salaryRangeMax) || vacancy.salaryRangeMax <= 0) {
    errors.push("El salario máximo debe ser un número mayor que 0.");
  }

  if (
    Number.isFinite(vacancy.salaryRangeMin) &&
    Number.isFinite(vacancy.salaryRangeMax) &&
    vacancy.salaryRangeMax < vacancy.salaryRangeMin
  ) {
    errors.push("El salario máximo debe ser mayor o igual al mínimo.");
  }

  return { valid: errors.length === 0, errors };
}
