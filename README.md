# AI Engineering Company Project — Student Template

[![4Geeks Academy](https://img.shields.io/badge/4Geeks-Academy-blue)](https://4geeksacademy.com)
[![AI Engineering](https://img.shields.io/badge/track-AI%20Engineering-green)](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)

_Base template for transversal projects in the AI Engineering Career Program — 4Geeks Academy._

_Estas instrucciones tambien estan disponibles en [espanol](./README.es.md)._

---

## Purpose

This repository is the **starter template** for transversal projects. You will work on real company scenarios (Brasaland, TrackFlow, Nexova), building deliverables that map to course milestones (Web, Programming, Backend, Telemetry, RAG, Agents, Workflows, Real-time).

- Create a template from this repository.
- Replace the placeholder `CONTEXT.md` with your assigned company context.
- Use `skills/` and the directory-level `README.md` files as working guidance.

---

## How to start

1. **Use this repository as a template** and create your own project repo.
2. **Clone** your repository (or open it in Codespaces).
3. **Replace** `CONTEXT.md` with the full context for your assigned company.
4. **Read this folder guide** and open the `README.md` of the folder you are working in.
5. **Start implementing** in the right folder — do not dump everything in the root.
6. **Document** what you add: each new app, service, agent, or pipeline gets a subfolder + README.

---

## How to think about this monorepo

You are building **one company** across many milestones and projects. Each top-level folder has a **single responsibility** — like a real engineering team repo.

| Layer               | Folders                           | What lives here                                                  |
| ------------------- | --------------------------------- | ---------------------------------------------------------------- |
| **Company context** | `CONTEXT.md`                      | Domain facts, field names, constraints for your assigned company |
| **User-facing**     | `uis/`, `services/`               | Frontends and backends users (or operators) interact with        |
| **Data**            | `data/`                           | Raw files, pipelines, processed datasets, evaluation sets        |
| **AI**              | `agents/`, `skills/`, `mcps/`     | Agents, reusable agent capabilities, MCP tool servers            |
| **Automation**      | `workflows/`                      | n8n flows and cross-system orchestration                         |
| **Reuse**           | `packages/`, `shared/`            | Shared types, SDKs, schemas, templates                           |
| **Operations**      | `infra/`, `scripts/`, `internal/` | Docker, deploy configs, one-off scripts, internal CLIs           |
| **Documentation**   | `docs/`                           | Architecture, decisions, conventions for the whole repo          |

**Rule of thumb:** if it has a UI → `uis/`. If it exposes an API or runs in the background → `services/`. If it moves or transforms data → `data/`. If an AI model does the work → `agents/` (+ `skills/` or `mcps/` as needed).

---

## Current status of the template

> 💡 El repositorio conserva su estructura de monorepo plantilla, y ahora incluye el entregable de lógica TypeScript de Nexova para el **Hito 2: Fundamentos de Programación**. No debe confundirse este módulo de dominio con una aplicación, API o integración empresarial desplegada.
>
> - `CONTEXT.md` contiene el contexto de Nexova; consúltalo como fuente primaria para los hechos de negocio.
> - La raíz incluye `AGENTS.md`, `package.json`, `package-lock.json` y `tsconfig.json`. Los scripts disponibles son `npm run typecheck` y `npm test`.
> - El Hito 2 está organizado bajo `src/` y tiene una suite permanente en `tests/`. Node.js v22.23.5 es la versión observada al documentar este estado; usa la versión indicada por el entorno de trabajo si difiere.
> - `packages/shared/package.json` (`@repo/shared-types`) sigue presente, pero este entregable del Hito 2 no configura un workspace runner ni integra ese paquete.

---

## Folder guide — what goes where

Read the linked `README.md` inside each folder before you start coding there.

### Root files

| Path                         | Purpose                                                                   | What you do here                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [`CONTEXT.md`](./CONTEXT.md) | Single source of truth for your company (Brasaland, TrackFlow, or Nexova) | **First step:** copy your assigned company briefing here so every app, agent, and prompt uses the same domain |
| `docker-compose.yml`         | Local dev orchestration for the whole stack                               | Keep at repo root — wires `services/`, databases, and other containers from one place                         |
| `README.md` / `README.es.md` | This guide                                                                | Orientation — you are here                                                                                    |

### `uis/` — user interfaces

**Purpose:** All frontend applications — anything a human sees and clicks.

**Put here:**

- Public website (`website/`)
- Internal admin / backoffice (`backoffice/`)
- Customer portals, loyalty apps, Streamlit/Gradio tools, dashboards with a UI

**Examples:** corporate landing page, operations backoffice, loyalty portal, telemetry dashboard UI

→ See [`uis/README.md`](./uis/README.md)

### `services/` — centralized company API (FastAPI)

**Purpose:** One **centralized FastAPI backend** for the whole company — a single entry point that keeps complexity low as the project grows.

**Put here:**

- One main FastAPI app (e.g. `api/`) with routers/modules per domain (locations, menus, sales, telemetry, etc.)
- Background workers only when they truly need to run separately from the API

**Recommendation:** avoid splitting into many microservices early. Add endpoints to the same FastAPI app; extract a worker only when necessary.

**Examples:** `/locations`, `/menus`, `/sales/reports`, webhook handlers, scheduled jobs

→ See [`services/README.md`](./services/README.md)

### `data/` — datasets, pipelines, and evaluation

**Purpose:** Everything data-related, from raw files to production-ready tables.

| Subfolder                                       | Purpose                      | What you do here                                                          |
| ----------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------- |
| [`data/raw/`](./data/raw/README.md)             | Untouched source data        | Store dumps, exports, sample CSVs/JSON — document origin and PII rules    |
| [`data/pipelines/`](./data/pipelines/README.md) | ETL/ELT jobs                 | Write ingestion, cleaning, and transformation scripts                     |
| [`data/process/`](./data/process/README.md)     | Clean / intermediate outputs | Save artifacts produced by pipelines (features, aggregates, clean tables) |
| [`data/eval/`](./data/eval/README.md)           | Quality measurement          | Golden sets, RAG/agent eval datasets, experiment metrics                  |

**Flow:** `raw` → `pipelines` → `process` → consumed by `services/`, `uis/`, or `agents/`. Use `eval` to prove quality.

### `agents/` — AI agents

**Purpose:** Autonomous or semi-autonomous AI assistants for the company.

**Put here:**

- One subfolder per agent (e.g. `support-agent/`, `onboarding-agent/`)
- Agent config, prompts, tools wiring, tests
- Start from [`agents/_template/`](./agents/_template/README.md) when creating a new agent

**Examples:** customer support bot, employee onboarding copilot, training assistant

→ See [`agents/README.md`](./agents/README.md)

### `skills/` — reusable agent capabilities

**Purpose:** Packaged instructions + scripts that agents (or you in Cursor) reuse across the repo.

**Put here:**

- Skills for data analysis, code review, scraping, research, etc.
- Each skill = a folder with `SKILL.md`, optional scripts and resources

**Example included:** `skills/data-analysis/` (pandas cleaning script + metrics reference)

→ See [`skills/README.md`](./skills/README.md)

### `mcps/` — Model Context Protocol servers

**Purpose:** Bridge AI models to your systems — databases, APIs, GitHub, custom tools.

**Put here:**

- One subfolder per MCP server (e.g. `database-mcp/`, `github-mcp/`)
- Tool definitions, resources, and server config

**When to use:** when an agent needs live access to data or actions your codebase alone cannot provide

→ See [`mcps/README.md`](./mcps/README.md)

### `workflows/` — automation and orchestration

**Purpose:** Connect systems without writing full apps — scheduled jobs, webhooks, notifications.

**Put here:**

- n8n workflow exports, Make/Zapier configs, or orchestration docs
- Flows that link `services/`, `data/pipelines/`, and `agents/`

**Examples:** new-order → Slack alert, nightly ETL trigger, lead → CRM sync

→ See [`workflows/README.md`](./workflows/README.md)

### `packages/` — shared libraries

**Purpose:** Versionable code reused by multiple apps, agents, or pipelines.

**Put here:**

- Shared TypeScript types (`packages/shared/` → `@repo/shared-types`)
- UI component libraries, API clients, analytics SDKs

**Rule:** if `uis/` and `services/` both need the same interface → extract it here

→ See [`packages/README.md`](./packages/README.md)

### `shared/` — loose shared assets

**Purpose:** Resources that are not a full package — schemas, templates, static assets, short docs.

**Put here:**

- JSON schemas, email templates, OpenAPI specs, design tokens
- Anything reused but too small or non-code for `packages/`

→ See [`shared/README.md`](./shared/README.md)

### `docs/` — cross-cutting documentation

**Purpose:** Architecture and decisions that span the whole company project.

**Put here:**

- System architecture diagrams, ADRs, security/observability guides
- Conventions not tied to one app or agent

→ See [`docs/README.md`](./docs/README.md)

### `infra/` — infrastructure and deployment

**Purpose:** How the company project runs in Docker, cloud, or CI.

**Put here:**

- Dockerfiles, Terraform, K8s manifests, Nginx configs, CI/CD pipelines

**Keep at repo root:** `docker-compose.yml` — orchestrates local dev for `services/`, databases, and other containers from one place.

→ See [`infra/README.md`](./infra/README.md)

### `scripts/` — helper scripts

**Purpose:** Small, repeatable automation — not full apps.

**Put here:**

- Setup scripts, seed data generators, lint wrappers, one-off migrations
- Document each script: what it does, args, and how to run it

**Difference from `internal/`:** scripts are usually single files; `internal/` tools are structured projects with their own deps and tests.

→ See [`scripts/README.md`](./scripts/README.md)

### `internal/` — internal developer tools

**Purpose:** Robust utilities for the engineering team.

**Put here:**

- CLIs, packaged migration tools, prompt evaluators
- Tools with their own `package.json`, tests, and install steps

→ See [`internal/README.md`](./internal/README.md)

---

## Where should I put this?

Quick decision guide:

```text
Does it have buttons and screens?          → uis/
Does it run on a server / API / queue?     → services/
Is it raw or transformed data?             → data/raw/ or data/process/
Does it move data between systems?         → data/pipelines/
Do you measure AI/pipeline quality?        → data/eval/
Is it an AI assistant with a goal?         → agents/
Is it a reusable AI capability/instruction?→ skills/
Does AI need to call external tools/APIs?  → mcps/
Is it n8n / scheduled automation?          → workflows/
Will 2+ folders import the same code?      → packages/
Is it a schema/template/asset, not a lib?  → shared/
Is it architecture or team-wide docs?      → docs/
Is it docker-compose for local dev?        → repo root
Is it Docker / deploy / cloud config?      → infra/
Is it a one-off script?                    → scripts/
Is it a CLI tool with its own package?     → internal/
```

---

## Repository structure (tree)

```text
ai-engineering-company-project-monorepo/
├── README.md / README.es.md   # This guide
├── CONTEXT.md                 # ← Replace with your company briefing
├── docker-compose.yml         # ← Local dev orchestration (repo root)
├── uis/                       # Frontends (website, backoffice, dashboards)
├── services/                  # Centralized FastAPI company API
├── data/
│   ├── raw/                   # Source datasets
│   ├── pipelines/             # ETL/ELT jobs
│   ├── process/               # Clean / intermediate outputs
│   └── eval/                  # Evaluation sets and metrics
├── agents/                    # AI agents (+ _template/ starter)
├── skills/                    # Reusable agent skills
├── mcps/                      # MCP servers for tool access
├── workflows/                 # n8n and automation flows
├── packages/                  # Shared libraries (@repo/shared-types, …)
├── shared/                    # Schemas, templates, loose assets
├── docs/                      # Architecture and cross-cutting docs
├── infra/                     # Docker, Terraform, deployment
├── scripts/                   # Helper scripts
└── internal/                  # Internal CLIs and dev tools
```

---

## Links

- [4Geeks Academy — AI Engineering](https://4geeksacademy.com/es/programas-de-carrera/ingenieria-ia)
- [How to start a coding project](https://4geeks.com/lesson/how-to-start-a-project)

---

## Nexova — Hito 2: Fundamentos de Programación

Esta sección documenta el entregable de lógica de dominio para candidatos y vacantes descrito en el [briefing oficial de Nexova](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/02-coding-fundamentals/nexova-BRIEFING.es.md). Implementa modelos, validación, operaciones de colección, búsquedas, scoring/ranking y agregaciones en TypeScript. Es lógica de programación pura: no incorpora IA, prompting, interfaz, API, persistencia ni integraciones empresariales.

Para hechos y restricciones de negocio, consulta [`CONTEXT.md`](./CONTEXT.md). Los ejemplos y fixtures de pruebas usan datos ficticios. Los datos de candidatos reales son sensibles y no deben copiarse a ejemplos, tests o documentación.

### Tecnologías y requisitos

- **Node.js v22.23.5** fue la versión observada en el entorno al preparar esta documentación; npm observado: **10.9.9**. La versión instalada en otros entornos puede diferir.
- **TypeScript** con `strict: true`, `target: ES2020`, `module: ESNext`, `moduleResolution: Bundler` y `noEmit: true` en [`tsconfig.json`](./tsconfig.json).
- **Node.js `node:test`** y **`node:assert/strict`** para las pruebas; no se añade framework de testing.
- [`package.json`](./package.json) declara `typecheck` y `test`; la única dependencia de desarrollo declarada es TypeScript (`^5.0.0`).
- Las pruebas `.mjs` importan directamente los `.ts` mediante `--experimental-strip-types`, opción disponible en Node 22.

### Estructura implementada para el hito

```text
.
├── AGENTS.md
├── CONTEXT.md
├── README.md                       # Guía general y documentación Nexova Hito 2
├── package.json                    # npm run typecheck y npm test
├── package-lock.json
├── tsconfig.json
├── src/
│   ├── types/
│   │   └── models.ts               # Interfaces y tipos unión del dominio
│   └── utils/
│       ├── collections.ts          # Filtros y ordenamientos
│       ├── search.ts               # Búsqueda lineal y binaria
│       ├── transformations.ts      # Scoring, ranking y reportes
│       └── validations.ts          # Reglas de candidato y vacante
├── tests/
│   ├── fixtures.mjs                # Datos ficticios compartidos
│   ├── validations.test.mjs
│   ├── collections.test.mjs
│   ├── search.test.mjs
│   ├── transformations.test.mjs
│   └── integration.test.mjs
└── memory-bank/
  └── progress.md                 # Registro de trabajo y validaciones
```

El resto de las carpetas de nivel superior conserva las responsabilidades de la plantilla del monorepo; no son módulos funcionales del motor de candidatos por el hecho de aparecer en el árbol.

### Modelos del dominio

[`src/types/models.ts`](./src/types/models.ts) exporta tres interfaces y seis tipos unión:

- `Candidate`: `id`, `fullName`, `email`, `phone`, `yearsOfExperience`, `skills`, `englishLevel`, `seniority`, `currentSalary`, `expectedSalary`, `availability`, `location`, `remoteOnly` y `status`. Los salarios se expresan en USD según el briefing.
- `Vacancy`: `id`, `title`, `companyName`, `requiredSkills`, `preferredSkills`, `minYearsExperience`, `maxYearsExperience`, `requiredEnglishLevel`, `requiredSeniority`, `salaryRangeMin`, `salaryRangeMax`, `isRemote`, `location` y `status`. Los límites salariales se expresan en USD según el briefing.
- `SelectionProcess`: `id`, `candidateId`, `vacancyId`, `stage`, `score`, `notes`, `createdAt` y `updatedAt` (`Date`).
- `EnglishLevel`: `"A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native"`.
- `SeniorityLevel`: `"Junior" | "Semi-Senior" | "Senior" | "Lead" | "Executive"`.
- `AvailabilityStatus`: `"Immediate" | "2 weeks" | "1 month" | "Not available"`.
- `CandidateStatus`: `"Active" | "In process" | "Hired" | "Inactive"`.
- `VacancyStatus`: `"Open" | "In progress" | "Closed" | "On hold"`.
- `ProcessStage`: `"Screening" | "Interview" | "Technical test" | "Final interview" | "Offer" | "Rejected" | "Hired"`.

Los tipos unión restringen los valores aceptados por TypeScript; no sustituyen la validación de datos en tiempo de ejecución.

### API de utilidades

#### Colecciones — `src/utils/collections.ts`

- `filterCandidatesBySkills(candidates, requiredSkills)`: exige todas las habilidades requeridas, sin distinguir mayúsculas/minúsculas. Una lista vacía de requisitos no restringe el resultado.
- `filterCandidatesBySeniority(candidates, seniority)`: coincidencia exacta de nivel.
- `filterCandidatesByAvailability(candidates, availability)`: acepta cualquiera de las disponibilidades indicadas.
- `sortCandidatesBySalary(candidates, order)` y `sortCandidatesByExperience(candidates, order)`: ordenan ascendente (`"asc"`) o descendente (`"desc"`) y devuelven un array nuevo; el salario se refiere a `expectedSalary`.

#### Búsqueda — `src/utils/search.ts`

- `findCandidateById(candidates, id)`: búsqueda lineal por ID exacto; devuelve `Candidate` o `null`.
- `findCandidateByEmail(candidates, email)`: búsqueda lineal por email sin distinguir mayúsculas/minúsculas; devuelve `Candidate` o `null`.
- `binarySearchCandidateBySalary(sortedCandidates, targetSalary)`: búsqueda binaria por `expectedSalary`; **requiere** entrada ya ordenada ascendentemente y devuelve el índice o `-1`. Con salarios duplicados puede devolver cualquier índice coincidente.

#### Scoring, ranking y reportes — `src/utils/transformations.ts`

- `calculateCandidateScore(candidate, vacancy)`: calcula el score conforme a los componentes del briefing:
  - habilidades requeridas: 40 por todas, 20 por al menos la mitad y 0 en otro caso;
  - habilidades preferidas: 10 por habilidad, hasta 20;
  - experiencia: 20 dentro del rango, 10 a distancia de hasta dos años y 0 más lejos;
  - seniority: 15 si coincide, 7 si es adyacente en la jerarquía y 0 si no;
  - inglés: 15 si alcanza o supera el nivel requerido y 0 si no;
  - salario esperado: 10 dentro del rango, 5 hasta 20% sobre el máximo y 0 fuera de esos casos.
- `rankCandidatesForVacancy(candidates, vacancy)`: devuelve `{ candidate, score }[]` por puntuación descendente; en empate conserva el orden original de candidatos.
- `groupCandidatesBySeniority(candidates)`: devuelve `Record<SeniorityLevel, Candidate[]>`, con clave para cada nivel, incluso si su grupo está vacío.
- `countCandidatesByStatus(candidates)`: devuelve `Record<CandidateStatus, number>`, inicializando todos los estados en cero.
- `calculateAverageSalary(candidates)`: media del salario esperado, redondeada a dos decimales.
- `findTopSkills(candidates, topN)`: habilidades por frecuencia descendente; ignora diferencias de mayúsculas y cuenta cada habilidad como máximo una vez por candidato. Preserva la primera grafía observada y desempata alfabéticamente por nombre normalizado.
- `calculateVacancyFillRate(processes)`: porcentaje (0–100) de procesos cuyo `stage` es exactamente `"Hired"`, redondeado a dos decimales.

#### Validación — `src/utils/validations.ts`

- `isValidEmail(email)`: comprobación deliberadamente básica: exige texto no vacío, una sola `@`, un punto después de `@`, contenido en ambos lados y ausencia de espacios. No es una validación de email de nivel producción.
- `validateCandidate(candidate)`: devuelve `{ valid, errors }`; verifica experiencia finita entre 0 y 50 inclusive, salarios finitos mayores que cero, al menos una habilidad, email básico válido y teléfono no vacío.
- `validateVacancy(vacancy)`: devuelve `{ valid, errors }`; verifica al menos una habilidad requerida, experiencia mínima finita no negativa, máxima finita y no menor que la mínima, salarios finitos positivos y máximo no menor que el mínimo.

Las funciones de validación comprueban reglas del ejercicio, no la totalidad del esquema (por ejemplo, no validan cada campo textual opcional o cada valor de unión recibido desde una fuente externa). Conviene validar/esquematizar entradas externas con requisitos de producción específicos antes de utilizarlas.

### Decisiones y límites conocidos

- Los pesos máximos de los componentes del briefing suman **120**, aunque el resultado se describe como 0–100. La implementación conserva los pesos y limita el total final a 100; esto puede crear empates en 100. No es una normalización proporcional de los pesos.
- El ranking usa el índice de entrada como desempate estable.
- El briefing no define el resultado ante entradas vacías para salario promedio y fill rate. Como convención técnica, ambas funciones devuelven `0` para lista vacía.
- La frecuencia de skills se cuenta por candidato, no por repeticiones internas de una misma lista. La primera capitalización se preserva solo para presentación; matching/agrupación de skills es case-insensitive donde se especifica.
- Los ordenamientos no mutan el array recibido. Las funciones de transformación trabajan sobre parámetros y estructuras locales; no guardan estado global de candidatos.
- La búsqueda binaria no comprueba ni ordena la entrada: incumplir su precondición de orden ascendente puede producir un resultado incorrecto.
- Varias funciones de dominio reciben arrays y objetos tipados no nulos. El contrato no promete aceptar `null` como lista; las validaciones de candidato/vacante sí contienen una defensa ante un objeto superior nulo/no objeto en tiempo de ejecución.

### Instalación, comprobaciones y pruebas

Desde la raíz del repositorio, con Node.js y npm disponibles:

```bash
npm ci
npm run typecheck
npm test
```

`npm ci` instala las dependencias fijadas por `package-lock.json`. `npm run typecheck` ejecuta `tsc --noEmit`; `npm test` ejecuta la suite con el runner integrado de Node. Las pruebas cubren validaciones, filtros/ordenamientos, búsquedas, puntuación/ranking, agregados y un flujo de integración de extremo a extremo a nivel de funciones.

**Verificación de esta revisión:** `npm run typecheck` terminó sin errores; `npm test` pasó **71 de 71 pruebas** (0 fallos, 0 canceladas, 0 omitidas). Se ejecutaron ambas órdenes después de `npm ci`. La suite actual consta de cinco archivos de pruebas (`*.test.mjs`) y un archivo de fixtures ficticios.

> Nota: Node puede imprimir el aviso no bloqueante `MODULE_TYPELESS_PACKAGE_JSON` al importar TypeScript desde `.mjs`, dado que el paquete no declara `"type": "module"`. Debe informarse si aparece; no implica por sí mismo un fallo de pruebas.

### Ejemplos TypeScript

Los siguientes fragmentos son módulos TypeScript ilustrativos con imports relativos a archivos ubicados en la raíz. Todos los campos requeridos se completan y los datos son ficticios.

#### Crear y validar candidato y vacante

```typescript
import type { Candidate, Vacancy } from "./src/types/models";
import { validateCandidate, validateVacancy } from "./src/utils/validations";

const candidate: Candidate = {
  id: "C-DEMO-001",
  fullName: "Alex Ejemplo",
  email: "alex@example.test",
  phone: "+34 600 000 001",
  yearsOfExperience: 5,
  skills: ["TypeScript", "Node.js", "React"],
  englishLevel: "B2",
  seniority: "Senior",
  currentSalary: 50000,
  expectedSalary: 58000,
  availability: "2 weeks",
  location: "Valencia, España",
  remoteOnly: true,
  status: "Active",
};

const vacancy: Vacancy = {
  id: "V-DEMO-001",
  title: "Desarrollador/a full-stack",
  companyName: "Empresa Ejemplo",
  requiredSkills: ["TypeScript", "Node.js"],
  preferredSkills: ["React", "Docker"],
  minYearsExperience: 3,
  maxYearsExperience: 8,
  requiredEnglishLevel: "B2",
  requiredSeniority: "Senior",
  salaryRangeMin: 50000,
  salaryRangeMax: 65000,
  isRemote: true,
  location: "Valencia, España",
  status: "Open",
};

console.log(validateCandidate(candidate)); // { valid: true, errors: [] }
console.log(validateVacancy(vacancy)); // { valid: true, errors: [] }
```

#### Filtrar, ordenar, puntuar y rankear

```typescript
import {
  filterCandidatesBySkills,
  sortCandidatesBySalary,
} from "./src/utils/collections";
import {
  calculateCandidateScore,
  rankCandidatesForVacancy,
} from "./src/utils/transformations";
import type { Candidate, Vacancy } from "./src/types/models";

declare const candidates: Candidate[]; // Poblado con registros validados.
declare const vacancy: Vacancy;

const matches = filterCandidatesBySkills(candidates, vacancy.requiredSkills);
const byExpectedSalary = sortCandidatesBySalary(matches, "asc");
const score = calculateCandidateScore(byExpectedSalary[0], vacancy);
const ranking = rankCandidatesForVacancy(candidates, vacancy);

console.log({ score, ranking }); // ranking: Array<{ candidate, score }>
```

#### Búsqueda y reportes

```typescript
import { findCandidateByEmail } from "./src/utils/search";
import {
  calculateAverageSalary,
  countCandidatesByStatus,
  findTopSkills,
  groupCandidatesBySeniority,
} from "./src/utils/transformations";
import type { Candidate } from "./src/types/models";

declare const candidates: Candidate[];

const candidate = findCandidateByEmail(candidates, "ALEX@EXAMPLE.TEST");
const groups = groupCandidatesBySeniority(candidates);
const statusCounts = countCandidatesByStatus(candidates);
const averageExpectedSalary = calculateAverageSalary(candidates);
const topSkills = findTopSkills(candidates, 5);

console.log({
  candidate,
  groups,
  statusCounts,
  averageExpectedSalary,
  topSkills,
});
```

### Suite permanente y matriz de cumplimiento

Las pruebas están escritas con `node:test` y `node:assert/strict`. `tests/fixtures.mjs` fabrica candidatos, vacantes y procesos de selección ficticios. El conteo que debe considerarse vigente es el de una ejecución completa de `npm test` registrada durante la revisión, no un valor histórico.

La matriz contrasta requisitos funcionales del briefing y criterios de aceptación. “Cumple” indica que hay implementación y evidencia de prueba apropiada para el contrato indicado; “Parcial” señala un límite o una dimensión no demostrada completamente por la suite. Los nombres de archivos de prueba citados contienen las comprobaciones pertinentes.

| Requisito / criterio                                                                                               | Implementación: archivo y función/tipo                                                                 | Evidencia de prueba                                                                                                        | Estado y observaciones                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Modelos `Candidate`, `Vacancy`, `SelectionProcess`                                                                 | `src/types/models.ts` — tres interfaces                                                                | `tests/fixtures.mjs`; usos en los cinco `.test.mjs`                                                                        | **Cumple** — fixtures usan los campos del dominio y objetos tipados en TypeScript de producción.                                                                                                                                           |
| Uniones `EnglishLevel`, `SeniorityLevel`, `AvailabilityStatus`, `CandidateStatus`, `VacancyStatus`, `ProcessStage` | `src/types/models.ts`                                                                                  | `tests/validations.test.mjs`, `tests/collections.test.mjs`, `tests/transformations.test.mjs`, `tests/integration.test.mjs` | **Cumple** — los valores del dominio se consumen en las funciones.                                                                                                                                                                         |
| Reglas de validación de candidato y vacante; errores acumulados                                                    | `src/utils/validations.ts` — `validateCandidate`, `validateVacancy`                                    | `tests/validations.test.mjs`, `tests/integration.test.mjs`                                                                 | **Cumple** — incluye válido, límites, errores, entrada superior inválida y no mutación.                                                                                                                                                    |
| Email básico                                                                                                       | `src/utils/validations.ts` — `isValidEmail`                                                            | `tests/validations.test.mjs`                                                                                               | **Cumple** — entradas válidas e inválidas, incluyendo forma, espacios y valores no string.                                                                                                                                                 |
| Filtros por todas las skills (case-insensitive), seniority y disponibilidad                                        | `src/utils/collections.ts` — tres `filterCandidates*`                                                  | `tests/collections.test.mjs`, `tests/integration.test.mjs`                                                                 | **Cumple** — requisitos vacíos, coincidencia parcial, estados únicos/múltiples y casos normales.                                                                                                                                           |
| Ordenamiento por salario y experiencia asc/desc sin mutar                                                          | `src/utils/collections.ts` — `sortCandidatesBySalary`, `sortCandidatesByExperience`                    | `tests/collections.test.mjs`, `tests/integration.test.mjs`                                                                 | **Cumple** — direcciones, empates, array vacío y no mutación (assert explícito en salario).                                                                                                                                                |
| Búsqueda lineal por ID/email                                                                                       | `src/utils/search.ts` — `findCandidateById`, `findCandidateByEmail`                                    | `tests/search.test.mjs`, `tests/integration.test.mjs`                                                                      | **Cumple** — posiciones, ausencia, lista vacía y email case-insensitive.                                                                                                                                                                   |
| Búsqueda binaria por salario esperado ascendente                                                                   | `src/utils/search.ts` — `binarySearchCandidateBySalary`                                                | `tests/search.test.mjs`                                                                                                    | **Cumple** — extremos, centro, no encontrado, vacío, singleton, duplicados y no mutación.                                                                                                                                                  |
| Score por skills, experiencia, seniority, inglés y salario; rango 0–100                                            | `src/utils/transformations.ts` — `calculateCandidateScore`                                             | `tests/transformations.test.mjs`, `tests/integration.test.mjs`                                                             | **Cumple con decisión documentada** — se preservan pesos originales y se aplica tope 100 cuando el bruto excede ese rango.                                                                                                                 |
| Ranking descendente con candidato y score                                                                          | `src/utils/transformations.ts` — `rankCandidatesForVacancy`                                            | `tests/transformations.test.mjs`, `tests/integration.test.mjs`                                                             | **Cumple** — orden, empate estable y entrada vacía.                                                                                                                                                                                        |
| Grupos de todos los niveles y conteo de todos los estados                                                          | `src/utils/transformations.ts` — `groupCandidatesBySeniority`, `countCandidatesByStatus`               | `tests/transformations.test.mjs`, `tests/integration.test.mjs`                                                             | **Cumple** — claves y ceros para estados/grupos sin elementos.                                                                                                                                                                             |
| Salario promedio, top skills y fill rate con redondeo/orden                                                        | `src/utils/transformations.ts` — `calculateAverageSalary`, `findTopSkills`, `calculateVacancyFillRate` | `tests/transformations.test.mjs`, `tests/integration.test.mjs`                                                             | **Cumple con convención documentada** — lista vacía retorna 0 para promedio y fill rate; skills deduplicadas por candidato y desempate alfabético.                                                                                         |
| Type safety                                                                                                        | `src/types/models.ts`, `src/utils/*.ts`, `tsconfig.json` (`strict`)                                    | `npm run typecheck`                                                                                                        | **Cumple** — el typecheck de esta revisión terminó exitosamente.                                                                                                                                                                           |
| Casos límite: arrays vacíos, nulos y datos inválidos                                                               | `src/utils/validations.ts`; funciones de arrays en `src/utils/*.ts`                                    | `tests/validations.test.mjs`, `tests/collections.test.mjs`, `tests/search.test.mjs`, `tests/transformations.test.mjs`      | **Parcial** — vacíos y entradas no objeto de validadores/búsquedas se prueban; la mayoría de APIs de colección/transformation exige arrays/objetos válidos según tipos y no ofrece contrato general para `null` o estructuras malformadas. |
| Organización por responsabilidad y convenciones de nombres                                                         | `src/types/models.ts`, `src/utils/{validations,collections,search,transformations}.ts`                 | Inventario de código y suite `tests/*.test.mjs`                                                                            | **Cumple** — rutas y nombres corresponden a lo pedido.                                                                                                                                                                                     |
| Funciones puras / sin estado global                                                                                | Funciones exportadas en `src/utils/*.ts`                                                               | `tests/validations.test.mjs`, `tests/collections.test.mjs`, `tests/search.test.mjs`, `tests/transformations.test.mjs`      | **Cumple** en código revisado — no hay estado global mutable; pruebas de no mutación explícitas cubren validadores, ordenamientos, búsqueda y ranking.                                                                                     |

La matriz no sustituye criterios adicionales del evaluador ni afirma que el módulo esté desplegado en producción. “Parcial” en el contrato de entradas nulas/malformadas queda explícito para no prometer robustez no definida por los tipos o no cubierta universalmente por tests.

---

## Contributors

This template was built as part of the 4Geeks Academy AI Engineering Career Program by [@marcogonzalo](https://www.linkedin.com/in/marcogonzalo) and [@alesanchezr](https://x.com/alesanchezr) and many other contributors. Find out more about our [AI Engineering Course](https://4geeksacademy.com/en/career-programs/ai-engineering), and [other courses](https://4geeksacademy.com/en/program-comparison).

You can find other templates and resources like this at the [4Geeks Academy GitHub page](https://github.com/4geeksacademy).

_This template is maintained by 4Geeks Academy for the AI Engineering track. For exclusive use in the programme._
