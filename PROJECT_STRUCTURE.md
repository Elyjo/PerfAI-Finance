# PerfAI Finance Frontend Structure

## Architecture
src/
├── app/
├── components/
├── lib/
├── hooks/
├── types/
└── utils/


---

## App Router (`src/app`)

Gestion des routes Next.js.

app/
├── (auth)/
│ ├── login/
│ └── callback/
│
└── (protected)/
├── dashboard/
├── clients/
├── credit-requests/
└── risk-analysis/


- `(auth)` : routes accessibles avant authentification.
- `(protected)` : espace sécurisé réservé aux agents financiers.

---

## Components (`src/components`)

Les composants UI sont organisés par domaine métier.

### Dashboard

Composants liés à la vue globale :
dashboard/
├── DashboardNavbar.tsx
├── DashboardSidebar.tsx
├── PerformanceChart.tsx
├── AiAnalysisCard.tsx
└── SmartAlertsCard.tsx


### Clients

Gestion des clients :
clients/
├── ClientTable.tsx
├── ClientFormModal.tsx
├── ClientDetails.tsx
└── AiClientInsights.tsx


### Credit

Gestion des demandes de crédit :
credit/
├── CreditRequestsTable.tsx
├── CreditRequestFormModal.tsx
├── CreditStatusBadge.tsx
└── RiskLevelBadge.tsx


### Analysis

Analyse financière et scoring IA :
analysis/
├── RiskScore.tsx
├── RiskIndicator.tsx
├── AiRiskRecommendation.tsx
└── RiskAnalysisResult.ts


### Shared

Composants réutilisables :
shared/
├── KpiCard.tsx
├── Modal.tsx
├── DataTable.tsx
└── EmptyState.tsx


---

## Lib (`src/lib`)

Configuration et services externes :
lib/
├── supabase.ts
├── constants.ts
└── utils.ts

---

## Hooks (`src/hooks`)

Logique réutilisable côté client :
hooks/
├── useAuth.ts
├── useClients.ts
├── useCreditRequests.ts
└── useRiskAnalysis.ts


---

## Types (`src/types`)

Types TypeScript du domaine :
types/
├── client.ts
├── credit.ts
├── analysis.ts
└── alert.ts


---

## Philosophie d'organisation

PerfAI Finance suit une organisation **feature-based architecture** :

- chaque domaine métier possède ses propres composants ;
- les composants partagés restent dans `shared` ;
- les pages restent responsables de l'assemblage ;
- la logique métier est séparée de l'affichage.
