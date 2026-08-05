perfai-finance-frontend/

├── src/
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   │
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── clients/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── credit-requests/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── risk-analysis/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   │
│   │   │   └── layout.tsx
│   │   │
│   │   ├── page.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   │
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── ProblemSection.tsx
│   │   │   ├── SolutionSection.tsx
│   │   │   ├── FeaturesSection.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── CTASection.tsx
│   │   │   └── Footer.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── StatCard.tsx
│   │   │   ├── RiskCard.tsx
│   │   │   ├── AlertCard.tsx
│   │   │   └── ActivityChart.tsx
│   │   │
│   │   ├── clients/
│   │   │   ├── ClientTable.tsx
│   │   │   ├── ClientCard.tsx
│   │   │   ├── ClientForm.tsx
│   │   │   └── ClientDetails.tsx
│   │   │
│   │   ├── credit/
│   │   │   ├── CreditRequestTable.tsx
│   │   │   ├── CreditRequestForm.tsx
│   │   │   ├── CreditStatusBadge.tsx
│   │   │   └── CreditDetails.tsx
│   │   │
│   │   ├── analysis/
│   │   │   ├── RiskScore.tsx
│   │   │   ├── RiskIndicator.tsx
│   │   │   ├── AIRecommendation.tsx
│   │   │   └── AnalysisResult.tsx
│   │   │
│   │   ├── alerts/
│   │   │   ├── AlertsTable.tsx
│   │   │   ├── AlertItem.tsx
│   │   │   └── SeverityBadge.tsx
│   │   │
│   │   └── shared/
│   │       ├── Button.tsx
│   │       ├── Modal.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Loading.tsx
│   │       └── DataTable.tsx
│   │
│   ├── components/ui/
│   │   └── (shadcn ou composants génériques)
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── utils.ts
│   │   └── constants.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useClients.ts
│   │   ├── useCreditRequests.ts
│   │   └── useRiskAnalysis.ts
│   │
│   ├── types/
│   │   ├── client.ts
│   │   ├── credit.ts
│   │   ├── analysis.ts
│   │   └── alert.ts
│   │
│   └── utils/
│       └── formatters.ts
│
├── public/
│   ├── logo/
│   └── images/
│
├── .env.example
├── package.json
└── README.md