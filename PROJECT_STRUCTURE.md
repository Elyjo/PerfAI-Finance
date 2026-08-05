perfai-finance-frontend/

├── src/
│
│ ├── app/
│ │
│ │ ├── (auth)/
│ │ │ ├── login/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── callback/
│ │ │ │ └── route.ts
│ │ │ │
│ │ │ └── layout.tsx
│ │ │
│ │ │
│ │ ├── (protected)/
│ │ │ │
│ │ │ ├── dashboard/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── clients/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── credit-requests/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ ├── risk-analysis/
│ │ │ │ └── page.tsx
│ │ │ │
│ │ │ └── layout.tsx
│ │ │
│ │ │
│ │ ├── page.tsx
│ │ └── globals.css
│ │
│ │
│ ├── components/
│ │
│ │ ├── landing/
│ │ │ ├── Hero.tsx
│ │ │ ├── ProblemSection.tsx
│ │ │ ├── SolutionSection.tsx
│ │ │ ├── FeaturesSection.tsx
│ │ │ ├── HowItWorks.tsx
│ │ │ ├── CTASection.tsx
│ │ │ └── Footer.tsx
│ │ │
│ │ │
│ │ ├── dashboard/
│ │ │ ├── DashboardNavbar.tsx
│ │ │ ├── DashboardSidebar.tsx
│ │ │ ├── AiAnalysisCard.tsx
│ │ │ ├── SmartAlertsCard.tsx
│ │ │ └── PerformanceChart.tsx
│ │ │
│ │ │
│ │ ├── clients/
│ │ │ ├── ClientTable.tsx
│ │ │ ├── ClientCard.tsx
│ │ │ ├── ClientDetails.tsx
│ │ │ ├── ClientFormModal.tsx
│ │ │ ├── AiClientInsights.tsx
│ │ │ └── RecentClientActivityCard.tsx
│ │ │
│ │ │
│ │ ├── credit/
│ │ │ ├── CreditRequestsTable.tsx
│ │ │ ├── CreditRequestFormModal.tsx
│ │ │ ├── CreditStatusBadge.tsx
│ │ │ ├── CreditDetails.tsx
│ │ │ └── RiskLevelBadge.tsx
│ │ │
│ │ │
│ │ ├── analysis/
│ │ │ ├── RiskScore.tsx
│ │ │ ├── RiskIndicator.tsx
│ │ │ ├── AiRiskRecommendation.tsx
│ │ │ └── RiskAnalysisResult.tsx
│ │ │
│ │ │
│ │ └── shared/
│ │ ├── KpiCard.tsx
│ │ ├── Button.tsx
│ │ ├── Modal.tsx
│ │ ├── EmptyState.tsx
│ │ ├── Loading.tsx
│ │ └── DataTable.tsx
│ │
│ │
│ ├── lib/
│ │ ├── supabase.ts
│ │ ├── utils.ts
│ │ └── constants.ts
│ │
│ │
│ ├── hooks/
│ │ ├── useAuth.ts
│ │ ├── useClients.ts
│ │ ├── useCreditRequests.ts
│ │ └── useRiskAnalysis.ts
│ │
│ │
│ ├── types/
│ │ ├── client.ts
│ │ ├── credit.ts
│ │ ├── analysis.ts
│ │ └── alert.ts
│ │
│ │
│ └── utils/
│ └── formatters.ts
│
│
├── public/
│ ├── logo/
│ └── images/
│
│
├── .env.example
├── package.json
└── README.md


### Notes architecture :

```md
## Architecture Notes

### Removed modules

- Reports:
  - Removed because it belongs to PerfAI employee performance management.
  - Financial reporting is handled through credit requests and risk analysis.

- Alerts:
  - Removed as a dedicated page.
  - AI alerts are now contextual and displayed inside:
    - Dashboard
    - Client analysis
    - Credit requests
    - Risk analysis

- Settings:
  - Postponed for future versions.
  - Not required for MVP/hackathon.


## Current MVP Workflow

1. Agent creates a client profile.
2. Agent records a credit request.
3. AI analyzes financial risk.
4. System provides:
   - Risk score
   - Risk indicators
   - AI recommendations
   - Decision support.