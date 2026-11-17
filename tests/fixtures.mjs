export function makeCandidate(id, overrides = {}) {
  return {
    id,
    fullName: `Candidato Ficticio ${id}`,
    email: `${id.toLowerCase()}@example.test`,
    phone: "+34 600 000 000",
    yearsOfExperience: 5,
    skills: ["TypeScript"],
    englishLevel: "B2",
    seniority: "Senior",
    currentSalary: 45000,
    expectedSalary: 50000,
    availability: "Immediate",
    location: "Valencia, España",
    remoteOnly: false,
    status: "Active",
    ...overrides,
  };
}

export function makeVacancy(overrides = {}) {
  return {
    id: "V-TEST-001",
    title: "Ingeniería de software",
    companyName: "Empresa Ficticia",
    requiredSkills: ["TypeScript", "Node.js"],
    preferredSkills: ["React", "Docker"],
    minYearsExperience: 3,
    maxYearsExperience: 8,
    requiredEnglishLevel: "B2",
    requiredSeniority: "Senior",
    salaryRangeMin: 45000,
    salaryRangeMax: 70000,
    isRemote: true,
    location: "Valencia, España",
    status: "Open",
    ...overrides,
  };
}

export function makeProcess(id, candidateId, overrides = {}) {
  const timestamp = new Date("2026-01-01T00:00:00.000Z");
  return {
    id,
    candidateId,
    vacancyId: "V-TEST-001",
    stage: "Screening",
    score: 0,
    notes: "Datos de prueba ficticios",
    createdAt: new Date(timestamp),
    updatedAt: new Date(timestamp),
    ...overrides,
  };
}
